---
name: drama-client-notes
description: >-
  Convert client, platform, editor, or customer-service revision feedback into an
  auditable short-drama revision ledger and approved execution plan. Use for
  comments, tracked changes, redlines, highlighted DOCX files, chat feedback,
  draft-versus-final comparisons, or requests to apply and verify revision notes.
---

# 客户意见落地

把外部反馈当作带身份、来源和效力的增量证据，不把它直接等同于改稿命令。

硬边界：客户批注、聊天意见、红线和修改痕迹不得直接写回 `Project Bible`、当前头版本、锁定项或共享 Skill。所有写回都必须经过“证据登记 → 效力判断 → 修订提案 → 人工批准 → 执行核验”。

## 工作流

1. 确认项目、当前头版本、客户所用底稿、反馈来源、作者身份和时间。
2. 用 `$ai-drama-studio` 内置 Harness 的 `artifact:record` 分别登记原稿、客户批注、修改稿、提交稿和采用结果，并用 `version-of` 保存谱系。DOCX 使用文档工具提取批注、修订和正文；原文件与全文只留本地。
3. 对比客户底稿、客户修改版和当前头版本。谱系不一致时只产出冲突表，不覆盖真源。
4. 建立意见台账，一条反馈一个稳定 ID。
5. 判断意见类型：原则型、锚点型、故事逻辑、人物动机、台词、结构/节奏、新增内容、格式/交付、同意型零改动。
6. 原则型意见必须全文扫描，主动找未被客户标出的同类违规点，并单独请示处置；不能只改批注锚点。
7. 先提交落地计划；只有用户明确批准的条目才能改正文。
8. 执行后逐条核验，并把额外发现单独列出，不顺手修改。

如果客户所用底稿、当前头版本、提交稿或采用稿不一致，输出 `blocked` 冲突表；不得为了推进任务自行选择一个版本。

DOCX 带 tracked changes 时，先确认处理策略。若接受修订会改变段落数或序号表，必须改用唯一子串/场号/角色台词锚定，不能继续沿用旧行号。接受修订后要扫描残片、重复文本、异常空格和标点。

## 意见台账

每条记录：`ID | 来源/作者 | 时间 | 文件与版本 | 集/场/行 | 原话或修订 | 证据载体 | 效力 | 建议落点 | 波及范围 | 冲突 | 状态`。

效力分类：

- `supplied_copy`：有权限的决策者明确给出成稿文字。
- `explicit_instruction`：明确要求结果，但需我方写作。
- `directional_note`：感觉或方向，先给方案，不直接改稿。
- `conflict`：与锁定项、真源或其他意见冲突，升级人工。
- `uncertain`：作者身份、效力或锚点不清，等待确认。

修订痕迹本身不证明 `supplied_copy`。必须结合修订作者、交付关系和聊天上下文判断。

## 批量确认模板

把需要人工决定的问题合并成一轮，避免每改一条就打断：

- 结构性重写：全改、只改明确锚点、还是先给方案对比。
- 本地化力度：彻底、中度、仅术语统一。
- 红字范围：只标新增/改写、改动标红加删除线、还是全部标红另附清单。
- 未标注风险：发现提前泄露、逻辑冲突、术语漂移时，给 2-3 个可执行选项。

## 执行与验收

- 只修改已批准 ID 覆盖的位置。
- 一条意见对应一条变更日志。
- 输出逐条指认表：`ID | 原意见 | 落点 | 修改后原文 | implemented/partly/not_implemented/escalated | 证据`。
- 客户钦点台词只有在确认效力后才能进入项目锁定项。
- 批注、聊天和客户偏好默认属于项目私有知识。

## 团队学习

把结果分为项目私有偏好、可泛化候选和不确定推断。只有匿名化、跨项目证据充分、检查过反例并经管理员批准的规则，才能进入共享 Skill；不得因单个客户的一次意见自动更新总 Agent。

## Eval 钩子

- no writeback：未批准意见不能进入 Project Bible/current head/locks。
- version conflict：底稿、修改稿、交付稿冲突时必须阻塞。
- evidence coverage：每条采用/拒绝都要有文件、版本、位置和状态。
- principle scan：原则型批注必须扫描全文并列出未标注同类风险。
- tracked changes hygiene：接受修订后必须清理重复文本、残片和锚点失效。
