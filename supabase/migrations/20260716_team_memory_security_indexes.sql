revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

create index if not exists drama_invites_organization_id_idx on public.drama_invites(organization_id);
create index if not exists drama_invites_created_by_idx on public.drama_invites(created_by);
create index if not exists drama_learning_candidates_organization_id_idx on public.drama_learning_candidates(organization_id);
create index if not exists drama_learning_candidates_submitted_by_idx on public.drama_learning_candidates(submitted_by);
create index if not exists drama_learning_candidates_reviewed_by_idx on public.drama_learning_candidates(reviewed_by);
create index if not exists drama_learning_candidates_status_idx on public.drama_learning_candidates(organization_id, status, created_at);
create index if not exists drama_learning_decisions_organization_id_idx on public.drama_learning_decisions(organization_id);
create index if not exists drama_learning_decisions_candidate_id_idx on public.drama_learning_decisions(candidate_id);
create index if not exists drama_learning_decisions_actor_id_idx on public.drama_learning_decisions(actor_id);
create index if not exists drama_memberships_user_id_idx on public.drama_memberships(user_id);
