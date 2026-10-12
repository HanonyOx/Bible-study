create table public.curriculum_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  granted_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default pg_catalog.now()
);

create table public.churches (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  name text not null check (pg_catalog.length(pg_catalog.btrim(name)) > 0),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'in_review', 'verified', 'rejected')),
  verification_evidence_ref text,
  verified_at timestamptz,
  verified_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  check (
    verification_status <> 'verified'
    or (
      nullif(pg_catalog.btrim(verification_evidence_ref), '') is not null
      and verified_at is not null
      and verified_by is not null
    )
  )
);

create table public.sunday_school_classes (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  church_id uuid not null references public.churches (id) on delete restrict,
  name text not null check (pg_catalog.length(pg_catalog.btrim(name)) > 0),
  age_group text not null check (age_group in ('children', 'teens', 'adults')),
  status text not null default 'inactive'
    check (status in ('active', 'inactive')),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  unique (church_id, name)
);

create table public.class_teacher_assignments (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  class_id uuid not null references public.sunday_school_classes (id) on delete cascade,
  teacher_user_id uuid not null references auth.users (id) on delete cascade,
  assigned_by uuid not null references auth.users (id) on delete restrict,
  status text not null default 'active'
    check (status in ('active', 'revoked')),
  assigned_at timestamptz not null default pg_catalog.now(),
  revoked_at timestamptz,
  unique (class_id, teacher_user_id),
  check ((status = 'active' and revoked_at is null) or (status = 'revoked' and revoked_at is not null))
);

create table public.class_student_enrollments (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  class_id uuid not null references public.sunday_school_classes (id) on delete cascade,
  student_user_id uuid not null references auth.users (id) on delete cascade,
  enrolled_by uuid not null references auth.users (id) on delete restrict,
  status text not null default 'active'
    check (status in ('active', 'withdrawn')),
  enrolled_at timestamptz not null default pg_catalog.now(),
  withdrawn_at timestamptz,
  unique (class_id, student_user_id),
  check ((status = 'active' and withdrawn_at is null) or (status = 'withdrawn' and withdrawn_at is not null))
);

create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  status text not null check (status in ('started', 'completed')),
  started_at timestamptz not null default pg_catalog.now(),
  completed_at timestamptz,
  updated_at timestamptz not null default pg_catalog.now(),
  primary key (user_id, lesson_id),
  check (
    (status = 'started' and completed_at is null)
    or (status = 'completed' and completed_at is not null)
  )
);

create table public.access_audit_events (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (pg_catalog.length(pg_catalog.btrim(action)) > 0),
  entity_type text not null check (pg_catalog.length(pg_catalog.btrim(entity_type)) > 0),
  entity_id uuid not null,
  details jsonb not null default '{}'::jsonb
    check (pg_catalog.jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default pg_catalog.now()
);

create index class_teacher_assignments_teacher_status_idx
  on public.class_teacher_assignments (teacher_user_id, status, class_id);
create index class_student_enrollments_student_status_idx
  on public.class_student_enrollments (student_user_id, status, class_id);
create index lesson_progress_user_status_idx
  on public.lesson_progress (user_id, status, updated_at desc);
create index access_audit_events_entity_idx
  on public.access_audit_events (entity_type, entity_id, created_at desc);

create trigger churches_set_updated_at
  before update on public.churches
  for each row execute function public.set_curriculum_updated_at();
create trigger sunday_school_classes_set_updated_at
  before update on public.sunday_school_classes
  for each row execute function public.set_curriculum_updated_at();

create function public.audit_access_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_row jsonb;
  action_name text;
  entity_id_value uuid;
begin
  if tg_op = 'DELETE' then
    changed_row := pg_catalog.to_jsonb(old);
    action_name := 'delete';
  else
    changed_row := pg_catalog.to_jsonb(new);
    action_name := pg_catalog.lower(tg_op);
  end if;
  entity_id_value := (changed_row ->> 'id')::uuid;
  if entity_id_value is null then
    entity_id_value := (changed_row ->> 'user_id')::uuid;
  end if;

  insert into public.access_audit_events (
    actor_id, action, entity_type, entity_id, details
  )
  values (
    auth.uid(),
    action_name,
    tg_table_name,
    entity_id_value,
    pg_catalog.jsonb_build_object('row', changed_row)
  );
  return null;
end;
$$;

alter function public.audit_access_change() owner to postgres;
revoke all on function public.audit_access_change()
  from public, anon, authenticated, service_role;

create trigger curriculum_admins_audit
  after insert or update or delete on public.curriculum_admins
  for each row execute function public.audit_access_change();
create trigger churches_audit
  after insert or update or delete on public.churches
  for each row execute function public.audit_access_change();
create trigger sunday_school_classes_audit
  after insert or update or delete on public.sunday_school_classes
  for each row execute function public.audit_access_change();
create trigger class_teacher_assignments_audit
  after insert or update or delete on public.class_teacher_assignments
  for each row execute function public.audit_access_change();
create trigger class_student_enrollments_audit
  after insert or update or delete on public.class_student_enrollments
  for each row execute function public.audit_access_change();

create function public.set_lesson_progress_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.started_at := pg_catalog.clock_timestamp();
    if new.status = 'completed' then
      new.completed_at := pg_catalog.clock_timestamp();
    else
      new.completed_at := null;
    end if;
  else
    if new.status = 'completed' and old.status is distinct from new.status then
      new.completed_at := pg_catalog.clock_timestamp();
    elsif new.status = 'started' then
      new.completed_at := null;
    end if;
  end if;
  new.updated_at := pg_catalog.clock_timestamp();
  return new;
end;
$$;

alter function public.set_lesson_progress_timestamps() owner to postgres;
revoke all on function public.set_lesson_progress_timestamps()
  from public, anon, authenticated, service_role;

create trigger lesson_progress_set_timestamps
  before insert or update on public.lesson_progress
  for each row execute function public.set_lesson_progress_timestamps();

create function public.can_read_assigned_teacher_material(p_lesson_id uuid)
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
      join public.sunday_school_classes as class
        on class.age_group = lesson.age_group
      join public.churches as church
        on church.id = class.church_id
      join public.class_teacher_assignments as assignment
        on assignment.class_id = class.id
      where lesson.id = p_lesson_id
        and assignment.teacher_user_id = auth.uid()
        and assignment.status = 'active'
        and class.status = 'active'
        and church.verification_status = 'verified'
        and public.can_read_published_lesson(lesson.id)
    );
$$;

alter function public.can_read_assigned_teacher_material(uuid) owner to postgres;
revoke all on function public.can_read_assigned_teacher_material(uuid)
  from public, anon, service_role, authenticated;
grant execute on function public.can_read_assigned_teacher_material(uuid)
  to authenticated;

alter table public.curriculum_admins enable row level security;
alter table public.churches enable row level security;
alter table public.sunday_school_classes enable row level security;
alter table public.class_teacher_assignments enable row level security;
alter table public.class_student_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.access_audit_events enable row level security;

revoke all on table
  public.curriculum_admins,
  public.churches,
  public.sunday_school_classes,
  public.class_teacher_assignments,
  public.class_student_enrollments,
  public.lesson_progress,
  public.access_audit_events
from public, anon, authenticated, service_role;

grant select, insert on public.lesson_progress to authenticated;
grant update (status) on public.lesson_progress to authenticated;

create policy "Users can read their own visible lesson progress"
  on public.lesson_progress
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.can_read_published_lesson(lesson_id))
  );

create policy "Users can start their own visible lessons"
  on public.lesson_progress
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.can_read_published_lesson(lesson_id))
  );

create policy "Users can update their own visible lesson progress"
  on public.lesson_progress
  for update
  to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.can_read_published_lesson(lesson_id))
  )
  with check (
    user_id = (select auth.uid())
    and (select public.can_read_published_lesson(lesson_id))
  );

grant select on public.teacher_lesson_materials to authenticated;
create policy "Assigned teachers can read age-matched teacher materials"
  on public.teacher_lesson_materials
  for select
  to authenticated
  using ((select public.can_read_assigned_teacher_material(lesson_id)));
