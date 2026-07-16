# Portable runtime contract

The bundled runtime is the deterministic persistence and team-memory harness. It never uploads source documents, scripts, comments, customer names, or project-private rules.

## Storage

- Workspace: `AI_DRAMA_STUDIO_HOME` or `~/.codex/ai-drama-studio/workspace`.
- Credentials: `~/.codex/ai-drama-studio/credentials.json`, mode `0600`.
- Project truth: `projects/<project-id>/truth.json`.
- Project-private approved memory: `projects/<project-id>/approved-private.json`.
- Shared approved memory: `memory/shared-approved.json`.
- Learning inbox and decisions: `memory/candidates.json`, `memory/decisions.json`.
- Raw artifact registry: `artifacts/registry.json`; raw files stay at their original local paths.

For users upgrading from the former standalone `ai-drama-studio` runtime, run `migrate:legacy --from <old-runtime-path>`. It merges project truth, private approvals, candidates, decisions, artifact lineage, and indexed knowledge into the new workspace without deleting or modifying the legacy directory and without uploading anything.

## Central memory

The public Supabase URL and publishable key are safe client configuration. Every data operation still requires the member's own Supabase Auth session and Row Level Security membership.

Prefer `team:browser-login --email <email>`. It serves a temporary loopback-only page, verifies the returned session with Supabase, and stores it locally. For terminal fallback, pass only `--email` to `team:signup` or `team:login`; the CLI asks for the password without echoing it. Never ask a user to paste a password into the Codex conversation and never place it in a committed file.

- `project_private`: remain local and require the local user's explicit approval.
- `generalizable_candidate`: must be anonymized, then enters central admin review.
- `uncertain_requires_human`: must be anonymized, then enters central admin review without becoming a rule.
- `published_shared`: only an organization admin can publish after `shared_review`, and only members of the same organization can retrieve it.

Local candidate IDs may be human-readable. Central storage assigns its own UUID and keeps the local ID in `client_candidate_key`, so legacy candidates remain traceable without violating the database ID contract.

Run `node scripts/studio.mjs <command>` from this Skill directory. Add `--workspace <path>` only when the user explicitly wants a non-default workspace.
