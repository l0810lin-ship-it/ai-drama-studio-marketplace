---
name: drama-draft-comparison
description: >-
  Compare original, draft, revision, polished, localized, client-marked, and
  final short-drama files to extract change patterns, risks, adopted decisions,
  and reusable but approval-gated learning candidates. Use for draft-vs-final
  reports, line-by-line comparison, stage change reports, and revision retros.
---

# 初稿定稿对照分析

本 Skill 负责“看出怎么从 A 版变成 B 版”，不负责直接改稿。它的产物是证据表、变化类型、风险和学习候选。

## 输入

至少两份可比较文件：

- `original` / `draft`
- `revision`
- `polished`
- `client_marked`
- `localized`
- `delivery`
- `final`

必须先确认项目、版本关系、集数范围和哪一份是当前头候选。版本关系不明时先调用 `$drama-project-version-graph`。

## 对齐方式

优先级：

1. 稳定场号/集号。
2. 角色名 + 台词唯一子串。
3. 段落语义相似度。
4. 人工确认。

带 tracked changes 的 DOCX 不能直接用旧段落序号。接受修订会改变段落数时，必须改用唯一子串或场号锚定。

## 变化分类

每条变化标注：

- `cut`: 删除重复、拖慢、低产内容。
- `fold`: 信息折叠到动作或在场反派。
- `hook_upgrade`: 集尾/付费点增强。
- `logic_repair`: 修补因果、误会机制、动机链。
- `character_strengthening`: 人设更外化、更主动、更可见。
- `relationship_visibility`: 让深情/反差被对方看见。
- `worldbuilding_lock`: 世界观、身份揭露、术语、规则收束。
- `localization_register`: 称谓、辱骂、文化语域调整。
- `format_only`: 只改格式，不改内容。
- `risk_or_regression`: 引入新冲突、泄露、版本错位。

## 输出

输出：

- `comparison_manifest`
- `alignment_method`
- `change_table`
- `adopted_patterns`
- `rejected_or_risky_patterns`
- `affected_scope`
- `regression_cases_to_add`
- `learning_candidates`

学习候选必须分为项目私有、可泛化候选、不确定待确认、不可共享。不得把单项目客户偏好直接写入共享 Skill。

## Eval 钩子

- same source: 对比对象必须属于同一项目或明确对标关系。
- alignment evidence: 每条变化必须有版本、位置和锚点。
- no overlearning: 单项目偏好不能变成通用规则。
- stage report: 报告必须说清楚改了什么、为什么、影响哪里、没改什么。
