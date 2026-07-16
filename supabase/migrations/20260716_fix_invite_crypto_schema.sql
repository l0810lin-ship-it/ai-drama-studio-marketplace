create or replace function public.create_drama_invite(target_organization uuid, invite_role text default 'member', valid_hours integer default 168)
returns text language plpgsql security definer set search_path = pg_catalog, public, extensions as $$
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
returns uuid language plpgsql security definer set search_path = pg_catalog, public, extensions as $$
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

revoke all on function public.create_drama_invite(uuid, text, integer) from public, anon;
revoke all on function public.redeem_drama_invite(text) from public, anon;
grant execute on function public.create_drama_invite(uuid, text, integer) to authenticated;
grant execute on function public.redeem_drama_invite(text) to authenticated;
