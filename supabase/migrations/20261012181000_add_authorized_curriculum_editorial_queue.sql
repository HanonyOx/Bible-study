create function public.get_editorial_queue()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  queue_data jsonb;
begin
  if caller_id is null or auth.role() <> 'authenticated' or not exists (
    select 1
    from public.curriculum_admins as admin
    where admin.user_id = caller_id
  ) then
    raise exception 'Curriculum editor authorization required'
      using errcode = '42501';
  end if;

  select coalesce(
    pg_catalog.jsonb_agg(
      pg_catalog.jsonb_build_object(
        'id', curriculum.id,
        'publisher', curriculum.publisher,
        'content_origin', curriculum.content_origin,
        'name', curriculum.name,
        'year', curriculum.year,
        'edition_label', curriculum.edition_label,
        'source_title', curriculum.source_title,
        'source_url', curriculum.source_url,
        'source_status', curriculum.source_status,
        'source_verified_at', curriculum.source_verified_at,
        'source_verified_by', curriculum.source_verified_by,
        'usage_rights_status', curriculum.usage_rights_status,
        'usage_rights_evidence_ref', curriculum.usage_rights_evidence_ref,
        'usage_rights_verified_at', curriculum.usage_rights_verified_at,
        'usage_rights_verified_by', curriculum.usage_rights_verified_by,
        'review_status', curriculum.review_status,
        'reviewed_at', curriculum.reviewed_at,
        'reviewed_by', curriculum.reviewed_by,
        'publication_status', curriculum.publication_status,
        'published_at', curriculum.published_at,
        'published_by', curriculum.published_by,
        'lessons',
        coalesce((
          select pg_catalog.jsonb_agg(
            pg_catalog.jsonb_build_object(
              'id', lesson.id,
              'age_group', lesson.age_group,
              'title', lesson.title,
              'lesson_date', lesson.lesson_date,
              'sequence_number', lesson.sequence_number,
              'review_status', lesson.review_status,
              'reviewed_at', lesson.reviewed_at,
              'reviewed_by', lesson.reviewed_by,
              'publication_status', lesson.publication_status,
              'published_at', lesson.published_at,
              'published_by', lesson.published_by,
              'introduction', lesson.introduction,
              'practical_application', lesson.practical_application,
              'memory_verse_reference', lesson.memory_verse_reference,
              'closing_prayer', lesson.closing_prayer,
              'age_appropriate_explanation', lesson.age_appropriate_explanation,
              'interactive_activity', lesson.interactive_activity,
              'simple_takeaway', lesson.simple_takeaway,
              'scripture_references',
              coalesce((
                select pg_catalog.jsonb_agg(
                  reference.reference order by reference.sequence_number
                )
                from public.lesson_scripture_references as reference
                where reference.lesson_id = lesson.id
              ), '[]'::jsonb),
              'learning_objectives',
              coalesce((
                select pg_catalog.jsonb_agg(
                  objective.objective order by objective.sequence_number
                )
                from public.lesson_learning_objectives as objective
                where objective.lesson_id = lesson.id
              ), '[]'::jsonb),
              'sections',
              coalesce((
                select pg_catalog.jsonb_agg(
                  pg_catalog.jsonb_build_object(
                    'id', section.id,
                    'sequence_number', section.sequence_number,
                    'section_kind', section.section_kind,
                    'title', section.title,
                    'student_content', section.student_content,
                    'discussion_questions',
                    coalesce((
                      select pg_catalog.jsonb_agg(
                        question.question order by question.sequence_number
                      )
                      from public.lesson_discussion_questions as question
                      where question.section_id = section.id
                    ), '[]'::jsonb)
                  )
                  order by section.sequence_number
                )
                from public.lesson_sections as section
                where section.lesson_id = lesson.id
              ), '[]'::jsonb)
            )
            order by lesson.age_group, lesson.sequence_number
          )
          from public.lessons as lesson
          where lesson.curriculum_id = curriculum.id
        ), '[]'::jsonb)
      )
      order by curriculum.year desc, curriculum.name
    ),
    '[]'::jsonb
  )
  into queue_data
  from public.curriculum_editions as curriculum;

  return queue_data;
end;
$$;

alter function public.get_editorial_queue() owner to postgres;
revoke all on function public.get_editorial_queue()
  from public, anon, authenticated, service_role;
grant execute on function public.get_editorial_queue() to authenticated;
