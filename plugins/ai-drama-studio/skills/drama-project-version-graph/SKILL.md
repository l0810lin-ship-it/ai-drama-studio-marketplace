---
name: drama-project-version-graph
description: >-
  Build and audit a project version graph from Drive folders, scripts, outlines,
  pitches, revisions, client-marked files, localizations, duplicate copies,
  deliveries, comparison reports, and source materials. Use before choosing a
  current head, merging segments, localizing, revising, or packaging delivery.
---

# 项目版本图

真实项目文件夹不是普通文件列表，而是版本图。本 Skill 负责判断每个文件是什么、属于哪段、从哪里派生、能不能作为当前头。

## 文件角色

登记字段：

`artifact_id | title | drive_id | project_id | artifact_type | version_role | segment_range | language | derivative_of | current_head_candidate | duplicate_candidate | approval_status | extraction_status | risk`

常见角色：

- `project_bible`
- `pitch`
- `outline`
- `script`
- `revision`
- `client_marked`
- `localized`
- `delivery`
- `benchmark_reference`
- `comparison_report`
- `source_material`
- `retrospective`
- `delivery_package`
- `duplicate_pending`

## 冲突检测

必须阻塞：

- 两个文件都声称当前主版本。
- 交付稿比当前头旧，或缺少派生关系。
- 分段范围重叠、缺口或排序不明。
- 原名版/现名版/重复副本未确认。
- 客户标红稿和中文修改稿被误当成同一层。
- 对标 OCR 或原作素材被误当成项目真源。

## 分段规则

支持 EP1-9、EP10-20、EP21-40、EP1-10、EP11-28、EP31-40 等分段。每段必须记录：

- 起止集数。
- 源稿。
- 修改稿。
- 本地化稿。
- 客户标红稿。
- 交付稿。
- 缺失/重叠/重复状态。

## 输出

输出：

- `version_graph`
- `current_head_candidates`
- `segment_coverage`
- `duplicates_and_aliases`
- `blocked_conflicts`
- `safe_next_action`
- `minimum_confirmation_questions`

不得替用户选择当前头；证据不足时必须问最少确认问题。

## Eval 钩子

- duplicate handling: 相同大小/标题相似/重复副本不能被当成两个当前版本。
- alias handling: 原名版/现名版需要别名映射。
- segment coverage: 分段交付必须连续无缺口或明确说明缺口。
- benchmark boundary: 对标 OCR 不能进入当前头。
