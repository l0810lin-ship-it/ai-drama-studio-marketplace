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

## 使用顺序

1. 检查知识库：如果用户给了新 SOP、案例、提示词或 Skill，用 Harness 的 `knowledge:add` 登记；DOCX 先提取为文本。需要核验检索时运行 `knowledge:query`。
2. 确定项目：已有项目读取工作区 `projects/<project-id>/truth.json`；没有则用 `project:create` 创建骨架，并要求用户确认真源、锁定项、目标市场与授权状态后再写正文。
3. 装配上下文：运行 Harness 的 `context --project <project-id> --workflow <workflow-id> --task "<task>"`。它必须返回 `ready_for_model`，否则先处理阻塞项。
4. 输出时列出：当前真源、锁定项、使用的 RAG 来源、待确认事实、变更日志草案（如涉及修改）。
5. 由当前 Codex 任务基于上下文包生成结果；不得另索要模型 API 密钥，也不得把任何密钥写到项目 JSON 或聊天中。

## 专项路由

- 客户批注、红线、聊天意见和多版本落地：`$drama-client-notes`。
- 集纲、任务卡、剧本与交付格式：`$drama-format-spec`。
- 当前头版本洁版与交付包：`$drama-delivery-pack`。
- 双语翻译、术语锁和增量合并：`$drama-bilingual-localization`。
- 角色、场景、道具和风格资产：`$drama-visual-consistency`。
- 封板剧本拆镜：`$drama-storyboard`，先完成视觉资产。
- 平台或生成模型风险审查：`$drama-compliance-review`，必须使用当前规则包。

## 输出要求

- 世界观/立项：项目定位、受众、市场、logline、角色弧、风险与待确认项。
- 集纲/剧本：任务卡先于正文；任务卡必须明确情节点、关系推进、情绪、奇观、爽点/虐点、hook、锁定项与前后集衔接。
- 本地化：先读取 Project Bible 的世界观、时代与技术条件，再提交自然化版本、文化替换清单和屏幕文字台账；短信、聊天、来电显示、通知、社媒、邮件、信件及剧情相关 UI 均不得漏译，不能把中文古语腔直译成英文。
- Pitch：只使用已确认项目事实；把市场与发行假设标为假设，不能伪装成已验证数据。
- 修订：每项提案写明证据、影响集数、明确不改内容、回归审稿范围与批准状态。
