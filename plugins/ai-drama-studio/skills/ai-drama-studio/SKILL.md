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

## 定位工作区

按顺序定位运行时工作区：

1. 使用环境变量 `AI_DRAMA_STUDIO_HOME` 指向的目录。
2. 当前目录的 `package.json` 若 `name=ai-drama-studio`，使用当前目录。
3. 当前项目下存在 `ai-drama-studio/package.json` 时，使用该子目录。
4. 仍未找到时，告知用户插件已安装但团队运行时尚未初始化；请用户选择工作区。不得假设开发者用户名、桌面路径或绝对路径。

进入工作区后，首次使用运行 `pnpm team:init -- <organization-id> <user-id> <member|admin>`。团队中央服务接入后，以服务端身份和权限为准，不信任客户端自报管理员。

## 真源与权限

1. 把项目真源、锁定项、当前头版本和批准状态置于任何 RAG 结果之上。
2. 只对 `rights_status=authorized` 的项目做原稿改编。
3. 把客户原文、IP 细节、商业信息和客户偏好限制在对应项目。
4. 把 RAG 当作带来源的参考层，不得让过期、未批准或跨项目材料覆盖真源。

## 创作工作流

支持立项/世界观、梗概、季纲/分集卡、单集剧本、钩子、授权改编、本地化、翻译/自然化、Pitch、反馈修订。

1. 运行 `pnpm rag:verify`；新知识用 `pnpm rag:add` 登记并执行 `pnpm rag:index`。
2. 确认项目 ID、真源、锁定项、目标市场和授权状态。
3. 运行 `pnpm agent:context -- --project <project-id> <workflow-id> "<task>"`。
4. 只有结果为 `ready_for_model` 才进入创作。
5. 剧本前先产出任务卡；Pitch 只使用确认事实；翻译必须自然化；修订提案列出证据、影响范围、不改项和批准状态。

## 专项能力路由

根据任务调用插件内专项 Skill：客户意见用 `$drama-client-notes`；格式用 `$drama-format-spec`；交付用 `$drama-delivery-pack`；双语用 `$drama-bilingual-localization`；视觉资产用 `$drama-visual-consistency`；分镜用 `$drama-storyboard`；合规用 `$drama-compliance-review`。专项规则不得覆盖项目真源、锁定项或客户活动配置。

## 团队迭代学习

遇到原稿、草稿、批注、红线、修改稿、提交稿、采用稿、Pitch、世界观、翻译、本地化、研究、SOP、运营结果或其他材料时，读取 `agent/iteration-learning-contract.md`：

1. 运行 `pnpm artifacts:import -- <folder> [project-id|auto] [client-id]`。
2. 运行 `pnpm artifacts:analyze -- [project-id|all]`。
3. 把学习严格分成项目私有、可泛化候选、不确定待确认。
4. 按 `agent/learning-candidate-schema.json` 写候选，并运行 `pnpm learning:submit -- <candidate.json>`。
5. 只有存在候选时才运行 `pnpm learning:review` 向用户显示审批卡；普通任务不要询问学习。
6. 用户明确决定后运行 `pnpm learning:decide`。沉默和模糊肯定都不是批准。
7. member 可批准项目私有规则或提交共享审核；只有 admin 可发布共享规则。
8. 共享发布必须匿名化、具有跨项目证据、检查反例并保留回滚点；不得自动覆盖正式 Skill。阈值、客户格式、术语、角色资产、参考图和平台特例默认不是通用规则。
9. 已配置中央团队库时，让成员在制片台“学习审批”页登录并上传候选 JSON；管理员在同一页查看证据摘要、退回、驳回、批准或发布。不得把 Supabase secret/service key 放入插件或浏览器。

## 输出契约

列出真源、锁定项、RAG 来源、已批准学习规则和待确认事实。涉及修改时附变更日志；涉及学习时附证据、适用范围、反例、置信度和状态。
