alter table public.drama_learning_candidates
add column if not exists client_candidate_key text;

create unique index if not exists drama_learning_candidates_client_key_idx
on public.drama_learning_candidates(organization_id, submitted_by, client_candidate_key)
where client_candidate_key is not null;
