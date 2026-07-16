drop policy if exists "drama admins manage memberships" on public.drama_memberships;

create policy "drama admins insert memberships" on public.drama_memberships
for insert to authenticated with check ((select private.is_drama_admin(organization_id)));

create policy "drama admins update memberships" on public.drama_memberships
for update to authenticated
using ((select private.is_drama_admin(organization_id)))
with check ((select private.is_drama_admin(organization_id)));

create policy "drama admins delete memberships" on public.drama_memberships
for delete to authenticated using ((select private.is_drama_admin(organization_id)));
