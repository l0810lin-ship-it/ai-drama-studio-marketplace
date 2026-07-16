import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = await mkdtemp(path.join(os.tmpdir(), "ai-drama-harness-"));
const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "studio.mjs");
const run = (...args) => JSON.parse(execFileSync(process.execPath, [script, ...args, "--workspace", root], { encoding: "utf8" }));

try {
  assert.equal(run("init").initialized, true);
  const project = run("project:create", "--project", "test-show", "--name", "Test Show", "--market", "US", "--rights", "authorized", "--head", "v1", "--truth", "Bible v1");
  assert.equal(project.id, "test-show");
  const knowledgeFile = path.join(root, "method.md");
  await writeFile(knowledgeFile, "# Hook method\nOpen the episode with an irreversible choice and preserve the locked reveal.");
  const source = run("knowledge:add", "--file", knowledgeFile, "--project", "test-show", "--type", "method", "--role", "approved-sop");
  assert.equal(source.status, "indexed");
  assert.equal(run("knowledge:query", "--query", "irreversible choice", "--project", "test-show").length, 1);
  const candidateFile = path.join(root, "candidate.json");
  await writeFile(candidateFile, JSON.stringify({ project_id: "test-show", lane: "project_private", statement: "Keep the approved delivery heading.", scope: "delivery format", confidence: 0.9, evidence_artifact_ids: ["artifact-1"], privacy: "private" }));
  const candidate = run("learning:add", "--file", candidateFile, "--local-only");
  assert.equal(candidate.status, "pending_local_review");
  run("learning:approve-private", "--id", candidate.id);
  const context = run("context", "--project", "test-show", "--workflow", "episode-script", "--task", "Use an irreversible choice for EP1", "--offline");
  assert.equal(context.status, "ready_for_model");
  assert.equal(context.approved_learning.project_private.length, 1);
  assert.equal(context.rag_results.length, 1);
  assert.equal(run("status").local_candidates, 1);
  const persisted = JSON.parse(await readFile(path.join(root, "projects", "test-show", "approved-private.json"), "utf8"));
  assert.equal(persisted.rules[0].status, "human_approved");
  const legacy = path.join(root, "legacy-runtime");
  await mkdir(path.join(legacy, "data", "projects"), { recursive: true });
  await mkdir(path.join(legacy, "learning", "projects", "legacy-show"), { recursive: true });
  await writeFile(path.join(legacy, "package.json"), JSON.stringify({ name: "ai-drama-studio" }));
  await writeFile(path.join(legacy, "data", "projects", "legacy-show.json"), JSON.stringify({ id: "legacy-show", title: "Legacy Show", rights_status: "authorized", current_head: "v2", locks: ["Keep reveal"], story_state: { target_market: "US" } }));
  await writeFile(path.join(legacy, "learning", "projects", "legacy-show", "approved-preferences.json"), JSON.stringify({ rules: [{ id: "legacy-rule", statement: "Keep the reveal", status: "approved_private" }] }));
  const migrated = run("migrate:legacy", "--from", legacy);
  assert.equal(migrated.projects, 1);
  assert.equal(migrated.private_rules, 1);
  const legacyApproved = JSON.parse(await readFile(path.join(root, "projects", "legacy-show", "approved-private.json"), "utf8"));
  assert.equal(legacyApproved.rules[0].status, "human_approved");
  console.log("AI Drama Studio harness: PASS");
} finally {
  await rm(root, { recursive: true, force: true });
}
