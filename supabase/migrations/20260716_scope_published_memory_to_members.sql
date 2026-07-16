drop policy if exists "drama scoped candidate reads" on public.drama_learning_candidates;

create policy "drama scoped candidate reads" on public.drama_learning_candidates
for select to authenticated using (
  submitted_by = (select auth.uid())
  or (
    status = 'published_shared'
    and (select private.is_drama_member(organization_id))
  )
  or (select private.is_drama_admin(organization_id))
);
