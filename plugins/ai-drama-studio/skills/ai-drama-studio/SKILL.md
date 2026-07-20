---
name: ai-drama-studio
description: >-
  Agent entrypoint for AI comic-drama production and team learning. Use for world
  bibles, synopsis, season outlines, scripts, hooks, authorized adaptation,
  localization, translation, pitch packs, customer-feedback revision, or when
  importing and learning from drafts, comments, revisions, deliveries, outcomes,
  SOPs, research, and other project artifacts.
---

# AI 漫剧制片与团队学习

## 初始化 Harness

本 Skill 自带 `scripts/studio.mjs`，不得依赖开发者电脑上的另一个项目目录。首次触发时运行：

`node <本 Skill 目录>/scripts/studio.mjs init`

默认工作区为 `AI_DRAMA_STUDIO_HOME`，未设置时使用用户目录下的 `.codex/ai-drama-studio/workspace`。需要了解文件、权限和中央记忆边界时读取 `references/runtime-contract.md`。不要把客户文件复制进插件缓存。

## 真源与权限

1. 把项目真源、锁定项、当前头版本和批准状态置于任何 RAG 结果之上。
2. 只对 `rights_status=authorized` 的项目做原稿改编。
3. 把客户原文、IP 细节、商业信息和客户偏好限制在对应项目。
4. 把 RAG 当作带来源的参考层，不得让过期、未批准或跨项目材料覆盖真源。

## 连接数据源与分层

当工作区存在 Google Sheet/Drive 同步层时，先运行或读取同步结果，而不是直接把资料塞进 RAG：

1. 手动同步命令是 `pnpm drive:sync`；只检查访问与变更时用 `pnpm drive:sync -- --dry-run`。
2. Sheet 剧单是 `project_catalog`，用于判断项目、题材、集数、简介、卡点、链接和对标剧。
3. Drive 剧本、集纲、Pitch、本地化稿、交付稿和客户批注是 `project_artifact`，只能作为项目私有证据或版本谱系。
4. 通用 Skill、SOP、方法论和提示词是 `method_or_skill_source`，审核后才可进入普通 RAG。
5. 海外短剧研究和类型世界观资料是 `market_or_worldbuilding_reference`，必须标注适用题材、来源状态和不确定项。
6. 文件必须登记项目归属、文件类型、版本角色、题材系统、工作流映射、可学习/不可学习状态。冲突时阻塞，不由模型自行选择。

如果用户要求“根据 Drive 真实文件迭代 Skill”，必须递归浏览项目文件夹，而不是只看根目录或 Sheet。真实项目文件夹通常包含原稿、当前稿、修改稿、客户批注稿、本地化稿、交付稿、对标 OCR、复盘报告、重复副本和分段文件；这些材料要先变成版本图和证据摘要，再沉淀为通用 Skill 规则。客户剧本全文仍不得写入共享 Skill。

## 创作工作流

支持立项/世界观、梗概、季纲/分集卡、单集剧本、钩子、授权改编、本地化、翻译/自然化、Pitch、反馈修订。

1. 确认项目 ID、真源、锁定项、目标市场和授权状态；没有项目时运行 `studio.mjs project:create`。
2. 用 `studio.mjs artifact:record` 登记原稿、草稿、批注、修改稿、提交稿和结果；只保存本地路径与版本关系。
3. 运行 `studio.mjs context --project <project-id> --workflow <workflow-id> --task "<task>"`。它会在已登录时先同步人工发布的共享记忆。
4. 只有结果为 `ready_for_model` 才进入创作。
5. 剧本前先产出任务卡；Pitch 只使用确认事实；翻译必须自然化；修订提案列出证据、影响范围、不改项和批准状态。

## 专项能力路由

根据任务调用插件内专项 Skill：版本谱系用 `$drama-project-version-graph`；初稿定稿对照用 `$drama-draft-comparison`；钩子节奏精修用 `$drama-hook-pacing-polish`；客户意见用 `$drama-client-notes`；格式用 `$drama-format-spec`；交付用 `$drama-delivery-pack`；双语用 `$drama-bilingual-localization`；Pitch 和市场风格用 `$drama-pitch-market-style`；授权改编用 `$drama-authorized-adaptation`；对标 OCR 用 `$drama-benchmark-ocr-analysis`；视觉资产用 `$drama-visual-consistency`；分镜用 `$drama-storyboard`；合规用 `$drama-compliance-review`。专项规则不得覆盖项目真源、锁定项或客户活动配置。

如果任务同时涉及 Pitch、hook/pacing、story continuity、authorized adaptation、market-style 或 Project Bible 维护，先在主 Skill 输出任务拆分建议；不要让 Producer Skill 一次性吞掉所有工作流而失去版本、权限和审批边界。涉及真实 Drive 文件时，先跑版本谱系和必要的对照/OCR 分析，再进入写作或修订。

## 团队迭代学习

遇到原稿、草稿、批注、红线、修改稿、提交稿、采用稿、Pitch、世界观、翻译、本地化、研究、SOP、运营结果或其他材料时，读取 `references/runtime-contract.md` 和 `references/learning-candidate-schema.json`：

1. 用 `studio.mjs artifact:record` 登记材料角色、项目和版本关系；原文件保持本地。
2. 对原稿、批注、修改稿和采用结果做差异分析，并保留证据 ID。
3. 把学习严格分成项目私有、可泛化候选、不确定待确认。
4. 按 `references/learning-candidate-schema.json` 写候选 JSON，并运行 `studio.mjs learning:add --file <candidate.json>`。项目私有候选只留本地；匿名化共享候选在已登录时自动进入中央待审库。
5. 只有存在候选时才展示审批卡；普通任务不要询问学习。
6. 用户明确批准项目私有候选后运行 `studio.mjs learning:approve-private --id <id>`。管理员查看中央候选用 `learning:review`，决定用 `learning:decide`。沉默和模糊肯定都不是批准。
7. member 可批准项目私有规则或提交共享审核；只有 admin 可发布共享规则。
8. 共享发布必须匿名化、具有跨项目证据、检查反例并保留回滚点；不得自动覆盖正式 Skill。阈值、客户格式、术语、角色资产、参考图和平台特例默认不是通用规则。
9. 团队登录优先运行 `team:browser-login --email <email>`，在自动打开的本机页面注册或登录；绝不要求用户把密码贴进对话。浏览器不可用时才执行 `team:signup --email <email>`/`team:login --email <email>`，由 CLI 隐藏输入密码。登录后用管理员生成的邀请码执行 `team:join`。管理员可用 `team:create-org` 和 `team:create-invite`。只使用公开 publishable key；不得放入 Supabase secret/service key。

## 输出契约

列出真源、锁定项、RAG 来源、已批准学习规则和待确认事实。涉及修改时附变更日志；涉及学习时附证据、适用范围、反例、置信度和状态。

涉及 Drive/Sheet 数据源时，额外列出使用的 registry 项、文件层级、版本角色和提取状态。项目资产待提取、版本冲突或来源权威不明时输出 `blocked` 或 `needs_human_confirmation`。
