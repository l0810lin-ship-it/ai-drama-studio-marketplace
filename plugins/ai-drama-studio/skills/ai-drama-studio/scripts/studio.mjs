#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { chmod, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";

const CENTRAL_URL = "https://yvoszdyushsrlkweklrd.supabase.co";
const CENTRAL_KEY = "sb_publishable_4WOPTwk2_NctzEphsfjaCQ_70h0uJxq";
const argv = process.argv.slice(2);
const command = argv.shift() || "status";

function option(name, fallback = undefined) {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 ? argv[index + 1] : fallback;
}

function flag(name) {
  return argv.includes(`--${name}`);
}

async function readSecret(label = "Password: ") {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) return null;
  process.stdout.write(label);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.off("data", onData);
      process.stdout.write("\n");
      resolve(value);
    };
    const onData = (buffer) => {
      for (const byte of buffer) {
        if (byte === 3) {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          reject(new Error("Cancelled."));
          return;
        }
        if (byte === 13 || byte === 10) { finish(); return; }
        if (byte === 127 || byte === 8) value = value.slice(0, -1);
        else if (byte >= 32) value += String.fromCharCode(byte);
      }
    };
    process.stdin.on("data", onData);
  });
}

function safeKey(value, label) {
  if (!value || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(value)) {
    throw new Error(`${label} must use letters, numbers, dot, underscore or hyphen.`);
  }
  return value;
}

const workspace = path.resolve(option("workspace", process.env.AI_DRAMA_STUDIO_HOME || path.join(os.homedir(), ".codex", "ai-drama-studio", "workspace")));
const credentialFile = path.join(os.homedir(), ".codex", "ai-drama-studio", "credentials.json");

async function readJson(file, fallback = null) {
  try { return JSON.parse(await readFile(file, "utf8")); } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(file, value, mode) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode });
  await rename(temporary, file);
  if (mode) await chmod(file, mode);
}

async function initWorkspace() {
  const configFile = path.join(workspace, "studio.json");
  const existing = await readJson(configFile);
  const config = existing || {
    schema_version: "1.0",
    workspace_id: randomUUID(),
    organization_id: null,
    central_url: CENTRAL_URL,
    central_publishable_key: CENTRAL_KEY,
    created_at: new Date().toISOString()
  };
  await writeJson(configFile, config);
  for (const [file, value] of [
    ["memory/shared-approved.json", { schema_version: "1.0", rules: [], synced_at: null }],
    ["memory/candidates.json", { schema_version: "1.0", candidates: [] }],
    ["memory/decisions.json", { schema_version: "1.0", decisions: [] }],
    ["artifacts/registry.json", { schema_version: "1.0", artifacts: [] }],
    ["knowledge/sources.json", { schema_version: "1.0", sources: [] }],
    ["knowledge/chunks.json", { schema_version: "1.0", chunks: [] }]
  ]) {
    const target = path.join(workspace, file);
    if (!(await readJson(target))) await writeJson(target, value);
  }
  return config;
}

async function config() {
  return initWorkspace();
}

async function credentials() {
  return readJson(credentialFile);
}

async function saveCredentials(value) {
  await writeJson(credentialFile, value, 0o600);
}

async function request(route, { method = "GET", body, token, prefer } = {}) {
  const current = await config();
  const response = await fetch(`${current.central_url}${route}`, {
    method,
    headers: {
      apikey: current.central_publishable_key,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(prefer ? { Prefer: prefer } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  const text = await response.text();
  let payload = text;
  try { payload = text ? JSON.parse(text) : null; } catch {}
  if (!response.ok) throw new Error(`${method} ${route} failed (${response.status}): ${typeof payload === "string" ? payload : payload?.message || payload?.error_description || JSON.stringify(payload)}`);
  return payload;
}

async function session() {
  let saved = await credentials();
  if (!saved?.access_token) throw new Error("Not signed in. Run team:signup or team:login first.");
  if ((saved.expires_at || 0) <= Math.floor(Date.now() / 1000) + 60) {
    const refreshed = await request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: saved.refresh_token } });
    saved = { ...refreshed, expires_at: Math.floor(Date.now() / 1000) + refreshed.expires_in };
    await saveCredentials(saved);
  }
  return saved;
}

async function authenticated(route, options = {}) {
  return request(route, { ...options, token: (await session()).access_token });
}

async function setOrganization(organizationId) {
  const current = await config();
  current.organization_id = organizationId;
  current.updated_at = new Date().toISOString();
  await writeJson(path.join(workspace, "studio.json"), current);
}

function requireOrganization(current) {
  if (!current.organization_id) throw new Error("No team selected. Create an organization or redeem an invite first.");
  return current.organization_id;
}

async function createProject() {
  await initWorkspace();
  const id = safeKey(option("project"), "project");
  const file = path.join(workspace, "projects", id, "truth.json");
  if (await readJson(file)) throw new Error(`Project already exists: ${id}`);
  const truth = {
    schema_version: "1.0", id,
    name: option("name", id), market: option("market", "unspecified"),
    rights_status: option("rights", "unknown"), current_head: option("head", null),
    truth_source: option("truth", null), locks: [], story_state: {},
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  };
  await writeJson(file, truth);
  await writeJson(path.join(workspace, "projects", id, "approved-private.json"), { schema_version: "1.0", rules: [] });
  return truth;
}

async function recordArtifact() {
  const projectId = safeKey(option("project"), "project");
  const role = option("role");
  const source = path.resolve(option("file"));
  if (!role || !["original", "draft", "client_notes", "revised", "submitted", "accepted", "outcome", "sop", "research", "other"].includes(role)) throw new Error("Invalid artifact role.");
  await readFile(source);
  const registryFile = path.join(workspace, "artifacts", "registry.json");
  const registry = await readJson(registryFile, { schema_version: "1.0", artifacts: [] });
  const artifact = { id: randomUUID(), project_id: projectId, role, source_path: source, version_of: option("version-of", null), note: option("note", ""), recorded_at: new Date().toISOString() };
  registry.artifacts.push(artifact);
  await writeJson(registryFile, registry);
  return artifact;
}

function textChunks(text, limit = 1400) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const chunks = [];
  let buffer = [];
  let start = 1;
  const flush = (end) => {
    const content = buffer.join("\n").trim();
    if (content) chunks.push({ start_line: start, end_line: end, content });
    buffer = [];
  };
  for (let index = 0; index < lines.length; index += 1) {
    if (buffer.length && (buffer.join("\n").length + lines[index].length > limit || /^#{1,6}\s/.test(lines[index]))) {
      flush(index);
      start = index + 1;
    }
    buffer.push(lines[index]);
  }
  flush(lines.length);
  return chunks;
}

function tokens(value) {
  return [...new Set((value.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || []))];
}

async function addKnowledge() {
  const sourcePath = path.resolve(option("file"));
  const extension = path.extname(sourcePath).toLowerCase();
  const supported = [".md", ".txt", ".json", ".csv"];
  const content = await readFile(sourcePath, "utf8").catch((error) => {
    if (!supported.includes(extension)) return null;
    throw error;
  });
  const sourceFile = path.join(workspace, "knowledge", "sources.json");
  const chunkFile = path.join(workspace, "knowledge", "chunks.json");
  const sources = await readJson(sourceFile, { schema_version: "1.0", sources: [] });
  const chunks = await readJson(chunkFile, { schema_version: "1.0", chunks: [] });
  const projectId = option("project", null);
  if (projectId) safeKey(projectId, "project");
  const digest = content ? createHash("sha256").update(content).digest("hex") : createHash("sha256").update(sourcePath).digest("hex");
  const existing = sources.sources.find((item) => item.sha256 === digest && item.project_id === projectId);
  if (existing) return existing;
  const source = {
    id: randomUUID(), source_path: sourcePath, sha256: digest,
    project_id: projectId, type: option("type", "method"), role: option("role", "reference"),
    status: supported.includes(extension) ? "indexed" : "requires_text_extraction",
    added_at: new Date().toISOString()
  };
  sources.sources.push(source);
  if (content) {
    for (const [index, chunk] of textChunks(content).entries()) {
      chunks.chunks.push({ id: `${source.id}-${index + 1}`, source_id: source.id, project_id: projectId, source_path: sourcePath, ...chunk });
    }
  }
  await writeJson(sourceFile, sources);
  await writeJson(chunkFile, chunks);
  return { ...source, chunks: chunks.chunks.filter((item) => item.source_id === source.id).length };
}

function mergeById(current = [], incoming = []) {
  const merged = [...current];
  for (const item of incoming) {
    const index = merged.findIndex((existing) => existing.id === item.id);
    if (index >= 0) merged[index] = { ...merged[index], ...item };
    else merged.push(item);
  }
  return merged;
}

async function migrateLegacy() {
  const legacyRoot = path.resolve(option("from"));
  if (legacyRoot === workspace) throw new Error("Legacy source and target workspace must be different.");
  await readFile(path.join(legacyRoot, "package.json"));
  await initWorkspace();
  const summary = { projects: 0, private_rules: 0, candidates: 0, decisions: 0, artifacts: 0, knowledge_sources: 0, knowledge_chunks: 0, source: legacyRoot, target: workspace };

  const legacyProjectsRoot = path.join(legacyRoot, "data", "projects");
  let projectFiles = [];
  try { projectFiles = (await readdir(legacyProjectsRoot)).filter((file) => file.endsWith(".json")); } catch {}
  for (const filename of projectFiles) {
    const legacy = await readJson(path.join(legacyProjectsRoot, filename));
    if (!legacy?.id) continue;
    const projectId = safeKey(legacy.id, "legacy project id");
    const currentHead = typeof legacy.current_head === "string" ? legacy.current_head : [legacy.current_head?.document, legacy.current_head?.version, legacy.current_head?.status].filter(Boolean).join(" / ") || null;
    const target = path.join(workspace, "projects", projectId, "truth.json");
    if (!(await readJson(target))) {
      await writeJson(target, {
        schema_version: "1.0", id: projectId, name: legacy.title || legacy.name || projectId,
        market: legacy.market || legacy.story_state?.target_market || "unspecified",
        rights_status: legacy.rights_status || "unknown", current_head: currentHead,
        truth_source: legacy.truth_source || path.join(legacyRoot, "data", "projects", filename),
        locks: legacy.locks || [], story_state: legacy.story_state || {},
        approved_decisions: legacy.approved_decisions || [], feedback_evidence: legacy.feedback_evidence || [],
        migrated_from: path.join(legacyRoot, "data", "projects", filename), migrated_at: new Date().toISOString()
      });
    }
    summary.projects += 1;
  }

  const legacyLearningRoot = path.join(legacyRoot, "learning", "projects");
  let learningProjects = [];
  try { learningProjects = await readdir(legacyLearningRoot, { withFileTypes: true }); } catch {}
  for (const entry of learningProjects.filter((item) => item.isDirectory())) {
    const projectId = safeKey(entry.name, "legacy learning project id");
    const legacyPrivate = await readJson(path.join(legacyLearningRoot, projectId, "approved-preferences.json"), { rules: [], preferences: [] });
    const targetPrivateFile = path.join(workspace, "projects", projectId, "approved-private.json");
    const targetPrivate = await readJson(targetPrivateFile, { schema_version: "1.0", rules: [] });
    const importedRules = [...(legacyPrivate.rules || []), ...(legacyPrivate.preferences || [])].map((rule) => ({ ...rule, status: "human_approved", migrated_at: new Date().toISOString() }));
    targetPrivate.rules = mergeById(targetPrivate.rules, importedRules);
    await writeJson(targetPrivateFile, targetPrivate);
    summary.private_rules += importedRules.length;
  }

  const legacyCandidates = await readJson(path.join(legacyRoot, "learning", "inbox", "candidates.json"), { candidates: [] });
  const targetCandidatesFile = path.join(workspace, "memory", "candidates.json");
  const targetCandidates = await readJson(targetCandidatesFile, { schema_version: "1.0", candidates: [] });
  const importedCandidates = (legacyCandidates.candidates || []).map((item) => ({ ...item, migrated_from_legacy: true }));
  targetCandidates.candidates = mergeById(targetCandidates.candidates, importedCandidates);
  await writeJson(targetCandidatesFile, targetCandidates);
  summary.candidates = importedCandidates.length;

  const legacyDecisions = await readJson(path.join(legacyRoot, "learning", "decisions.json"), { decisions: [] });
  const targetDecisionsFile = path.join(workspace, "memory", "decisions.json");
  const targetDecisions = await readJson(targetDecisionsFile, { schema_version: "1.0", decisions: [] });
  targetDecisions.decisions = [...targetDecisions.decisions, ...(legacyDecisions.decisions || [])];
  await writeJson(targetDecisionsFile, targetDecisions);
  summary.decisions = (legacyDecisions.decisions || []).length;

  const legacyArtifacts = await readJson(path.join(legacyRoot, "data", "artifacts", "registry.json"), { artifacts: [] });
  const targetArtifactsFile = path.join(workspace, "artifacts", "registry.json");
  const targetArtifacts = await readJson(targetArtifactsFile, { schema_version: "1.0", artifacts: [] });
  const importedArtifacts = (legacyArtifacts.artifacts || []).map((item) => ({ ...item, source_path: item.source_path || item.path, role: item.role || item.artifact_type || "other", migrated_from_legacy: true }));
  targetArtifacts.artifacts = mergeById(targetArtifacts.artifacts, importedArtifacts);
  await writeJson(targetArtifactsFile, targetArtifacts);
  summary.artifacts = importedArtifacts.length;

  const legacySources = await readJson(path.join(legacyRoot, "knowledge", "sources.json"), { sources: [] });
  const targetSourcesFile = path.join(workspace, "knowledge", "sources.json");
  const targetSources = await readJson(targetSourcesFile, { schema_version: "1.0", sources: [] });
  const sourcePathById = new Map();
  const importedSources = (legacySources.sources || []).map((item) => {
    const absolute = path.resolve(legacyRoot, "knowledge", item.path || item.source_path);
    sourcePathById.set(item.id, absolute);
    return { ...item, source_path: absolute, project_id: item.project_id || null, migrated_from_legacy: true };
  });
  targetSources.sources = mergeById(targetSources.sources, importedSources);
  await writeJson(targetSourcesFile, targetSources);
  summary.knowledge_sources = importedSources.length;

  const legacyChunks = await readJson(path.join(legacyRoot, "knowledge", "generated", "chunks.json"), []);
  const targetChunksFile = path.join(workspace, "knowledge", "chunks.json");
  const targetChunks = await readJson(targetChunksFile, { schema_version: "1.0", chunks: [] });
  const importedChunks = (Array.isArray(legacyChunks) ? legacyChunks : legacyChunks.chunks || []).map((item) => ({ ...item, project_id: item.project_id || null, source_path: sourcePathById.get(item.source_id) || item.source_path, migrated_from_legacy: true }));
  targetChunks.chunks = mergeById(targetChunks.chunks, importedChunks);
  await writeJson(targetChunksFile, targetChunks);
  summary.knowledge_chunks = importedChunks.length;

  return summary;
}

async function queryKnowledge(query = option("query", ""), projectId = option("project", null)) {
  const words = tokens(query);
  const data = await readJson(path.join(workspace, "knowledge", "chunks.json"), { chunks: [] });
  return data.chunks
    .filter((chunk) => !chunk.project_id || chunk.project_id === projectId)
    .map((chunk) => {
      const haystack = chunk.content.toLowerCase();
      const score = words.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
      return { ...chunk, score };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score || a.source_path.localeCompare(b.source_path))
    .slice(0, Number(option("limit", 8)))
    .map(({ content, ...chunk }) => ({ ...chunk, excerpt: content.slice(0, 1200), citation: `${chunk.source_path}:${chunk.start_line}-${chunk.end_line}` }));
}

function validateCandidate(candidate) {
  const normalized = {
    ...candidate,
    id: candidate.id || randomUUID(),
    project_id: safeKey(candidate.project_id || candidate.project_key, "project_id"),
    lane: candidate.lane,
    statement: candidate.statement?.trim(),
    scope: candidate.scope?.trim(),
    confidence: Number(candidate.confidence),
    evidence_summary: candidate.evidence_summary || [],
    evidence_artifact_ids: candidate.evidence_artifact_ids || [],
    counterexamples: candidate.counterexamples || [],
    privacy: candidate.privacy || "private",
    suggested_action: candidate.suggested_action || "human_review"
  };
  if (!["project_private", "generalizable_candidate", "uncertain_requires_human"].includes(normalized.lane)) throw new Error("Invalid candidate lane.");
  if (!normalized.statement || !normalized.scope || !Number.isFinite(normalized.confidence) || normalized.confidence < 0 || normalized.confidence > 1) throw new Error("Candidate statement, scope and confidence (0-1) are required.");
  if (!Array.isArray(normalized.evidence_artifact_ids) || !normalized.evidence_artifact_ids.length) throw new Error("At least one evidence_artifact_id is required.");
  if (normalized.lane !== "project_private" && normalized.privacy !== "anonymized") throw new Error("Central candidates must be anonymized before submission.");
  return normalized;
}

async function pushCandidate(candidate) {
  const current = await config();
  const auth = await session();
  const organizationId = requireOrganization(current);
  const candidateKey = encodeURIComponent(candidate.id);
  const existing = await authenticated(`/rest/v1/drama_learning_candidates?organization_id=eq.${organizationId}&submitted_by=eq.${auth.user.id}&client_candidate_key=eq.${candidateKey}&select=id,status`);
  if (existing?.length) return existing[0];
  const rows = await authenticated("/rest/v1/drama_learning_candidates?select=*", {
    method: "POST", prefer: "return=representation", body: {
      organization_id: organizationId, project_key: candidate.project_id,
      client_candidate_key: candidate.id,
      submitted_by: auth.user.id, lane: candidate.lane, statement: candidate.statement,
      scope: candidate.scope, confidence: candidate.confidence,
      evidence_summary: candidate.evidence_summary, evidence_artifact_ids: candidate.evidence_artifact_ids,
      counterexamples: candidate.counterexamples, privacy: candidate.privacy,
      suggested_action: candidate.suggested_action, status: "pending"
    }
  });
  return rows?.[0];
}

async function submitCandidateById(id) {
  const inboxFile = path.join(workspace, "memory", "candidates.json");
  const inbox = await readJson(inboxFile, { schema_version: "1.0", candidates: [] });
  const candidate = inbox.candidates.find((item) => item.id === id);
  if (!candidate) throw new Error(`Unknown candidate: ${id}`);
  if (candidate.lane === "project_private") throw new Error("Project-private candidates stay local and cannot enter central memory.");
  const remote = await pushCandidate(candidate);
  candidate.status = remote.status === "pending" ? "pending_central_review" : remote.status;
  candidate.remote_id = remote.id;
  candidate.synced_at = new Date().toISOString();
  delete candidate.sync_error;
  await writeJson(inboxFile, inbox);
  return candidate;
}

async function flushCandidates() {
  const inbox = await readJson(path.join(workspace, "memory", "candidates.json"), { candidates: [] });
  const pending = inbox.candidates.filter((item) => item.lane !== "project_private" && !item.remote_id);
  const results = [];
  for (const candidate of pending) {
    try { results.push(await submitCandidateById(candidate.id)); }
    catch (error) { results.push({ id: candidate.id, error: error.message }); }
  }
  return { attempted: pending.length, synced: results.filter((item) => !item.error).length, results };
}

async function addCandidate() {
  const file = path.resolve(option("file"));
  const candidate = validateCandidate(await readJson(file));
  const inboxFile = path.join(workspace, "memory", "candidates.json");
  const inbox = await readJson(inboxFile, { schema_version: "1.0", candidates: [] });
  if (inbox.candidates.some((item) => item.id === candidate.id)) throw new Error(`Candidate already exists: ${candidate.id}`);
  const stored = { ...candidate, status: "pending_local_review", created_at: new Date().toISOString() };
  inbox.candidates.push(stored);
  await writeJson(inboxFile, inbox);
  if (candidate.lane !== "project_private" && !flag("local-only")) {
    const current = await config();
    const auth = await credentials();
    if (current.organization_id && auth?.access_token) {
      try {
        const remote = await pushCandidate(candidate);
        stored.status = "pending_central_review";
        stored.remote_id = remote.id;
        stored.synced_at = new Date().toISOString();
      } catch (error) {
        stored.status = "pending_central_sync";
        stored.sync_error = error.message;
      }
    } else {
      stored.status = "pending_team_login";
    }
    await writeJson(inboxFile, inbox);
  }
  return stored;
}

async function approvePrivate() {
  const id = option("id");
  const inboxFile = path.join(workspace, "memory", "candidates.json");
  const inbox = await readJson(inboxFile, { candidates: [] });
  const candidate = inbox.candidates.find((item) => item.id === id);
  if (!candidate || candidate.lane !== "project_private") throw new Error("Unknown project-private candidate.");
  const target = path.join(workspace, "projects", candidate.project_id, "approved-private.json");
  const approved = await readJson(target, { schema_version: "1.0", rules: [] });
  if (!approved.rules.some((item) => item.id === id)) approved.rules.push({ ...candidate, status: "human_approved", approved_at: new Date().toISOString() });
  candidate.status = "approved_private";
  await writeJson(target, approved);
  await writeJson(inboxFile, inbox);
  return candidate;
}

async function syncMemory() {
  const current = await config();
  const organizationId = requireOrganization(current);
  const shared = await authenticated(`/rest/v1/drama_learning_candidates?organization_id=eq.${organizationId}&status=eq.published_shared&select=id,project_key,lane,statement,scope,confidence,evidence_summary,counterexamples,admin_note,updated_at&order=updated_at.asc`);
  await writeJson(path.join(workspace, "memory", "shared-approved.json"), { schema_version: "1.0", organization_id: organizationId, synced_at: new Date().toISOString(), rules: shared.map((item) => ({ ...item, status: "human_approved" })) });
  return shared;
}

async function reviewCentral() {
  const current = await config();
  const organizationId = requireOrganization(current);
  return authenticated(`/rest/v1/drama_learning_candidates?organization_id=eq.${organizationId}&status=in.(pending,needs_edit,shared_review)&select=*&order=created_at.asc`);
}

async function decideCentral() {
  const statusByDecision = { needs_edit: "needs_edit", reject: "rejected", approve_private: "approved_private", submit_shared: "shared_review", publish_shared: "published_shared" };
  const next = statusByDecision[option("decision")];
  if (!next) throw new Error("decision must be needs_edit, reject, approve_private, submit_shared or publish_shared.");
  return authenticated("/rest/v1/rpc/review_drama_learning_candidate", { method: "POST", body: { candidate_id: option("id"), next_status: next, decision_note: option("note", null) } });
}

async function buildContext() {
  const projectId = safeKey(option("project"), "project");
  const truth = await readJson(path.join(workspace, "projects", projectId, "truth.json"));
  if (!truth) return { status: "blocked", blockers: ["project_truth_missing"], project_id: projectId };
  const blockers = [];
  if (truth.rights_status !== "authorized" && option("workflow") === "authorized-adaptation") blockers.push("rights_not_authorized");
  if (!truth.truth_source) blockers.push("truth_source_missing");
  if (!truth.current_head) blockers.push("current_head_missing");
  if (!flag("offline") && await credentials()) {
    try { await syncMemory(); } catch (error) { console.error(`Shared memory sync warning: ${error.message}`); }
  }
  const privateRules = await readJson(path.join(workspace, "projects", projectId, "approved-private.json"), { rules: [] });
  const sharedRules = await readJson(path.join(workspace, "memory", "shared-approved.json"), { rules: [] });
  const ragResults = await queryKnowledge(`${option("task", "")} ${option("workflow", "episode-script")}`, projectId);
  return {
    status: blockers.length ? "blocked" : "ready_for_model", blockers,
    project_id: projectId, workflow: option("workflow", "episode-script"), task: option("task", ""),
    truth, locks: truth.locks || [],
    rag_results: ragResults,
    approved_learning: { project_private: privateRules.rules.filter((item) => item.status === "human_approved"), shared: sharedRules.rules.filter((item) => item.status === "human_approved") },
    memory_provenance: { project_file: `projects/${projectId}/approved-private.json`, shared_synced_at: sharedRules.synced_at || null }
  };
}

async function authAction(kind) {
  const email = option("email");
  const password = option("password", process.env.AI_DRAMA_STUDIO_PASSWORD) || await readSecret();
  if (!email || !password) throw new Error(`team:${kind} requires --email and an interactive password (or AI_DRAMA_STUDIO_PASSWORD).`);
  const route = kind === "signup" ? "/auth/v1/signup" : "/auth/v1/token?grant_type=password";
  const payload = await request(route, { method: "POST", body: { email, password } });
  if (payload.access_token) await saveCredentials({ ...payload, expires_at: Math.floor(Date.now() / 1000) + payload.expires_in });
  let pending_sync = null;
  if (payload.access_token && (await config()).organization_id) pending_sync = await flushCandidates();
  return { user_id: payload.user?.id, email_confirmation_required: !payload.access_token, signed_in: Boolean(payload.access_token), pending_sync };
}

function openBrowser(url) {
  const [program, args] = process.platform === "darwin"
    ? ["open", [url]]
    : process.platform === "win32"
      ? ["cmd", ["/c", "start", "", url]]
      : ["xdg-open", [url]];
  const child = spawn(program, args, { detached: true, stdio: "ignore" });
  child.unref();
}

async function browserLogin() {
  const current = await config();
  const nonce = randomUUID();
  const initialEmail = option("email", "");
  let settle;
  const completed = new Promise((resolve, reject) => { settle = { resolve, reject }; });
  const server = createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>AI 漫剧团队登录</title><style>body{font:16px system-ui;background:#f2eee5;color:#1f352d;display:grid;place-items:center;min-height:100vh;margin:0}.card{width:min(420px,calc(100% - 40px));background:#fff;padding:30px;border-radius:20px;box-shadow:0 20px 60px #183d2c20}h1{font-size:24px}label{display:block;margin:16px 0 6px}input,button{box-sizing:border-box;width:100%;padding:12px;border-radius:10px;border:1px solid #c9d0ca}button{margin-top:12px;background:#29473c;color:#fff;border:0;font-weight:700}.secondary{background:#e8eee9;color:#29473c}small{display:block;margin-top:14px;color:#65736b;line-height:1.5}#message{min-height:24px;margin-top:12px}</style><main class="card"><h1>AI 漫剧团队记忆</h1><p>密码只发送给 Supabase，不经过 Codex 对话。</p><label>邮箱</label><input id="email" type="email" autocomplete="email" value=${JSON.stringify(initialEmail)}><label>密码</label><input id="password" type="password" autocomplete="current-password"><button onclick="auth('login')">登录</button><button class="secondary" onclick="auth('signup')">首次注册</button><div id="message"></div><small>首次注册如果需要验证邮箱，请完成邮件确认后回到本页登录。本页只在你的电脑 127.0.0.1 上临时运行。</small></main><script>const base=${JSON.stringify(current.central_url)},key=${JSON.stringify(current.central_publishable_key)},nonce=${JSON.stringify(nonce)};async function auth(kind){const message=document.querySelector('#message');message.textContent='处理中…';const email=document.querySelector('#email').value,password=document.querySelector('#password').value;const route=kind==='signup'?'/auth/v1/signup':'/auth/v1/token?grant_type=password';const response=await fetch(base+route,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email,password})});const data=await response.json();if(!response.ok){message.textContent=data.message||data.error_description||'登录失败';return}if(!data.access_token){message.textContent='注册成功，请先完成邮箱确认，然后点击登录。';return}const saved=await fetch('/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nonce,session:data})});message.textContent=saved.ok?'登录成功，可以关闭此页面。':'本机会话保存失败。';}</script></html>`);
      return;
    }
    if (req.method === "POST" && req.url === "/session") {
      let body = "";
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 1_000_000) { res.writeHead(413).end(); return; }
      }
      try {
        const payload = JSON.parse(body);
        if (payload.nonce !== nonce || !payload.session?.access_token) throw new Error("Invalid callback.");
        const userResponse = await fetch(`${current.central_url}/auth/v1/user`, { headers: { apikey: current.central_publishable_key, Authorization: `Bearer ${payload.session.access_token}` } });
        if (!userResponse.ok) throw new Error("Supabase rejected the session.");
        const user = await userResponse.json();
        await saveCredentials({ ...payload.session, user, expires_at: Math.floor(Date.now() / 1000) + payload.session.expires_in });
        res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ ok: true }));
        settle.resolve(user);
        setTimeout(() => server.close(), 100);
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    res.writeHead(404).end();
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/`;
  openBrowser(url);
  const timer = setTimeout(() => { server.close(); settle.reject(new Error("Browser login timed out after 5 minutes.")); }, 300_000);
  try {
    const user = await completed;
    clearTimeout(timer);
    const pending_sync = current.organization_id ? await flushCandidates() : null;
    return { signed_in: true, user_id: user.id, email: user.email, pending_sync };
  } finally {
    clearTimeout(timer);
  }
}

async function createOrganization() {
  const result = await authenticated("/rest/v1/rpc/create_drama_organization", { method: "POST", body: { organization_name: option("name"), organization_slug: safeKey(option("slug"), "slug") } });
  const organizationId = typeof result === "string" ? result : result?.id || result;
  await setOrganization(organizationId);
  return { organization_id: organizationId, role: "admin", pending_sync: await flushCandidates() };
}

async function createInvite() {
  const current = await config();
  return authenticated("/rest/v1/rpc/create_drama_invite", { method: "POST", body: { target_organization: requireOrganization(current), invite_role: option("role", "member"), valid_hours: Number(option("hours", 168)) } });
}

async function redeemInvite() {
  const result = await authenticated("/rest/v1/rpc/redeem_drama_invite", { method: "POST", body: { invite_code: option("code") } });
  const organizationId = typeof result === "string" ? result : result?.organization_id || result;
  await setOrganization(organizationId);
  return { organization_id: organizationId, joined: true, pending_sync: await flushCandidates() };
}

async function status() {
  const current = await config();
  const auth = await credentials();
  const projectsRoot = path.join(workspace, "projects");
  let projects = [];
  try { projects = await readdir(projectsRoot); } catch {}
  const inbox = await readJson(path.join(workspace, "memory", "candidates.json"), { candidates: [] });
  const shared = await readJson(path.join(workspace, "memory", "shared-approved.json"), { rules: [] });
  return { status: "ready", workspace, organization_id: current.organization_id, signed_in: Boolean(auth?.access_token), projects, local_candidates: inbox.candidates.length, shared_rules: shared.rules.length, shared_synced_at: shared.synced_at };
}

function help() {
  return {
    harness: "AI Drama Studio portable runtime",
    workspace,
    commands: {
      local: ["init", "status", "migrate:legacy", "project:create", "artifact:record", "knowledge:add", "knowledge:query", "context"],
      learning: ["learning:add", "learning:approve-private", "learning:submit", "learning:flush", "learning:sync", "learning:review", "learning:decide"],
      team: ["team:browser-login", "team:signup", "team:login", "team:create-org", "team:create-invite", "team:join", "team:logout"]
    },
    note: "Run a command with its required --options. Use references/runtime-contract.md for privacy and storage rules."
  };
}

const handlers = {
  help: async () => help(),
  init: async () => ({ initialized: true, workspace, config: await initWorkspace() }),
  status,
  "migrate:legacy": migrateLegacy,
  "project:create": createProject,
  "artifact:record": recordArtifact,
  "knowledge:add": addKnowledge,
  "knowledge:query": () => queryKnowledge(),
  "learning:add": addCandidate,
  "learning:submit": () => submitCandidateById(option("id")),
  "learning:flush": flushCandidates,
  "learning:approve-private": approvePrivate,
  "learning:sync": syncMemory,
  "learning:review": reviewCentral,
  "learning:decide": decideCentral,
  context: buildContext,
  "team:signup": () => authAction("signup"),
  "team:login": () => authAction("login"),
  "team:browser-login": browserLogin,
  "team:create-org": createOrganization,
  "team:create-invite": createInvite,
  "team:join": redeemInvite,
  "team:logout": async () => { await saveCredentials({}); return { signed_in: false }; }
};

if (!handlers[command]) throw new Error(`Unknown command: ${command}`);
console.log(JSON.stringify(await handlers[command](), null, 2));
