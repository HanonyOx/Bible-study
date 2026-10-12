create function public.record_editorial_event(
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_details jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.curriculum_audit_events (
    actor_id,
    action,
    entity_type,
    entity_id,
    details
  )
  values (
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    coalesce(p_details, '{}'::jsonb)
  );
$$;

alter function public.record_editorial_event(text, uuid, text, jsonb)
  owner to postgres;
revoke all on function public.record_editorial_event(text, uuid, text, jsonb)
  from public, anon, authenticated, service_role;

create function public.submit_curriculum_for_review(p_curriculum_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  curriculum_row public.curriculum_editions%rowtype;
  caller_id uuid := auth.uid();
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;

  select *
  into curriculum_row
  from public.curriculum_editions
  where id = p_curriculum_id
  for update;

  if not found then
    raise exception 'Curriculum edition not found'
      using errcode = 'P0002';
  end if;
  if curriculum_row.publication_status = 'published'
    or curriculum_row.review_status not in ('not_reviewed', 'rejected') then
    raise exception 'Curriculum edition is not eligible for review submission'
      using errcode = '55000';
  end if;
  if curriculum_row.content_origin = 'licensed_external'
    and not (
      curriculum_row.source_status = 'verified'
      and curriculum_row.source_verified_at is not null
      and curriculum_row.usage_rights_status = 'approved'
      and curriculum_row.usage_rights_verified_at is not null
      and nullif(pg_catalog.btrim(curriculum_row.usage_rights_evidence_ref), '') is not null
    ) then
    raise exception 'External curriculum requires verified source and approved usage-rights evidence'
      using errcode = '23514';
  end if;

  update public.curriculum_editions
  set review_status = 'in_review',
      reviewed_at = null,
      reviewed_by = null
  where id = p_curriculum_id;

  perform public.record_editorial_event(
    'curriculum_editions',
    p_curriculum_id,
    'review_submitted',
    '{}'::jsonb
  );
end;
$$;

create function public.review_curriculum(
  p_curriculum_id uuid,
  p_decision text,
  p_feedback text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  curriculum_row public.curriculum_editions%rowtype;
  caller_id uuid := auth.uid();
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;
  if p_decision is null or p_decision not in ('approved', 'rejected') then
    raise exception 'Decision must be approved or rejected'
      using errcode = '22023';
  end if;
  if p_decision = 'rejected'
    and nullif(pg_catalog.btrim(p_feedback), '') is null then
    raise exception 'A reason is required when returning curriculum for edits'
      using errcode = '22023';
  end if;

  select *
  into curriculum_row
  from public.curriculum_editions
  where id = p_curriculum_id
  for update;
  if not found then
    raise exception 'Curriculum edition not found'
      using errcode = 'P0002';
  end if;
  if curriculum_row.review_status <> 'in_review'
    or curriculum_row.publication_status = 'published' then
    raise exception 'Curriculum edition is not awaiting review'
      using errcode = '55000';
  end if;
  if p_decision = 'approved'
    and curriculum_row.content_origin = 'licensed_external'
    and not (
      curriculum_row.source_status = 'verified'
      and curriculum_row.source_verified_at is not null
      and curriculum_row.usage_rights_status = 'approved'
      and curriculum_row.usage_rights_verified_at is not null
      and nullif(pg_catalog.btrim(curriculum_row.usage_rights_evidence_ref), '') is not null
    ) then
    raise exception 'External curriculum requires verified source and approved usage-rights evidence'
      using errcode = '23514';
  end if;

  update public.curriculum_editions
  set review_status = p_decision,
      reviewed_at = pg_catalog.clock_timestamp(),
      reviewed_by = caller_id
  where id = p_curriculum_id;

  perform public.record_editorial_event(
    'curriculum_editions',
    p_curriculum_id,
    case when p_decision = 'approved' then 'review_approved' else 'review_rejected' end,
    pg_catalog.jsonb_build_object('feedback', p_feedback)
  );
end;
$$;

create function public.publish_curriculum(p_curriculum_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  curriculum_row public.curriculum_editions%rowtype;
  caller_id uuid := auth.uid();
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;

  select *
  into curriculum_row
  from public.curriculum_editions
  where id = p_curriculum_id
  for update;
  if not found then
    raise exception 'Curriculum edition not found'
      using errcode = 'P0002';
  end if;
  if curriculum_row.review_status <> 'approved'
    or curriculum_row.reviewed_at is null
    or curriculum_row.reviewed_by is null
    or curriculum_row.publication_status not in ('draft', 'withdrawn') then
    raise exception 'Curriculum edition must be approved and unpublished before publishing'
      using errcode = '55000';
  end if;
  if curriculum_row.content_origin = 'original_word_and_way' then
    if curriculum_row.publisher <> 'Word & Way'
      or nullif(pg_catalog.btrim(curriculum_row.source_title), '') is null
      or curriculum_row.source_status <> 'not_applicable'
      or curriculum_row.source_verified_at is not null
      or curriculum_row.usage_rights_status <> 'not_applicable'
      or curriculum_row.usage_rights_evidence_ref is not null
      or curriculum_row.usage_rights_verified_at is not null then
      raise exception 'Original Word & Way attribution and non-applicable rights status are required'
        using errcode = '23514';
    end if;
  elsif curriculum_row.content_origin = 'licensed_external' then
    if curriculum_row.source_status <> 'verified'
      or curriculum_row.source_verified_at is null
      or curriculum_row.usage_rights_status <> 'approved'
      or curriculum_row.usage_rights_verified_at is null
      or nullif(pg_catalog.btrim(curriculum_row.usage_rights_evidence_ref), '') is null then
      raise exception 'External curriculum requires verified source and approved usage-rights evidence'
        using errcode = '23514';
    end if;
  else
    raise exception 'Unsupported curriculum origin'
      using errcode = '23514';
  end if;

  update public.curriculum_editions
  set publication_status = 'published',
      published_at = pg_catalog.clock_timestamp(),
      published_by = caller_id
  where id = p_curriculum_id;

  perform public.record_editorial_event(
    'curriculum_editions',
    p_curriculum_id,
    'published',
    '{}'::jsonb
  );
end;
$$;

create function public.submit_lesson_for_review(p_lesson_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  lesson_row public.lessons%rowtype;
  caller_id uuid := auth.uid();
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;

  select *
  into lesson_row
  from public.lessons
  where id = p_lesson_id
  for update;
  if not found then
    raise exception 'Lesson not found'
      using errcode = 'P0002';
  end if;
  if lesson_row.publication_status = 'published'
    or lesson_row.review_status not in ('not_reviewed', 'rejected') then
    raise exception 'Lesson is not eligible for review submission'
      using errcode = '55000';
  end if;

  update public.lessons
  set review_status = 'in_review',
      reviewed_at = null,
      reviewed_by = null
  where id = p_lesson_id;

  perform public.record_editorial_event(
    'lessons',
    p_lesson_id,
    'review_submitted',
    '{}'::jsonb
  );
end;
$$;

create function public.save_lesson_draft(
  p_lesson_id uuid,
  p_content jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  lesson_row public.lessons%rowtype;
  caller_id uuid := auth.uid();
  item jsonb;
  item_text text;
  item_index integer;
  discussion_section_id uuid;
  parsed_date date;
  section_index integer := 0;
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;
  if p_content is null or pg_catalog.jsonb_typeof(p_content) <> 'object'
    or not (p_content ?& array[
      'title',
      'age_group',
      'lesson_date',
      'sequence_number',
      'introduction',
      'practical_application',
      'memory_verse_reference',
      'closing_prayer',
      'age_appropriate_explanation',
      'interactive_activity',
      'simple_takeaway',
      'scripture_references',
      'learning_objectives',
      'teaching_points',
      'discussion_questions'
    ]) then
    raise exception 'Lesson draft content is missing required fields'
      using errcode = '22023';
  end if;
  if pg_catalog.jsonb_typeof(p_content -> 'title') <> 'string'
    or nullif(pg_catalog.btrim(p_content ->> 'title'), '') is null
    or p_content ->> 'age_group' not in ('children', 'teens', 'adults')
    or pg_catalog.jsonb_typeof(p_content -> 'sequence_number') <> 'number'
    or pg_catalog.jsonb_typeof(p_content -> 'introduction') <> 'string'
    or pg_catalog.jsonb_typeof(p_content -> 'practical_application') <> 'string'
    or pg_catalog.jsonb_typeof(p_content -> 'memory_verse_reference') <> 'string'
    or pg_catalog.jsonb_typeof(p_content -> 'closing_prayer') <> 'string' then
    raise exception 'Lesson draft metadata has an invalid value'
      using errcode = '22023';
  end if;
  if (p_content ->> 'sequence_number')::numeric <= 0
    or (p_content ->> 'sequence_number')::numeric
      <> pg_catalog.trunc((p_content ->> 'sequence_number')::numeric) then
    raise exception 'Lesson sequence number must be a positive integer'
      using errcode = '22023';
  end if;
  if pg_catalog.jsonb_typeof(p_content -> 'scripture_references') <> 'array'
    or pg_catalog.jsonb_typeof(p_content -> 'learning_objectives') <> 'array'
    or pg_catalog.jsonb_typeof(p_content -> 'teaching_points') <> 'array'
    or pg_catalog.jsonb_typeof(p_content -> 'discussion_questions') <> 'array' then
    raise exception 'Lesson content lists must be JSON arrays'
      using errcode = '22023';
  end if;
  foreach item_text in array array[
    'age_appropriate_explanation',
    'interactive_activity',
    'simple_takeaway'
  ]
  loop
    if pg_catalog.jsonb_typeof(p_content -> item_text) not in ('string', 'null') then
      raise exception 'Optional lesson field % must be text or null', item_text
        using errcode = '22023';
    end if;
  end loop;
  begin
    if pg_catalog.jsonb_typeof(p_content -> 'lesson_date') = 'null' then
      parsed_date := null;
    elsif pg_catalog.jsonb_typeof(p_content -> 'lesson_date') = 'string' then
      parsed_date := (p_content ->> 'lesson_date')::date;
    else
      raise exception 'Lesson date must be a date string or null'
        using errcode = '22023';
    end if;
  exception
    when invalid_datetime_format or datetime_field_overflow then
      raise exception 'Lesson date must be a valid ISO date'
        using errcode = '22023';
  end;

  select *
  into lesson_row
  from public.lessons
  where id = p_lesson_id
  for update;
  if not found then
    raise exception 'Lesson not found'
      using errcode = 'P0002';
  end if;
  if lesson_row.publication_status = 'published'
    or lesson_row.review_status not in ('not_reviewed', 'rejected') then
    raise exception 'Only draft or returned lessons can be edited'
      using errcode = '55000';
  end if;

  for item in
    select value from pg_catalog.jsonb_array_elements(p_content -> 'scripture_references')
  loop
    if pg_catalog.jsonb_typeof(item) <> 'string'
      or nullif(pg_catalog.btrim(item #>> '{}'), '') is null then
      raise exception 'Scripture references must be non-empty text'
        using errcode = '22023';
    end if;
  end loop;
  for item in
    select value from pg_catalog.jsonb_array_elements(p_content -> 'learning_objectives')
  loop
    if pg_catalog.jsonb_typeof(item) <> 'string'
      or nullif(pg_catalog.btrim(item #>> '{}'), '') is null then
      raise exception 'Learning objectives must be non-empty text'
        using errcode = '22023';
    end if;
  end loop;
  for item in
    select value from pg_catalog.jsonb_array_elements(p_content -> 'teaching_points')
  loop
    if pg_catalog.jsonb_typeof(item) <> 'object'
      or pg_catalog.jsonb_typeof(item -> 'title') <> 'string'
      or nullif(pg_catalog.btrim(item ->> 'title'), '') is null
      or pg_catalog.jsonb_typeof(item -> 'student_content') <> 'string'
      or nullif(pg_catalog.btrim(item ->> 'student_content'), '') is null then
      raise exception 'Each teaching point requires a title and student content'
        using errcode = '22023';
    end if;
  end loop;
  for item in
    select value from pg_catalog.jsonb_array_elements(p_content -> 'discussion_questions')
  loop
    if pg_catalog.jsonb_typeof(item) <> 'string'
      or nullif(pg_catalog.btrim(item #>> '{}'), '') is null then
      raise exception 'Discussion questions must be non-empty text'
        using errcode = '22023';
    end if;
  end loop;

  update public.lessons
  set title = pg_catalog.btrim(p_content ->> 'title'),
      age_group = p_content ->> 'age_group',
      lesson_date = parsed_date,
      sequence_number = (p_content ->> 'sequence_number')::integer,
      introduction = p_content ->> 'introduction',
      practical_application = p_content ->> 'practical_application',
      memory_verse_reference = p_content ->> 'memory_verse_reference',
      closing_prayer = p_content ->> 'closing_prayer',
      age_appropriate_explanation = p_content ->> 'age_appropriate_explanation',
      interactive_activity = p_content ->> 'interactive_activity',
      simple_takeaway = p_content ->> 'simple_takeaway',
      review_status = 'not_reviewed',
      reviewed_at = null,
      reviewed_by = null,
      publication_status = 'draft',
      published_at = null,
      published_by = null
  where id = p_lesson_id;

  delete from public.lesson_scripture_references
  where lesson_id = p_lesson_id;
  delete from public.lesson_learning_objectives
  where lesson_id = p_lesson_id;
  delete from public.lesson_sections
  where lesson_id = p_lesson_id;

  for item_index in 1..pg_catalog.jsonb_array_length(p_content -> 'scripture_references')
  loop
    insert into public.lesson_scripture_references (
      lesson_id, sequence_number, reference
    )
    values (
      p_lesson_id,
      item_index,
      p_content -> 'scripture_references' ->> (item_index - 1)
    );
  end loop;
  for item_index in 1..pg_catalog.jsonb_array_length(p_content -> 'learning_objectives')
  loop
    insert into public.lesson_learning_objectives (
      lesson_id, sequence_number, objective
    )
    values (
      p_lesson_id,
      item_index,
      p_content -> 'learning_objectives' ->> (item_index - 1)
    );
  end loop;
  for item_index in 1..pg_catalog.jsonb_array_length(p_content -> 'teaching_points')
  loop
    insert into public.lesson_sections (
      lesson_id, sequence_number, section_kind, title, student_content
    )
    values (
      p_lesson_id,
      item_index,
      'teaching_point',
      p_content -> 'teaching_points' -> item_index - 1 ->> 'title',
      p_content -> 'teaching_points' -> item_index - 1 ->> 'student_content'
    );
  end loop;

  if pg_catalog.jsonb_array_length(p_content -> 'discussion_questions') > 0 then
    section_index := pg_catalog.jsonb_array_length(p_content -> 'teaching_points') + 1;
    insert into public.lesson_sections (
      lesson_id, sequence_number, section_kind, title, student_content
    )
    values (
      p_lesson_id,
      section_index,
      'discussion',
      'Discussion questions',
      ''
    )
    returning id into discussion_section_id;

    for item_index in 1..pg_catalog.jsonb_array_length(p_content -> 'discussion_questions')
    loop
      insert into public.lesson_discussion_questions (
        section_id, sequence_number, question
      )
      values (
        discussion_section_id,
        item_index,
        p_content -> 'discussion_questions' ->> (item_index - 1)
      );
    end loop;
  end if;

  perform public.record_editorial_event(
    'lessons',
    p_lesson_id,
    'draft_saved',
    pg_catalog.jsonb_build_object(
      'title', pg_catalog.btrim(p_content ->> 'title'),
      'age_group', p_content ->> 'age_group'
    )
  );
end;
$$;

create function public.review_lesson(
  p_lesson_id uuid,
  p_decision text,
  p_feedback text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  lesson_row public.lessons%rowtype;
  caller_id uuid := auth.uid();
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;
  if p_decision is null or p_decision not in ('approved', 'rejected') then
    raise exception 'Decision must be approved or rejected'
      using errcode = '22023';
  end if;
  if p_decision = 'rejected'
    and nullif(pg_catalog.btrim(p_feedback), '') is null then
    raise exception 'A reason is required when returning a lesson for edits'
      using errcode = '22023';
  end if;

  select *
  into lesson_row
  from public.lessons
  where id = p_lesson_id
  for update;
  if not found then
    raise exception 'Lesson not found'
      using errcode = 'P0002';
  end if;
  if lesson_row.review_status <> 'in_review'
    or lesson_row.publication_status = 'published' then
    raise exception 'Lesson is not awaiting review'
      using errcode = '55000';
  end if;

  update public.lessons
  set review_status = p_decision,
      reviewed_at = pg_catalog.clock_timestamp(),
      reviewed_by = caller_id
  where id = p_lesson_id;

  perform public.record_editorial_event(
    'lessons',
    p_lesson_id,
    case when p_decision = 'approved' then 'review_approved' else 'review_rejected' end,
    pg_catalog.jsonb_build_object('feedback', p_feedback)
  );
end;
$$;

create function public.publish_lesson(p_lesson_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  lesson_row public.lessons%rowtype;
  caller_id uuid := auth.uid();
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;

  select *
  into lesson_row
  from public.lessons
  where id = p_lesson_id
  for update;
  if not found then
    raise exception 'Lesson not found'
      using errcode = 'P0002';
  end if;
  if lesson_row.review_status <> 'approved'
    or lesson_row.reviewed_at is null
    or lesson_row.reviewed_by is null
    or lesson_row.publication_status not in ('draft', 'withdrawn') then
    raise exception 'Lesson must be approved and unpublished before publishing'
      using errcode = '55000';
  end if;
  if nullif(pg_catalog.btrim(lesson_row.title), '') is null
    or nullif(pg_catalog.btrim(lesson_row.introduction), '') is null
    or nullif(pg_catalog.btrim(lesson_row.practical_application), '') is null
    or nullif(pg_catalog.btrim(lesson_row.memory_verse_reference), '') is null
    or nullif(pg_catalog.btrim(lesson_row.closing_prayer), '') is null then
    raise exception 'Lesson title, introduction, application, memory verse reference, and closing prayer are required'
      using errcode = '23514';
  end if;
  if not exists (
    select 1 from public.lesson_scripture_references as reference
    where reference.lesson_id = p_lesson_id
      and nullif(pg_catalog.btrim(reference.reference), '') is not null
  ) then
    raise exception 'At least one Scripture reference is required'
      using errcode = '23514';
  end if;
  if not exists (
    select 1 from public.lesson_learning_objectives as objective
    where objective.lesson_id = p_lesson_id
      and nullif(pg_catalog.btrim(objective.objective), '') is not null
  ) then
    raise exception 'At least one learning objective is required'
      using errcode = '23514';
  end if;
  if not exists (
    select 1 from public.lesson_sections as section
    where section.lesson_id = p_lesson_id
      and section.section_kind = 'teaching_point'
      and nullif(pg_catalog.btrim(section.title), '') is not null
      and nullif(pg_catalog.btrim(section.student_content), '') is not null
  ) then
    raise exception 'At least one complete teaching section is required'
      using errcode = '23514';
  end if;
  if not exists (
    select 1
    from public.lesson_sections as section
    join public.lesson_discussion_questions as question
      on question.section_id = section.id
    where section.lesson_id = p_lesson_id
      and section.section_kind = 'discussion'
      and nullif(pg_catalog.btrim(question.question), '') is not null
  ) then
    raise exception 'At least one discussion question is required'
      using errcode = '23514';
  end if;
  if not exists (
    select 1
    from public.curriculum_editions as curriculum
    where curriculum.id = lesson_row.curriculum_id
      and curriculum.review_status = 'approved'
      and curriculum.reviewed_at is not null
      and curriculum.reviewed_by is not null
      and curriculum.publication_status = 'published'
      and curriculum.published_at is not null
      and curriculum.published_by is not null
      and (
        (
          curriculum.content_origin = 'original_word_and_way'
          and curriculum.publisher = 'Word & Way'
          and nullif(pg_catalog.btrim(curriculum.source_title), '') is not null
          and curriculum.source_status = 'not_applicable'
          and curriculum.source_verified_at is null
          and curriculum.usage_rights_status = 'not_applicable'
          and curriculum.usage_rights_evidence_ref is null
          and curriculum.usage_rights_verified_at is null
        )
        or (
          curriculum.content_origin = 'licensed_external'
          and curriculum.source_status = 'verified'
          and curriculum.source_verified_at is not null
          and curriculum.usage_rights_status = 'approved'
          and curriculum.usage_rights_verified_at is not null
          and nullif(pg_catalog.btrim(curriculum.usage_rights_evidence_ref), '') is not null
        )
      )
  ) then
    raise exception 'The parent curriculum must be approved, published, and eligible'
      using errcode = '23514';
  end if;

  update public.lessons
  set publication_status = 'published',
      published_at = pg_catalog.clock_timestamp(),
      published_by = caller_id
  where id = p_lesson_id;

  perform public.record_editorial_event(
    'lessons',
    p_lesson_id,
    'published',
    '{}'::jsonb
  );
end;
$$;

create function public.unpublish_lesson(
  p_lesson_id uuid,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;
  if nullif(pg_catalog.btrim(p_reason), '') is null then
    raise exception 'A reason is required to unpublish a lesson'
      using errcode = '22023';
  end if;

  update public.lessons
  set publication_status = 'withdrawn'
  where id = p_lesson_id
    and publication_status = 'published';
  if not found then
    raise exception 'Published lesson not found'
      using errcode = 'P0002';
  end if;

  perform public.record_editorial_event(
    'lessons',
    p_lesson_id,
    'unpublished',
    pg_catalog.jsonb_build_object('reason', p_reason)
  );
end;
$$;

alter function public.submit_curriculum_for_review(uuid) owner to postgres;
alter function public.review_curriculum(uuid, text, text) owner to postgres;
alter function public.publish_curriculum(uuid) owner to postgres;
alter function public.submit_lesson_for_review(uuid) owner to postgres;
alter function public.review_lesson(uuid, text, text) owner to postgres;
alter function public.publish_lesson(uuid) owner to postgres;
alter function public.unpublish_lesson(uuid, text) owner to postgres;
alter function public.save_lesson_draft(uuid, jsonb) owner to postgres;

revoke all on function public.submit_curriculum_for_review(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.review_curriculum(uuid, text, text)
  from public, anon, authenticated, service_role;
revoke all on function public.publish_curriculum(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.submit_lesson_for_review(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.review_lesson(uuid, text, text)
  from public, anon, authenticated, service_role;
revoke all on function public.publish_lesson(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.unpublish_lesson(uuid, text)
  from public, anon, authenticated, service_role;
revoke all on function public.save_lesson_draft(uuid, jsonb)
  from public, anon, authenticated, service_role;

grant execute on function public.submit_curriculum_for_review(uuid)
  to authenticated;
grant execute on function public.review_curriculum(uuid, text, text)
  to authenticated;
grant execute on function public.publish_curriculum(uuid)
  to authenticated;
grant execute on function public.submit_lesson_for_review(uuid)
  to authenticated;
grant execute on function public.review_lesson(uuid, text, text)
  to authenticated;
grant execute on function public.publish_lesson(uuid)
  to authenticated;
grant execute on function public.unpublish_lesson(uuid, text)
  to authenticated;
grant execute on function public.save_lesson_draft(uuid, jsonb)
  to authenticated;
