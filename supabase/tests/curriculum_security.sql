-- Run against the dedicated disposable local Supabase database after applying
-- local migrations. This script rolls back all test fixtures.
begin;

do $$
declare
  public_execute boolean;
  relation_name text;
  function_owner name;
  function_is_definer boolean;
begin
  foreach relation_name in array array[
    'profiles',
    'curriculum_editions',
    'lessons',
    'lesson_sections',
    'lesson_discussion_questions',
    'lesson_scripture_references',
    'lesson_learning_objectives',
    'teacher_lesson_materials',
    'curriculum_audit_events',
    'curriculum_admins',
    'churches',
    'sunday_school_classes',
    'class_teacher_assignments',
    'class_student_enrollments',
    'lesson_progress',
    'access_audit_events'
  ]
  loop
    if not (
      select relrowsecurity
      from pg_catalog.pg_class
      where oid = pg_catalog.to_regclass('public.' || relation_name)
    ) then
      raise exception 'RLS is not enabled on %', relation_name;
    end if;

    if (
      relation_name not in ('lesson_progress', 'profiles')
      and (
        has_table_privilege('authenticated', 'public.' || relation_name, 'INSERT')
        or has_table_privilege('authenticated', 'public.' || relation_name, 'UPDATE')
        or has_table_privilege('authenticated', 'public.' || relation_name, 'DELETE')
      )
    )
      or (
        relation_name <> 'profiles'
        and (
          has_table_privilege('service_role', 'public.' || relation_name, 'INSERT')
          or has_table_privilege('service_role', 'public.' || relation_name, 'UPDATE')
          or has_table_privilege('service_role', 'public.' || relation_name, 'DELETE')
        )
      ) then
      raise exception 'client/service role has write privileges on %', relation_name;
    end if;
  end loop;

  if has_table_privilege('authenticated', 'public.profiles', 'INSERT')
    or has_table_privilege('authenticated', 'public.profiles', 'DELETE')
    or not has_column_privilege(
      'authenticated',
      'public.profiles',
      'display_name',
      'UPDATE'
    )
    or has_column_privilege(
      'authenticated',
      'public.profiles',
      'id',
      'UPDATE'
    )
    or has_column_privilege(
      'authenticated',
      'public.profiles',
      'created_at',
      'UPDATE'
    )
    or has_column_privilege(
      'authenticated',
      'public.profiles',
      'updated_at',
      'UPDATE'
    ) then
    raise exception 'profile grants allow changes beyond the users own display name';
  end if;

  if not has_column_privilege(
    'authenticated',
    'public.lessons',
    'title',
    'SELECT'
  ) then
    raise exception 'authenticated is missing lesson SELECT';
  end if;
  if has_column_privilege(
    'authenticated',
    'public.lessons',
    'review_status',
    'SELECT'
  ) or has_column_privilege(
    'authenticated',
    'public.lessons',
    'reviewed_by',
    'SELECT'
  ) then
    raise exception 'authenticated can read internal lesson review metadata';
  end if;
  if not has_column_privilege(
    'authenticated',
    'public.curriculum_editions',
    'content_origin',
    'SELECT'
  ) or not has_column_privilege(
    'authenticated',
    'public.lessons',
    'introduction',
    'SELECT'
  ) or not has_column_privilege(
    'authenticated',
    'public.lesson_sections',
    'section_kind',
    'SELECT'
  ) then
    raise exception 'authenticated is missing student-content columns';
  end if;
  if has_table_privilege('anon', 'public.lessons', 'SELECT') then
    raise exception 'anon can select lessons';
  end if;
  if not has_table_privilege('authenticated', 'public.teacher_lesson_materials', 'SELECT')
    or has_table_privilege('service_role', 'public.teacher_lesson_materials', 'SELECT') then
    raise exception 'teacher material table grants are not limited to authenticated RLS readers';
  end if;
  if has_table_privilege('authenticated', 'public.curriculum_audit_events', 'SELECT')
    or has_table_privilege('service_role', 'public.curriculum_audit_events', 'SELECT') then
    raise exception 'client roles can select curriculum audit events';
  end if;
  if has_table_privilege('authenticated', 'public.access_audit_events', 'SELECT')
    or has_table_privilege('service_role', 'public.access_audit_events', 'SELECT') then
    raise exception 'client roles can select access audit events';
  end if;
  select r.rolname, p.prosecdef
  into function_owner, function_is_definer
  from pg_catalog.pg_proc as p
  join pg_catalog.pg_roles as r on r.oid = p.proowner
  where p.oid = 'public.can_read_assigned_teacher_material(uuid)'::regprocedure;
  if function_owner <> 'postgres' or not function_is_definer then
    raise exception 'teacher material helper must be SECURITY DEFINER owned by postgres';
  end if;
  if not exists (
    select 1
    from pg_catalog.pg_proc as p
    where p.oid = 'public.can_read_assigned_teacher_material(uuid)'::regprocedure
      and p.proconfig @> array['search_path=""']
  ) then
    raise exception 'teacher material helper must have an empty search_path';
  end if;
  if has_function_privilege(
    'anon',
    'public.can_read_assigned_teacher_material(uuid)',
    'EXECUTE'
  ) or has_function_privilege(
    'service_role',
    'public.can_read_assigned_teacher_material(uuid)',
    'EXECUTE'
  ) or not has_function_privilege(
    'authenticated',
    'public.can_read_assigned_teacher_material(uuid)',
    'EXECUTE'
  ) then
    raise exception 'teacher material helper execute grants are unsafe';
  end if;
  if has_function_privilege(
    'anon',
    'public.set_lesson_progress_timestamps()',
    'EXECUTE'
  ) or has_function_privilege(
    'authenticated',
    'public.set_lesson_progress_timestamps()',
    'EXECUTE'
  ) or has_function_privilege(
    'service_role',
    'public.set_lesson_progress_timestamps()',
    'EXECUTE'
  ) then
    raise exception 'progress trigger function is directly executable by clients';
  end if;
  foreach relation_name in array array[
    'submit_curriculum_for_review',
    'review_curriculum',
    'publish_curriculum',
    'get_editorial_queue',
    'submit_lesson_for_review',
    'save_lesson_draft',
    'review_lesson',
    'publish_lesson',
    'unpublish_lesson'
  ]
  loop
    select r.rolname, p.prosecdef
    into function_owner, function_is_definer
    from pg_catalog.pg_proc as p
    join pg_catalog.pg_roles as r on r.oid = p.proowner
    where p.oid = pg_catalog.to_regprocedure(
      case
        when relation_name in ('review_curriculum', 'review_lesson')
          then 'public.' || relation_name || '(uuid,text,text)'
        when relation_name = 'unpublish_lesson'
          then 'public.unpublish_lesson(uuid,text)'
        when relation_name = 'save_lesson_draft'
          then 'public.save_lesson_draft(uuid,jsonb)'
        when relation_name = 'get_editorial_queue'
          then 'public.get_editorial_queue()'
        else 'public.' || relation_name || '(uuid)'
      end
    );
    if function_owner <> 'postgres' or not function_is_definer then
      raise exception 'editorial function % must be SECURITY DEFINER owned by postgres', relation_name;
    end if;
    if not exists (
      select 1
      from pg_catalog.pg_proc as p
      where p.oid = pg_catalog.to_regprocedure(
        case
          when relation_name in ('review_curriculum', 'review_lesson')
            then 'public.' || relation_name || '(uuid,text,text)'
          when relation_name = 'unpublish_lesson'
            then 'public.unpublish_lesson(uuid,text)'
          when relation_name = 'save_lesson_draft'
            then 'public.save_lesson_draft(uuid,jsonb)'
          when relation_name = 'get_editorial_queue'
            then 'public.get_editorial_queue()'
          else 'public.' || relation_name || '(uuid)'
        end
      )
        and p.proconfig @> array['search_path=""']
    ) then
      raise exception 'editorial function % must have an empty search_path', relation_name;
    end if;
  end loop;
  if has_function_privilege(
    'anon',
    'public.record_editorial_event(text,uuid,text,jsonb)',
    'EXECUTE'
  ) or has_function_privilege(
    'authenticated',
    'public.record_editorial_event(text,uuid,text,jsonb)',
    'EXECUTE'
  ) or has_function_privilege(
    'service_role',
    'public.record_editorial_event(text,uuid,text,jsonb)',
    'EXECUTE'
  ) then
    raise exception 'internal editorial audit writer is directly executable';
  end if;

  foreach relation_name in array array[
    'audit_curriculum_change',
    'audit_access_change'
  ]
  loop
    select r.rolname, p.prosecdef
    into function_owner, function_is_definer
    from pg_catalog.pg_proc as p
    join pg_catalog.pg_roles as r on r.oid = p.proowner
    where p.oid = pg_catalog.to_regprocedure('public.' || relation_name || '()');
    if function_owner <> 'postgres' or not function_is_definer then
      raise exception 'audit function % must be SECURITY DEFINER owned by postgres', relation_name;
    end if;
    if not exists (
      select 1
      from pg_catalog.pg_proc as p
      where p.oid = pg_catalog.to_regprocedure('public.' || relation_name || '()')
        and p.proconfig @> array['search_path=""']
    ) then
      raise exception 'audit function % must have an empty search_path', relation_name;
    end if;
    if has_function_privilege(
      'anon',
      'public.' || relation_name || '()',
      'EXECUTE'
    ) or has_function_privilege(
      'authenticated',
      'public.' || relation_name || '()',
      'EXECUTE'
    ) or has_function_privilege(
      'service_role',
      'public.' || relation_name || '()',
      'EXECUTE'
    ) then
      raise exception 'audit function % has unsafe execute grants', relation_name;
    end if;
  end loop;
  if has_table_privilege('authenticated', 'public.curriculum_admins', 'INSERT')
    or has_table_privilege('authenticated', 'public.curriculum_admins', 'UPDATE')
    or has_table_privilege('authenticated', 'public.curriculum_admins', 'DELETE') then
    raise exception 'authenticated users can grant or modify administrator privileges';
  end if;
  if not has_column_privilege(
    'authenticated',
    'public.lesson_progress',
    'status',
    'UPDATE'
  ) or has_column_privilege(
    'authenticated',
    'public.lesson_progress',
    'user_id',
    'UPDATE'
  ) or has_column_privilege(
    'authenticated',
    'public.lesson_progress',
    'lesson_id',
    'UPDATE'
  ) then
    raise exception 'lesson progress update grants allow changing ownership or lesson identity';
  end if;
  if not has_table_privilege(
    'authenticated',
    'public.lesson_progress',
    'INSERT'
  ) or not has_table_privilege(
    'authenticated',
    'public.lesson_progress',
    'SELECT'
  ) or has_table_privilege(
    'authenticated',
    'public.lesson_progress',
    'DELETE'
  ) then
    raise exception 'lesson progress self-service grants are incorrect';
  end if;
  foreach relation_name in array array[
    'submit_curriculum_for_review',
    'review_curriculum',
    'publish_curriculum',
    'get_editorial_queue',
    'submit_lesson_for_review',
    'save_lesson_draft',
    'review_lesson',
    'publish_lesson',
    'unpublish_lesson'
  ]
  loop
    if has_function_privilege(
      'anon',
      case
        when relation_name in ('review_curriculum', 'review_lesson')
          then 'public.' || relation_name || '(uuid,text,text)'
        when relation_name = 'unpublish_lesson'
          then 'public.unpublish_lesson(uuid,text)'
        when relation_name = 'save_lesson_draft'
          then 'public.save_lesson_draft(uuid,jsonb)'
        when relation_name = 'get_editorial_queue'
          then 'public.get_editorial_queue()'
        else 'public.' || relation_name || '(uuid)'
      end,
      'EXECUTE'
    ) or has_function_privilege(
      'service_role',
      case
        when relation_name in ('review_curriculum', 'review_lesson')
          then 'public.' || relation_name || '(uuid,text,text)'
        when relation_name = 'unpublish_lesson'
          then 'public.unpublish_lesson(uuid,text)'
        when relation_name = 'save_lesson_draft'
          then 'public.save_lesson_draft(uuid,jsonb)'
        when relation_name = 'get_editorial_queue'
          then 'public.get_editorial_queue()'
        else 'public.' || relation_name || '(uuid)'
      end,
      'EXECUTE'
    ) or not has_function_privilege(
      'authenticated',
      case
        when relation_name in ('review_curriculum', 'review_lesson')
          then 'public.' || relation_name || '(uuid,text,text)'
        when relation_name = 'unpublish_lesson'
          then 'public.unpublish_lesson(uuid,text)'
        when relation_name = 'save_lesson_draft'
          then 'public.save_lesson_draft(uuid,jsonb)'
        when relation_name = 'get_editorial_queue'
          then 'public.get_editorial_queue()'
        else 'public.' || relation_name || '(uuid)'
      end,
      'EXECUTE'
    ) then
      raise exception 'editorial function % has unsafe execution grants', relation_name;
    end if;
  end loop;
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name in ('role', 'is_admin', 'is_teacher', 'admin_role', 'teacher_role')
  ) then
    raise exception 'profiles exposes a self-assignable privilege column';
  end if;

  select r.rolname, p.prosecdef
  into function_owner, function_is_definer
  from pg_catalog.pg_proc as p
  join pg_catalog.pg_roles as r on r.oid = p.proowner
  where p.oid = 'public.can_read_published_lesson(uuid)'::regprocedure;
  if function_owner <> 'postgres' or not function_is_definer then
    raise exception 'visibility helper must be SECURITY DEFINER owned by postgres';
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_proc as p
    where p.oid = 'public.can_read_published_lesson(uuid)'::regprocedure
      and p.proconfig @> array['search_path=""']
  ) then
    raise exception 'visibility helper must have an empty search_path';
  end if;

  select exists (
    select 1
    from pg_catalog.pg_proc as p
    cross join lateral pg_catalog.aclexplode(
      coalesce(p.proacl, pg_catalog.acldefault('f', p.proowner))
    ) as acl
    where p.oid = 'public.can_read_published_lesson(uuid)'::regprocedure
      and acl.grantee = 0
      and acl.privilege_type = 'EXECUTE'
  ) into public_execute;

  if public_execute then
    raise exception 'PUBLIC has execute on can_read_published_lesson';
  end if;
  if has_function_privilege(
    'anon',
    'public.can_read_published_lesson(uuid)',
    'EXECUTE'
  ) then
    raise exception 'anon can execute can_read_published_lesson';
  end if;
  if has_function_privilege(
    'service_role',
    'public.can_read_published_lesson(uuid)',
    'EXECUTE'
  ) then
    raise exception 'service_role can execute can_read_published_lesson';
  end if;
  if not has_function_privilege(
    'authenticated',
    'public.can_read_published_lesson(uuid)',
    'EXECUTE'
  ) then
    raise exception 'authenticated cannot execute can_read_published_lesson';
  end if;
end;
$$;

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '90000000-0000-4000-8000-000000000001',
    'authenticated',
    'authenticated',
    'student-fixture@example.invalid',
    '',
    pg_catalog.now(),
    '{}'::jsonb,
    '{}'::jsonb,
    pg_catalog.now(),
    pg_catalog.now()
  ),
  (
    '90000000-0000-4000-8000-000000000002',
    'authenticated',
    'authenticated',
    'teacher-fixture@example.invalid',
    '',
    pg_catalog.now(),
    '{}'::jsonb,
    '{}'::jsonb,
    pg_catalog.now(),
    pg_catalog.now()
  )
on conflict (id) do nothing;

  insert into public.profiles (id, display_name)
  values
    ('90000000-0000-4000-8000-000000000001', 'Student fixture'),
    ('90000000-0000-4000-8000-000000000002', 'Teacher fixture')
  on conflict (id) do nothing;

insert into public.curriculum_admins (user_id, granted_by)
values (
  '90000000-0000-4000-8000-000000000002',
  '90000000-0000-4000-8000-000000000001'
);

insert into public.curriculum_editions (
  id, publisher, content_origin, name, year, source_title, source_url, source_status,
  source_verified_at, usage_rights_status, usage_rights_evidence_ref,
  usage_rights_verified_at, review_status, reviewed_at, publication_status,
  published_at
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Local test fixture',
    'licensed_external',
    'Disposable published fixture',
    2026,
    'Local-only test source',
    'https://example.invalid/local-test',
    'verified',
    pg_catalog.now(),
    'approved',
    'local fixture evidence',
    pg_catalog.now(),
    'approved',
    pg_catalog.now(),
    'published',
    pg_catalog.now()
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'Word & Way',
    'original_word_and_way',
    'Original Word & Way Bible Studies',
    2026,
    'Original collection',
    null,
    'not_applicable',
    null,
    'not_applicable',
    null,
    null,
    'not_reviewed',
    null,
    'draft',
    null
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'Word & Way',
    'original_word_and_way',
    'Approved original fixture',
    2026,
    'Original collection',
    null,
    'not_applicable',
    null,
    'not_applicable',
    null,
    null,
    'approved',
    pg_catalog.now(),
    'published',
    pg_catalog.now()
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Local test fixture',
    'licensed_external',
    'Disposable draft fixture',
    2026,
    null,
    null,
    'unverified',
    null,
    'unverified',
    null,
    null,
    'not_reviewed',
    null,
    'draft',
    null
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'Word & Way',
    'original_word_and_way',
    'Editorial workflow fixture',
    2026,
    'Original Word & Way test fixture',
    null,
    'not_applicable',
    null,
    'not_applicable',
    null,
    null,
    'not_reviewed',
    null,
    'draft',
    null
  );

insert into public.lessons (
  id, curriculum_id, age_group, title, sequence_number, review_status,
  reviewed_at, publication_status, published_at, introduction,
  practical_application, memory_verse_reference, closing_prayer
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'adults',
    'Disposable published lesson',
    1,
    'approved',
    pg_catalog.now(),
    'published',
    pg_catalog.now(),
    '',
    '',
    '',
    ''
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    'children',
    'Disposable original draft',
    1,
    'not_reviewed',
    null,
    'draft',
    null,
    '',
    '',
    '',
    ''
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000004',
    'teens',
    'Disposable approved original',
    1,
    'approved',
    pg_catalog.now(),
    'published',
    pg_catalog.now(),
    '',
    '',
    '',
    ''
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'children',
    'Disposable draft lesson',
    1,
    'not_reviewed',
    null,
    'draft',
    null,
    '',
    '',
    '',
    ''
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000005',
    'children',
    'Complete editorial fixture',
    1,
    'not_reviewed',
    null,
    'draft',
    null,
    'A test introduction.',
    'A test application.',
    'Test memory verse reference',
    'A test prayer.'
  ),
  (
    '20000000-0000-4000-8000-000000000006',
    '10000000-0000-4000-8000-000000000005',
    'children',
    'Incomplete editorial fixture',
    2,
    'not_reviewed',
    null,
    'draft',
    null,
    '',
    '',
    '',
    ''
  ),
  (
    '20000000-0000-4000-8000-000000000007',
    '10000000-0000-4000-8000-000000000005',
    'children',
    'Returned editorial fixture',
    3,
    'not_reviewed',
    null,
    'draft',
    null,
    '',
    '',
    '',
    ''
  );

insert into public.lesson_progress (user_id, lesson_id, status)
values (
  '90000000-0000-4000-8000-000000000002',
  '20000000-0000-4000-8000-000000000004',
  'started'
);

insert into public.lesson_sections (
  id, lesson_id, sequence_number, title, student_content, section_kind
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    1,
    'Local fixture section',
    'Disposable student-facing fixture content.',
    'teaching_point'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    1,
    'Draft fixture section',
    'This draft must remain hidden.',
    'teaching_point'
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000005',
    1,
    'Test teaching section',
    'Complete test lesson content.',
    'teaching_point'
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    '20000000-0000-4000-8000-000000000005',
    2,
    'Discussion questions',
    '',
    'discussion'
  );

insert into public.lesson_discussion_questions (
  section_id, sequence_number, question
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    1,
    'Disposable local test question?'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    1,
    'Draft question must remain hidden?'
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    1,
    'What is one way to apply the lesson?'
  );

insert into public.lesson_scripture_references (
  lesson_id, sequence_number, reference
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    1,
    'TEST-ONLY reference, not scripture'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    1,
    'HIDDEN-TEST reference'
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    1,
    'Genesis 1:1'
  );

insert into public.lesson_learning_objectives (
  lesson_id, sequence_number, objective
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    1,
    'Disposable local test objective.'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    1,
    'Hidden draft objective.'
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    1,
    'Describe the central teaching of the passage.'
  );

insert into public.teacher_lesson_materials (lesson_id, title, content)
values
  (
    '20000000-0000-4000-8000-000000000001',
    'Local teacher-only fixture',
    'This disposable content must never be visible to client roles.'
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    'Age-mismatched teacher fixture',
    'The adult class teacher must not read teen teacher materials.'
  );

insert into public.churches (
  id, name, verification_status, verification_evidence_ref,
  verified_at, verified_by
)
values (
  '40000000-0000-4000-8000-000000000001',
  'Disposable verified test church',
  'verified',
  'local test fixture only',
  pg_catalog.now(),
  '90000000-0000-4000-8000-000000000001'
);

insert into public.sunday_school_classes (
  id, church_id, name, age_group, status
)
values (
  '50000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001',
  'Disposable adult class',
  'adults',
  'active'
);

insert into public.class_teacher_assignments (
  id, class_id, teacher_user_id, assigned_by
)
values (
  '60000000-0000-4000-8000-000000000001',
  '50000000-0000-4000-8000-000000000001',
  '90000000-0000-4000-8000-000000000002',
  '90000000-0000-4000-8000-000000000001'
);

do $$
begin
  begin
    update public.curriculum_editions
    set review_status = 'approved',
        reviewed_at = pg_catalog.now(),
        publication_status = 'published',
        published_at = pg_catalog.now()
    where id = '10000000-0000-4000-8000-000000000002';
    raise exception 'external curriculum without source and rights verification was publishable';
  exception
    when check_violation then
      null;
  end;
end;
$$;

set local role anon;
do $$
begin
  begin
    perform public.publish_lesson('20000000-0000-4000-8000-000000000005');
    raise exception 'unauthenticated caller could invoke publish_lesson';
  exception
    when insufficient_privilege then
      null;
  end;
  begin
    perform public.get_editorial_queue();
    raise exception 'unauthenticated caller could read editorial content';
  exception
    when insufficient_privilege then
      null;
  end;
end;
$$;

reset role;
set local role authenticated;
select pg_catalog.set_config(
  'request.jwt.claim.sub',
  '90000000-0000-4000-8000-000000000001',
  true
);
select pg_catalog.set_config(
  'request.jwt.claims',
  '{"sub":"90000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.submit_curriculum_for_review(
      '10000000-0000-4000-8000-000000000005'
    );
    raise exception 'unauthorized user could submit curriculum for review';
  exception
    when insufficient_privilege then
      null;
  end;
  begin
    perform public.review_lesson(
      '20000000-0000-4000-8000-000000000005',
      'approved',
      null
    );
    raise exception 'unauthorized user could approve a lesson';
  exception
    when insufficient_privilege then
      null;
  end;
  begin
    perform public.save_lesson_draft(
      '20000000-0000-4000-8000-000000000005',
      '{}'::jsonb
    );
    raise exception 'unauthorized user could edit lesson content';
  exception
    when insufficient_privilege then
      null;
  end;
  begin
    perform public.get_editorial_queue();
    raise exception 'unauthorized user could read editorial content';
  exception
    when insufficient_privilege then
      null;
  end;
  begin
    perform public.publish_curriculum(
      '10000000-0000-4000-8000-000000000005'
    );
    raise exception 'unauthorized user could publish curriculum';
  exception
    when insufficient_privilege then
      null;
  end;
  begin
    perform public.publish_lesson(
      '20000000-0000-4000-8000-000000000005'
    );
    raise exception 'unauthorized user could publish a lesson';
  exception
    when insufficient_privilege then
      null;
  end;
  begin
    update public.lessons
    set review_status = 'approved',
        reviewed_at = pg_catalog.now(),
        publication_status = 'published',
        published_at = pg_catalog.now()
    where id = '20000000-0000-4000-8000-000000000005';
    raise exception 'authenticated user bypassed editorial RPC using direct table writes';
  exception
    when insufficient_privilege then
      null;
  end;

  if (select pg_catalog.count(*) from public.profiles) <> 1 then
    raise exception 'user can read another users private profile';
  end if;
  update public.profiles
  set display_name = 'Unauthorized profile change'
  where id = '90000000-0000-4000-8000-000000000002';
  if found then
    raise exception 'user can modify another users private profile';
  end if;

  if (select pg_catalog.count(*) from public.curriculum_editions) <> 2 then
    raise exception 'student can see an unpublished or unverified curriculum';
  end if;
  if (select pg_catalog.count(*) from public.lessons) <> 2 then
    raise exception 'student can see an unpublished or unapproved lesson';
  end if;
  if public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000003'
  ) then
    raise exception 'student can read an unreviewed original Word & Way lesson';
  end if;
  if not public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000004'
  ) then
    raise exception 'student cannot read an approved original without external verification';
  end if;
  if (select pg_catalog.count(*) from public.lesson_sections) <> 1 then
    raise exception 'student can see a section from an unpublished lesson';
  end if;
  if (select pg_catalog.count(*) from public.lesson_discussion_questions) <> 1 then
    raise exception 'student can see a question from an unpublished lesson';
  end if;
  if (select pg_catalog.count(*) from public.lesson_scripture_references) <> 1 then
    raise exception 'student can see a reference from an unpublished lesson';
  end if;
  if (select pg_catalog.count(*) from public.lesson_learning_objectives) <> 1 then
    raise exception 'student can see an objective from an unpublished lesson';
  end if;
  if public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000002'
  ) then
    raise exception 'visibility helper approved a draft lesson';
  end if;

  if (select pg_catalog.count(*) from public.teacher_lesson_materials) <> 0 then
    raise exception 'unassigned student can read teacher-only materials';
  end if;

  insert into public.lesson_progress (user_id, lesson_id, status)
  values (
    '90000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000004',
    'started'
  );
  if (select pg_catalog.count(*) from public.lesson_progress) <> 1 then
    raise exception 'student can read another users lesson progress';
  end if;
  update public.lesson_progress
  set status = 'completed'
  where user_id = '90000000-0000-4000-8000-000000000001'
    and lesson_id = '20000000-0000-4000-8000-000000000004';
  if not exists (
    select 1
    from public.lesson_progress
    where user_id = '90000000-0000-4000-8000-000000000001'
      and lesson_id = '20000000-0000-4000-8000-000000000004'
      and status = 'completed'
      and completed_at is not null
  ) then
    raise exception 'student progress completion timestamps are not maintained';
  end if;

  begin
    insert into public.lesson_progress (user_id, lesson_id, status)
    values (
      '90000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000004',
      'started'
    );
    raise exception 'student could write another user progress';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    insert into public.lesson_progress (user_id, lesson_id, status)
    values (
      '90000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000003',
      'started'
    );
    raise exception 'student could track an unpublished lesson';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    insert into public.curriculum_admins (user_id)
    values ('90000000-0000-4000-8000-000000000001');
    raise exception 'authenticated user could grant themselves administrator access';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    insert into public.class_teacher_assignments (
      class_id, teacher_user_id, assigned_by
    )
    values (
      '50000000-0000-4000-8000-000000000001',
      '90000000-0000-4000-8000-000000000001',
      '90000000-0000-4000-8000-000000000001'
    );
    raise exception 'authenticated user could self-assign as a teacher';
  exception
    when insufficient_privilege then
      null;
  end;

  perform pg_catalog.set_config(
    'request.jwt.claim.sub',
    '90000000-0000-4000-8000-000000000002',
    true
  );
  perform pg_catalog.set_config(
    'request.jwt.claims',
    '{"sub":"90000000-0000-4000-8000-000000000002","role":"authenticated"}',
    true
  );
  if (select pg_catalog.count(*) from public.teacher_lesson_materials) <> 1 then
    raise exception 'assigned teacher cannot read eligible teacher materials';
  end if;
  if (
    select pg_catalog.count(*)
    from public.lesson_progress
    where user_id = '90000000-0000-4000-8000-000000000001'
  ) <> 0 then
    raise exception 'user can read another users private lesson progress';
  end if;
  update public.lesson_progress
  set status = 'started'
  where user_id = '90000000-0000-4000-8000-000000000001'
    and lesson_id = '20000000-0000-4000-8000-000000000004';
  if found then
    raise exception 'user can modify another users private lesson progress';
  end if;

  begin
    insert into public.lessons (
      curriculum_id, age_group, title, sequence_number
    )
    values (
      '10000000-0000-4000-8000-000000000001',
      'adults',
      'Unauthorized client lesson',
      99
    );
    raise exception 'authenticated client could insert curriculum content';
  exception
    when insufficient_privilege then
      null;
  end;
end;
$$;

reset role;
update public.class_teacher_assignments
set status = 'revoked',
    revoked_at = pg_catalog.clock_timestamp()
where id = '60000000-0000-4000-8000-000000000001';
set local role authenticated;
select pg_catalog.set_config(
  'request.jwt.claim.sub',
  '90000000-0000-4000-8000-000000000002',
  true
);
select pg_catalog.set_config(
  'request.jwt.claims',
  '{"sub":"90000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);
do $$
begin
  if (select pg_catalog.count(*) from public.teacher_lesson_materials) <> 0 then
    raise exception 'revoked teacher assignment still grants access';
  end if;
end;
$$;

do $$
declare
  queue_data jsonb;
begin
  queue_data := public.get_editorial_queue();
  if not queue_data @> pg_catalog.jsonb_build_array(
    pg_catalog.jsonb_build_object(
      'id', '10000000-0000-4000-8000-000000000005',
      'lessons', pg_catalog.jsonb_build_array(
        pg_catalog.jsonb_build_object(
          'id', '20000000-0000-4000-8000-000000000005',
          'title', 'Complete editorial fixture'
        )
      )
    )
  ) then
    raise exception 'authorized editor cannot read the lesson editorial queue';
  end if;

  begin
    perform public.review_curriculum(
      '10000000-0000-4000-8000-000000000005',
      'approved',
      null
    );
    raise exception 'authorized editor reviewed curriculum before submission';
  exception
    when object_not_in_prerequisite_state then
      null;
  end;

  perform public.submit_curriculum_for_review(
    '10000000-0000-4000-8000-000000000005'
  );
  perform public.review_curriculum(
    '10000000-0000-4000-8000-000000000005',
    'approved',
    null
  );
  if public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000005'
  ) then
    raise exception 'unpublished curriculum exposed a lesson';
  end if;
  perform public.publish_curriculum(
    '10000000-0000-4000-8000-000000000005'
  );

  perform public.submit_lesson_for_review(
    '20000000-0000-4000-8000-000000000005'
  );
  if public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000005'
  ) then
    raise exception 'lesson became visible when submitted for review';
  end if;
  perform public.review_lesson(
    '20000000-0000-4000-8000-000000000005',
    'approved',
    null
  );
  if public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000005'
  ) then
    raise exception 'approved but unpublished lesson became visible';
  end if;

  perform public.submit_lesson_for_review(
    '20000000-0000-4000-8000-000000000006'
  );
  perform public.review_lesson(
    '20000000-0000-4000-8000-000000000006',
    'rejected',
    'Add required teaching and discussion content.'
  );
  begin
    perform public.review_lesson(
      '20000000-0000-4000-8000-000000000007',
      'rejected',
      null
    );
    raise exception 'lesson rejection did not require editorial feedback';
  exception
    when invalid_parameter_value then
      null;
  end;
  perform public.submit_lesson_for_review(
    '20000000-0000-4000-8000-000000000007'
  );
  perform public.review_lesson(
    '20000000-0000-4000-8000-000000000007',
    'rejected',
    'Complete the required lesson fields.'
  );
  perform public.save_lesson_draft(
    '20000000-0000-4000-8000-000000000007',
    pg_catalog.jsonb_build_object(
      'title', 'Corrected returned lesson',
      'age_group', 'children',
      'lesson_date', null,
      'sequence_number', 3,
      'introduction', 'A corrected lesson introduction.',
      'practical_application', 'A corrected practical application.',
      'memory_verse_reference', 'Genesis 1:1',
      'closing_prayer', 'A corrected closing prayer.',
      'age_appropriate_explanation', null,
      'interactive_activity', 'A simple classroom activity.',
      'simple_takeaway', 'A clear lesson takeaway.',
      'scripture_references', pg_catalog.jsonb_build_array('Genesis 1:1'),
      'learning_objectives',
        pg_catalog.jsonb_build_array('Describe the passage in your own words.'),
      'teaching_points',
        pg_catalog.jsonb_build_array(pg_catalog.jsonb_build_object(
          'title', 'Main idea',
          'student_content', 'A complete teaching point.'
        )),
      'discussion_questions',
        pg_catalog.jsonb_build_array('What is one way to apply the lesson?')
    )
  );
  perform public.submit_lesson_for_review(
    '20000000-0000-4000-8000-000000000007'
  );
  perform public.review_lesson(
    '20000000-0000-4000-8000-000000000007',
    'approved',
    null
  );
  perform public.publish_lesson(
    '20000000-0000-4000-8000-000000000007'
  );
  perform public.submit_lesson_for_review(
    '20000000-0000-4000-8000-000000000006'
  );
  perform public.review_lesson(
    '20000000-0000-4000-8000-000000000006',
    'approved',
    null
  );
  begin
    perform public.publish_lesson(
      '20000000-0000-4000-8000-000000000006'
    );
    raise exception 'incomplete lesson could be published';
  exception
    when check_violation then
      null;
  end;
  if public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000006'
  ) then
    raise exception 'incomplete lesson became visible after failed publication';
  end if;

  begin
    update public.lessons
    set publication_status = 'published'
    where id = '20000000-0000-4000-8000-000000000005';
    raise exception 'authorized editor bypassed transition RPC with direct table write';
  exception
    when insufficient_privilege then
      null;
  end;

  perform public.publish_lesson(
    '20000000-0000-4000-8000-000000000005'
  );
  if not public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000005'
  ) then
    raise exception 'approved complete lesson was not visible after publication';
  end if;
  perform public.unpublish_lesson(
    '20000000-0000-4000-8000-000000000005',
    'Local security fixture withdrawal.'
  );
  if public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000005'
  ) then
    raise exception 'withdrawn lesson remained visible';
  end if;
  perform public.publish_lesson(
    '20000000-0000-4000-8000-000000000005'
  );
  if not public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000007'
  ) then
    raise exception 'corrected returned lesson was not publishable';
  end if;
end;
$$;

reset role;
do $$
begin
  if not exists (
    select 1
    from public.curriculum_editions
    where id = '10000000-0000-4000-8000-000000000005'
      and review_status = 'approved'
      and reviewed_by = '90000000-0000-4000-8000-000000000002'
      and reviewed_at is not null
      and publication_status = 'published'
      and published_by = '90000000-0000-4000-8000-000000000002'
      and published_at is not null
  ) then
    raise exception 'curriculum reviewer/publisher identity or timestamps are missing';
  end if;
  if not exists (
    select 1
    from public.lessons
    where id = '20000000-0000-4000-8000-000000000005'
      and review_status = 'approved'
      and reviewed_by = '90000000-0000-4000-8000-000000000002'
      and reviewed_at is not null
      and publication_status = 'published'
      and published_by = '90000000-0000-4000-8000-000000000002'
      and published_at is not null
  ) then
    raise exception 'lesson reviewer/publisher identity or timestamps are missing';
  end if;
  if not exists (
    select 1
    from public.curriculum_audit_events
    where entity_type = 'lessons'
      and entity_id = '20000000-0000-4000-8000-000000000006'
      and actor_id = '90000000-0000-4000-8000-000000000002'
      and action = 'review_rejected'
      and details ->> 'feedback' = 'Add required teaching and discussion content.'
  ) then
    raise exception 'rejection feedback and reviewer are missing from audit history';
  end if;
  if not exists (
    select 1
    from public.curriculum_audit_events
    where entity_type = 'lessons'
      and entity_id = '20000000-0000-4000-8000-000000000005'
      and actor_id = '90000000-0000-4000-8000-000000000002'
      and action = 'published'
  ) then
    raise exception 'publication event is missing from the editorial audit history';
  end if;
  if not exists (
    select 1
    from public.lessons
    where id = '20000000-0000-4000-8000-000000000007'
      and title = 'Corrected returned lesson'
      and review_status = 'approved'
      and reviewed_by = '90000000-0000-4000-8000-000000000002'
      and publication_status = 'published'
      and published_by = '90000000-0000-4000-8000-000000000002'
  ) then
    raise exception 'returned lesson draft changes or final review metadata were not saved';
  end if;
  if not exists (
    select 1
    from public.curriculum_audit_events
    where entity_type = 'lessons'
      and entity_id = '20000000-0000-4000-8000-000000000007'
      and actor_id = '90000000-0000-4000-8000-000000000002'
      and action = 'draft_saved'
  ) then
    raise exception 'draft edit event is missing from editorial audit history';
  end if;
  if exists (
    select 1
    from public.lessons
    where id in (
      '20000000-0000-4000-8000-000000000005',
      '20000000-0000-4000-8000-000000000006'
    )
      and created_at < pg_catalog.now() - interval '1 minute'
  ) then
    raise exception 'unexpected fixture timestamp';
  end if;
end;
$$;

set local role authenticated;
select pg_catalog.set_config(
  'request.jwt.claim.sub',
  '90000000-0000-4000-8000-000000000001',
  true
);
select pg_catalog.set_config(
  'request.jwt.claims',
  '{"sub":"90000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
do $$
begin
  if not public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000005'
  ) then
    raise exception 'student cannot see approved content after publication';
  end if;
  if public.can_read_published_lesson(
    '20000000-0000-4000-8000-000000000006'
  ) then
    raise exception 'student can see an incomplete lesson';
  end if;
   if (select pg_catalog.count(*) from public.lessons) <> 4 then
    raise exception 'student-facing lesson RLS does not match published state';
     end if;
end;
$$;

rollback;
