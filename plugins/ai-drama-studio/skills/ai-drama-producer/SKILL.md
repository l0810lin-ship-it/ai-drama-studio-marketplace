---
name: ai-drama-producer
description: >-
  AI comic-drama producer for project development, world bibles, season outlines,
  episode task cards and scripts, authorized adaptation, localization, pitch packs,
  and customer-feedback revision proposals. Use when the user asks to create,
  expand, review, localize, adapt, or revise an AI comic-drama / vertical drama project.
---

# AI 漫剧制片

先按 `$ai-drama-studio` 的“初始化 Harness”规则使用插件内置运行时；不得写死开发者电脑路径。

## 核心边界

1. **真源高于 RAG。** `Project Bible`、锁定项、当前剧本头版本与批准状态是结构化事实；任何 SOP、示例或检索结果均不得覆盖它们。
2. **先确认工作流，再生成。** 可用工作流是立项与世界观、季纲与分集卡、单集剧本、授权改编、本地化、Pitch、反馈修订、格式检查、交付封装、视觉资产、分镜与平台合规。
3. **客服反馈不是改稿命令。** 导入 → 归因/聚类 → 修订提案 → 人工批准 → 生成修订稿与变更日志。未批准前不得写回真源。
4. **改编需授权。** 只有项目 `rights_status` 为 `authorized` 时才允许执行原稿改编；其他情况下仅做高层结构分析或原创方案。
5. **不伪造模型输出。** 未配置模型端点时，完成可做的真源核对、RAG 检索、任务卡/提案规划，并明确说明生成调用还未配置。

## 数据源装配

当项目来自 Sheet/Drive 数据源时，Producer 只负责把任务拆清楚，不直接吞掉所有资产：

1. 读取 `project_catalog` 确认剧名、男女频、题材、集数、简介、一卡梗概、卡点、链接和对标剧。
2. 读取 `project_artifact` registry，识别剧本、集纲、梗概、Pitch、本地化稿、对标 OCR、交付稿、客户批注稿、人工润色稿、逐场对比和复盘报告及其版本角色。
3. 选择工作流：剧本/集纲、Pitch、hook/pacing、story continuity、authorized adaptation、本地化、客户修订、格式/交付、视觉/分镜、合规。
4. 对项目私有偏好、客户原文、IP 细节和单次反馈默认设为 `project_private` 或 `not_learnable_shared`。
5. 只有通用方法论和经审核的市场/世界观资料可作为共享知识候选。

如果 `current_head`、修改稿、交付稿或客户批注之间存在版本冲突，先输出冲突表和最小确认问题，不生成正文。

真实 Drive 项目文件夹通常是版本图，不是单文件目录。至少登记：`segment_range`、`version_role`、`current_head_candidate`、`duplicate_candidate`、`localized_derivative`、`client_marked_derivative`、`benchmark_reference`、`comparison_report` 和 `delivery_package`。

## Hook / Pacing / 精修工作流

当任务是“太拖、不够爽、钩子弱、中段平、男主/女主不立、删减提速、改稿精修”时，先按独立 workflow 处理，不和从 0 生成混在一起：

1. 逐场判断：这一场是否推进某组关系，或制造下一集钩子；两者都没有则进入删减/折叠候选。
2. 删减优先：重复受难、重复解释规则、无对手戏纯氛围、解释成本高的支线、低产结构花活。
3. 信息折叠：把背景、阻力、力量解释折进一个强动作或在场反派，不用整场说明戏。
4. 付费卡点检查：不可逆代价 + 双倒计时 + 第三方介入/对撞。
5. 集尾优先反转钩，而不是只抛悬念。
6. 中段每 1-2 集翻一次情绪面，甜/虐/误会/救援/认错必须有事件触发。
7. 深情和反差要被对方看见；独处 VO 只能算观众信息，不能算关系入账。
8. 多角关系优先同框对照，逼角色当场选择；平行剪辑只能作为次选。

输出必须给 `cut_candidates`、`folding_candidates`、`hook_upgrade_plan`、`emotion_curve`、`relationship_visibility_gaps` 和 `locked_items_not_changed`。

## Pitch / 对标 / 改编边界

- Pitch 只使用已确认项目事实；市场判断、投放判断和对标推断必须标为假设。
- 对标 OCR 是 `benchmark_reference`，只能用于结构、节奏、镜头和钩子学习，不得当成项目真源。
- 授权改编必须记录原作/原素材、授权状态、源文到短剧的改编映射、保留项、改动项、排除项和相似性风险。
- 项目已有 EP1-10/Pitch + EP11-45 集纲时，先做段落覆盖和断点衔接，不要重写已存在部分。

## 使用顺序

1. 检查知识库：如果用户给了新 SOP、案例、提示词或 Skill，用 Harness 的 `knowledge:add` 登记；DOCX 先提取为文本。需要核验检索时运行 `knowledge:query`。
2. 确定项目：已有项目读取工作区 `projects/<project-id>/truth.json`；没有则用 `project:create` 创建骨架，并要求用户确认真源、锁定项、目标市场与授权状态后再写正文。
3. 装配上下文：运行 Harness 的 `context --project <project-id> --workflow <workflow-id> --task "<task>"`。它必须返回 `ready_for_model`，否则先处理阻塞项。
4. 输出时列出：当前真源、锁定项、使用的 RAG 来源、待确认事实、变更日志草案（如涉及修改）。
5. 由当前 Codex 任务基于上下文包生成结果；不得另索要模型 API 密钥，也不得把任何密钥写到项目 JSON 或聊天中。

## 专项路由

- Drive 文件夹、重复副本、当前头、分段稿和版本冲突：`$drama-project-version-graph`。
- 初稿、修订稿、定稿、逐行删改、阶段变化报告：`$drama-draft-comparison`。
- “太拖、不够爽、钩子弱、中段平、付费点不强、删减提速”：`$drama-hook-pacing-polish`。
- 客户批注、红线、聊天意见和多版本落地：`$drama-client-notes`。
- 集纲、任务卡、剧本与交付格式：`$drama-format-spec`。
- 当前头版本洁版与交付包：`$drama-delivery-pack`。
- 双语翻译、术语锁和增量合并：`$drama-bilingual-localization`。
- Pitch、市场风格、卖点、对标表达：`$drama-pitch-market-style`。
- 小说/原作/客户 IP 改编：`$drama-authorized-adaptation`。
- 对标 OCR、参考剧分镜、平台结构提炼：`$drama-benchmark-ocr-analysis`。
- 角色、场景、道具和风格资产：`$drama-visual-consistency`。
- 封板剧本拆镜：`$drama-storyboard`，先完成视觉资产。
- 平台或生成模型风险审查：`$drama-compliance-review`，必须使用当前规则包。

当用户要“整体优化这个项目”时，Producer 先做任务编排：Pitch 归 Pitch，hook/pacing 归节奏评估，story continuity 归连续性审查，本地化归本地化，交付归交付封装。不得把这些结果混成一个不可审计的大段建议。

## 输出要求

- 世界观/立项：项目定位、受众、市场、logline、角色弧、风险与待确认项。
- 集纲/剧本：任务卡先于正文；任务卡必须明确情节点、关系推进、情绪、奇观、爽点/虐点、hook、锁定项与前后集衔接。
- 本地化：先读取 Project Bible 的世界观、时代与技术条件，再提交自然化版本、文化替换清单和屏幕文字台账；短信、聊天、来电显示、通知、社媒、邮件、信件及剧情相关 UI 均不得漏译，不能把中文古语腔直译成英文。
- Pitch：只使用已确认项目事实；把市场与发行假设标为假设，不能伪装成已验证数据。
- 修订：每项提案写明证据、影响集数、明确不改内容、回归审稿范围与批准状态。
