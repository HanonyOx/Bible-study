create table public.curriculum_editions (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  publisher text not null check (pg_catalog.length(pg_catalog.btrim(publisher)) > 0),
  name text not null check (pg_catalog.length(pg_catalog.btrim(name)) > 0),
  year integer not null check (year between 1900 and 9999),
  edition_label text,
  source_title text,
  source_url text,
  source_status text not null default 'unverified'
    check (source_status in ('unverified', 'verified', 'rejected')),
  source_verified_at timestamptz,
  source_verified_by uuid references auth.users (id) on delete set null,
  usage_rights_status text not null default 'unverified'
    check (usage_rights_status in ('unverified', 'approved', 'not_permitted')),
  usage_rights_evidence_ref text,
  usage_rights_verified_at timestamptz,
  usage_rights_verified_by uuid references auth.users (id) on delete set null,
  review_status text not null default 'not_reviewed'
    check (review_status in ('not_reviewed', 'in_review', 'approved', 'rejected')),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'withdrawn')),
  published_at timestamptz,
  published_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  check (
    source_status <> 'verified'
    or (
      nullif(pg_catalog.btrim(source_title), '') is not null
      and nullif(pg_catalog.btrim(source_url), '') is not null
      and source_verified_at is not null
    )
  ),
  check (
    usage_rights_status <> 'approved'
    or (
      nullif(pg_catalog.btrim(usage_rights_evidence_ref), '') is not null
      and usage_rights_verified_at is not null
    )
  ),
  check (review_status <> 'approved' or reviewed_at is not null),
  check (
    publication_status <> 'published'
    or (
      source_status = 'verified'
      and usage_rights_status = 'approved'
      and review_status = 'approved'
      and published_at is not null
    )
  ),
  unique (publisher, year, edition_label)
);

create table public.lessons (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  curriculum_id uuid not null
    references public.curriculum_editions (id) on delete cascade,
  age_group text not null check (age_group in ('children', 'teens', 'adults')),
  title text not null check (pg_catalog.length(pg_catalog.btrim(title)) > 0),
  lesson_date date,
  sequence_number integer not null check (sequence_number > 0),
  review_status text not null default 'not_reviewed'
    check (review_status in ('not_reviewed', 'in_review', 'approved', 'rejected')),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'withdrawn')),
  published_at timestamptz,
  published_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  check (review_status <> 'approved' or reviewed_at is not null),
  check (
    publication_status <> 'published'
    or (
      review_status = 'approved'
      and published_at is not null
    )
  ),
  unique (curriculum_id, age_group, sequence_number)
);

create table public.lesson_sections (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  sequence_number integer not null check (sequence_number > 0),
  title text not null check (pg_catalog.length(pg_catalog.btrim(title)) > 0),
  student_content text not null default '',
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  unique (lesson_id, sequence_number)
);

create table public.lesson_discussion_questions (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  section_id uuid not null references public.lesson_sections (id) on delete cascade,
  sequence_number integer not null check (sequence_number > 0),
  question text not null check (pg_catalog.length(pg_catalog.btrim(question)) > 0),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  unique (section_id, sequence_number)
);

create table public.lesson_scripture_references (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  sequence_number integer not null check (sequence_number > 0),
  reference text not null check (pg_catalog.length(pg_catalog.btrim(reference)) > 0),
  created_at timestamptz not null default pg_catalog.now(),
  unique (lesson_id, sequence_number),
  unique (lesson_id, reference)
);

create table public.lesson_learning_objectives (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  sequence_number integer not null check (sequence_number > 0),
  objective text not null check (pg_catalog.length(pg_catalog.btrim(objective)) > 0),
  created_at timestamptz not null default pg_catalog.now(),
  unique (lesson_id, sequence_number)
);

create table public.teacher_lesson_materials (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  title text not null check (pg_catalog.length(pg_catalog.btrim(title)) > 0),
  content text not null,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  unique (lesson_id, title)
);

create table public.curriculum_audit_events (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (pg_catalog.length(pg_catalog.btrim(action)) > 0),
  entity_type text not null check (pg_catalog.length(pg_catalog.btrim(entity_type)) > 0),
  entity_id uuid not null,
  details jsonb not null default '{}'::jsonb
    check (pg_catalog.jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default pg_catalog.now()
);

create index curriculum_editions_publication_idx
  on public.curriculum_editions (publication_status, review_status, year);
create index lessons_curriculum_age_date_idx
  on public.lessons (curriculum_id, age_group, lesson_date, sequence_number);
create index lessons_student_publication_idx
  on public.lessons (publication_status, review_status, lesson_date, sequence_number);
create index lesson_sections_lesson_sequence_idx
  on public.lesson_sections (lesson_id, sequence_number);
create index lesson_discussion_questions_section_sequence_idx
  on public.lesson_discussion_questions (section_id, sequence_number);
create index lesson_scripture_references_lesson_idx
  on public.lesson_scripture_references (lesson_id, sequence_number);
create index lesson_learning_objectives_lesson_idx
  on public.lesson_learning_objectives (lesson_id, sequence_number);
create index teacher_lesson_materials_lesson_idx
  on public.teacher_lesson_materials (lesson_id);
create index curriculum_audit_events_entity_idx
  on public.curriculum_audit_events (entity_type, entity_id, created_at desc);
create index curriculum_audit_events_actor_idx
  on public.curriculum_audit_events (actor_id, created_at desc);

create function public.set_curriculum_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.clock_timestamp();
  return new;
end;
$$;

revoke all on function public.set_curriculum_updated_at()
  from public, anon, authenticated, service_role;
alter function public.set_curriculum_updated_at() owner to postgres;

create trigger curriculum_editions_set_updated_at
  before update on public.curriculum_editions
  for each row execute function public.set_curriculum_updated_at();
create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute function public.set_curriculum_updated_at();
create trigger lesson_sections_set_updated_at
  before update on public.lesson_sections
  for each row execute function public.set_curriculum_updated_at();
create trigger lesson_discussion_questions_set_updated_at
  before update on public.lesson_discussion_questions
  for each row execute function public.set_curriculum_updated_at();
create trigger teacher_lesson_materials_set_updated_at
  before update on public.teacher_lesson_materials
  for each row execute function public.set_curriculum_updated_at();

create function public.can_read_published_lesson(p_lesson_id uuid)
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
        and curriculum.source_status = 'verified'
        and curriculum.source_verified_at is not null
        and curriculum.usage_rights_status = 'approved'
        and curriculum.usage_rights_verified_at is not null
    );
$$;

alter function public.can_read_published_lesson(uuid) owner to postgres;
revoke all on function public.can_read_published_lesson(uuid)
  from public, anon, service_role, authenticated;
grant execute on function public.can_read_published_lesson(uuid) to authenticated;

create function public.audit_curriculum_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_row jsonb;
  changed_id uuid;
  action_name text;
begin
  if tg_op = 'DELETE' then
    changed_row := pg_catalog.to_jsonb(old);
  else
    changed_row := pg_catalog.to_jsonb(new);
  end if;

  changed_id := coalesce(
    (changed_row ->> 'id')::uuid,
    (changed_row ->> 'lesson_id')::uuid,
    (changed_row ->> 'section_id')::uuid
  );
  action_name := pg_catalog.lower(tg_table_name) || '.' || pg_catalog.lower(tg_op);

  insert into public.curriculum_audit_events (
    actor_id,
    action,
    entity_type,
    entity_id,
    details
  )
  values (
    auth.uid(),
    action_name,
    tg_table_name,
    changed_id,
    pg_catalog.jsonb_build_object('operation', pg_catalog.lower(tg_op))
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

alter function public.audit_curriculum_change() owner to postgres;
revoke all on function public.audit_curriculum_change()
  from public, anon, authenticated, service_role;

create trigger curriculum_editions_audit
  after insert or update or delete on public.curriculum_editions
  for each row execute function public.audit_curriculum_change();
create trigger lessons_audit
  after insert or update or delete on public.lessons
  for each row execute function public.audit_curriculum_change();
create trigger lesson_sections_audit
  after insert or update or delete on public.lesson_sections
  for each row execute function public.audit_curriculum_change();
create trigger lesson_discussion_questions_audit
  after insert or update or delete on public.lesson_discussion_questions
  for each row execute function public.audit_curriculum_change();
create trigger lesson_scripture_references_audit
  after insert or update or delete on public.lesson_scripture_references
  for each row execute function public.audit_curriculum_change();
create trigger lesson_learning_objectives_audit
  after insert or update or delete on public.lesson_learning_objectives
  for each row execute function public.audit_curriculum_change();
create trigger teacher_lesson_materials_audit
  after insert or update or delete on public.teacher_lesson_materials
  for each row execute function public.audit_curriculum_change();

alter table public.curriculum_editions enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_sections enable row level security;
alter table public.lesson_discussion_questions enable row level security;
alter table public.lesson_scripture_references enable row level security;
alter table public.lesson_learning_objectives enable row level security;
alter table public.teacher_lesson_materials enable row level security;
alter table public.curriculum_audit_events enable row level security;

create policy "Authenticated users can read published verified curricula"
  on public.curriculum_editions
  for select
  to authenticated
  using (
    publication_status = 'published'
    and published_at is not null
    and review_status = 'approved'
    and reviewed_at is not null
    and source_status = 'verified'
    and source_verified_at is not null
    and usage_rights_status = 'approved'
    and usage_rights_verified_at is not null
  );

create policy "Authenticated users can read approved published lessons"
  on public.lessons
  for select
  to authenticated
  using ((select public.can_read_published_lesson(id)));

create policy "Authenticated users can read sections of visible lessons"
  on public.lesson_sections
  for select
  to authenticated
  using ((select public.can_read_published_lesson(lesson_id)));

create policy "Authenticated users can read questions of visible lessons"
  on public.lesson_discussion_questions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.lesson_sections as section
      where section.id = section_id
        and (select public.can_read_published_lesson(section.lesson_id))
    )
  );

create policy "Authenticated users can read references of visible lessons"
  on public.lesson_scripture_references
  for select
  to authenticated
  using ((select public.can_read_published_lesson(lesson_id)));

create policy "Authenticated users can read objectives of visible lessons"
  on public.lesson_learning_objectives
  for select
  to authenticated
  using ((select public.can_read_published_lesson(lesson_id)));

revoke all on table
  public.curriculum_editions,
  public.lessons,
  public.lesson_sections,
  public.lesson_discussion_questions,
  public.lesson_scripture_references,
  public.lesson_learning_objectives,
  public.teacher_lesson_materials,
  public.curriculum_audit_events
from public, anon, authenticated, service_role;

grant select (
  id, publisher, name, year, edition_label, source_title, source_url
) on public.curriculum_editions to authenticated;
grant select (
  id, curriculum_id, age_group, title, lesson_date, sequence_number
) on public.lessons to authenticated;
grant select (
  id, lesson_id, sequence_number, title, student_content
) on public.lesson_sections to authenticated;
grant select (
  id, section_id, sequence_number, question
) on public.lesson_discussion_questions to authenticated;
grant select (
  id, lesson_id, sequence_number, reference
) on public.lesson_scripture_references to authenticated;
grant select (
  id, lesson_id, sequence_number, objective
) on public.lesson_learning_objectives to authenticated;
