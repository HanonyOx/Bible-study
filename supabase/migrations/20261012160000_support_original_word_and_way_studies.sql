alter table public.curriculum_editions
  add column content_origin text not null default 'licensed_external'
    check (content_origin in ('licensed_external', 'original_word_and_way'));

alter table public.curriculum_editions
  drop constraint curriculum_editions_source_status_check,
  drop constraint curriculum_editions_usage_rights_status_check,
  drop constraint curriculum_editions_check,
  drop constraint curriculum_editions_check1,
  drop constraint curriculum_editions_check3;

alter table public.curriculum_editions
  add constraint curriculum_editions_source_status_check
    check (source_status in ('unverified', 'verified', 'rejected', 'not_applicable')),
  add constraint curriculum_editions_usage_rights_status_check
    check (usage_rights_status in ('unverified', 'approved', 'not_permitted', 'not_applicable')),
  add constraint curriculum_editions_original_attribution_check
    check (
      content_origin <> 'original_word_and_way'
      or (
        publisher = 'Word & Way'
        and nullif(pg_catalog.btrim(source_title), '') is not null
        and source_url is null
        and source_status = 'not_applicable'
        and source_verified_at is null
        and usage_rights_status = 'not_applicable'
        and usage_rights_evidence_ref is null
        and usage_rights_verified_at is null
      )
    ),
  add constraint curriculum_editions_external_status_check
    check (
      content_origin <> 'licensed_external'
      or (
        source_status <> 'not_applicable'
        and usage_rights_status <> 'not_applicable'
      )
    ),
  add constraint curriculum_editions_source_verification_check
    check (
      source_status <> 'verified'
      or (
        nullif(pg_catalog.btrim(source_title), '') is not null
        and nullif(pg_catalog.btrim(source_url), '') is not null
        and source_verified_at is not null
      )
    ),
  add constraint curriculum_editions_rights_verification_check
    check (
      usage_rights_status <> 'approved'
      or (
        nullif(pg_catalog.btrim(usage_rights_evidence_ref), '') is not null
        and usage_rights_verified_at is not null
      )
    ),
  add constraint curriculum_editions_publication_check
    check (
      publication_status <> 'published'
      or (
        review_status = 'approved'
        and reviewed_at is not null
        and published_at is not null
        and (
          (
            content_origin = 'original_word_and_way'
            and source_status = 'not_applicable'
            and usage_rights_status = 'not_applicable'
          )
          or (
            content_origin = 'licensed_external'
            and source_status = 'verified'
            and source_verified_at is not null
            and usage_rights_status = 'approved'
            and usage_rights_verified_at is not null
          )
        )
      )
    );

alter table public.lessons
  add column introduction text not null default '',
  add column practical_application text not null default '',
  add column memory_verse_reference text not null default '',
  add column closing_prayer text not null default '',
  add column age_appropriate_explanation text,
  add column interactive_activity text,
  add column simple_takeaway text;

alter table public.lesson_sections
  add column section_kind text not null default 'teaching_point'
    check (section_kind in ('teaching_point', 'discussion'));

create or replace function public.can_read_published_lesson(p_lesson_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.lessons as lesson
      join public.curriculum_editions as curriculum
        on curriculum.id = lesson.curriculum_id
      where lesson.id = p_lesson_id
        and lesson.review_status = 'approved'
        and lesson.reviewed_at is not null
        and lesson.publication_status = 'published'
        and lesson.published_at is not null
        and curriculum.review_status = 'approved'
        and curriculum.reviewed_at is not null
        and curriculum.publication_status = 'published'
        and curriculum.published_at is not null
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
          )
        )
    );
$$;

alter function public.can_read_published_lesson(uuid) owner to postgres;
revoke all on function public.can_read_published_lesson(uuid)
  from public, anon, service_role, authenticated;
grant execute on function public.can_read_published_lesson(uuid) to authenticated;

grant select (content_origin)
  on public.curriculum_editions to authenticated;
grant select (
  introduction,
  practical_application,
  memory_verse_reference,
  closing_prayer,
  age_appropriate_explanation,
  interactive_activity,
  simple_takeaway
) on public.lessons to authenticated;
grant select (section_kind)
  on public.lesson_sections to authenticated;

drop policy "Authenticated users can read published verified curricula"
  on public.curriculum_editions;

create policy "Authenticated users can read published eligible curricula"
  on public.curriculum_editions
  for select
  to authenticated
  using (
    publication_status = 'published'
    and published_at is not null
    and review_status = 'approved'
    and reviewed_at is not null
    and (
      (
        content_origin = 'original_word_and_way'
        and publisher = 'Word & Way'
        and nullif(pg_catalog.btrim(source_title), '') is not null
        and source_status = 'not_applicable'
        and source_verified_at is null
        and usage_rights_status = 'not_applicable'
        and usage_rights_evidence_ref is null
        and usage_rights_verified_at is null
      )
      or (
        content_origin = 'licensed_external'
        and source_status = 'verified'
        and source_verified_at is not null
        and usage_rights_status = 'approved'
        and usage_rights_verified_at is not null
      )
    )
  );
