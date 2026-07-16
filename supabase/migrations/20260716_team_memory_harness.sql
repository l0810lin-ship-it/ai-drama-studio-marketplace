create table if not exists public.drama_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.drama_organizations(id) on delete cascade,
  code_hash text not null unique,
  role text not null check (role in ('member', 'admin')),
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  max_uses integer not null default 1 check (max_uses > 0),
  use_count integer not null default 0 check (use_count >= 0),
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

revoke all on public.drama_invites from public, anon, authenticated;
alter table public.drama_invites enable row level security;

drop policy if exists "drama members read candidates" on public.drama_learning_candidates;
create policy "drama scoped candidate reads" on public.drama_learning_candidates
for select to authenticated using (
  submitted_by = (select auth.uid())
  or status = 'published_shared'
  or (select private.is_drama_admin(organization_id))
);

drop policy if exists "drama members read decisions" on public.drama_learning_decisions;
create policy "drama scoped decision reads" on public.drama_learning_decisions
for select to authenticated using (
  actor_id = (select auth.uid())
  or (select private.is_drama_admin(organization_id))
);

create or replace function public.create_drama_organization(organization_name text, organization_slug text)
returns uuid language plpgsql security definer set search_path = pg_catalog, public as $$
declare actor uuid := (select auth.uid()); created_id uuid;
begin
  if actor is null then raise exception 'authentication required'; end if;
  if organization_name is null or length(trim(organization_name)) < 2 then raise exception 'organization name required'; end if;
  if organization_slug !~ '^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$' then raise exception 'invalid organization slug'; end if;
  insert into public.drama_organizations(name, slug) values (trim(organization_name), organization_slug) returning id into created_id;
  insert into public.drama_memberships(organization_id, user_id, role) values (created_id, actor, 'admin');
  return created_id;
end; $$;

create or replace function public.create_drama_invite(target_organization uuid, invite_role text default 'member', valid_hours integer default 168)
returns text language plpgsql security definer set search_path = pg_catalog, public as $$
declare actor uuid := (select auth.uid()); plain_code text;
begin
  if actor is null or not (select private.is_drama_admin(target_organization)) then raise exception 'admin required'; end if;
  if invite_role not in ('member', 'admin') then raise exception 'invalid role'; end if;
  if valid_hours < 1 or valid_hours > 720 then raise exception 'valid_hours must be 1-720'; end if;
  plain_code := encode(extensions.gen_random_bytes(18), 'hex');
  insert into public.drama_invites(organization_id, code_hash, role, created_by, expires_at)
  values (target_organization, encode(extensions.digest(plain_code, 'sha256'), 'hex'), invite_role, actor, now() + make_interval(hours => valid_hours));
  return plain_code;
end; $$;

create or replace function public.redeem_drama_invite(invite_code text)
returns uuid language plpgsql security definer set search_path = pg_catalog, public as $$
declare actor uuid := (select auth.uid()); invite_row public.drama_invites;
begin
  if actor is null then raise exception 'authentication required'; end if;
  select * into invite_row from public.drama_invites
  where code_hash = encode(extensions.digest(invite_code, 'sha256'), 'hex') for update;
  if invite_row.id is null or invite_row.revoked or invite_row.expires_at <= now() or invite_row.use_count >= invite_row.max_uses then raise exception 'invite invalid or expired'; end if;
  insert into public.drama_memberships(organization_id, user_id, role)
  values (invite_row.organization_id, actor, invite_row.role)
  on conflict (organization_id, user_id) do nothing;
  update public.drama_invites set use_count = use_count + 1 where id = invite_row.id;
  return invite_row.organization_id;
end; $$;

revoke all on function public.create_drama_organization(text, text) from public, anon;
revoke all on function public.create_drama_invite(uuid, text, integer) from public, anon;
revoke all on function public.redeem_drama_invite(text) from public, anon;
grant execute on function public.create_drama_organization(text, text) to authenticated;
grant execute on function public.create_drama_invite(uuid, text, integer) to authenticated;
grant execute on function public.redeem_drama_invite(text) to authenticated;
