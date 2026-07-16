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

## 工作流

1. 确认项目、当前头版本、客户所用底稿、反馈来源、作者身份和时间。
2. 有团队运行时时，先运行 `pnpm artifacts:import -- <folder> [project-id|auto] [client-id]`，再运行 `pnpm artifacts:analyze -- [project-id|all]`。复用现有 DOCX 批注、修订和版本解析结果，不另写临时伪代码。
3. 对比客户底稿、客户修改版和当前头版本。谱系不一致时只产出冲突表，不覆盖真源。
4. 建立意见台账，一条反馈一个稳定 ID。
5. 先提交落地计划；只有用户明确批准的条目才能改正文。
6. 执行后逐条核验，并把额外发现单独列出，不顺手修改。

## 意见台账

每条记录：`ID | 来源/作者 | 时间 | 文件与版本 | 集/场/行 | 原话或修订 | 证据载体 | 效力 | 建议落点 | 波及范围 | 冲突 | 状态`。

效力分类：

- `supplied_copy`：有权限的决策者明确给出成稿文字。
- `explicit_instruction`：明确要求结果，但需我方写作。
- `directional_note`：感觉或方向，先给方案，不直接改稿。
- `conflict`：与锁定项、真源或其他意见冲突，升级人工。
- `uncertain`：作者身份、效力或锚点不清，等待确认。

修订痕迹本身不证明 `supplied_copy`。必须结合修订作者、交付关系和聊天上下文判断。

## 执行与验收

- 只修改已批准 ID 覆盖的位置。
- 一条意见对应一条变更日志。
- 输出逐条指认表：`ID | 原意见 | 落点 | 修改后原文 | implemented/partly/not_implemented/escalated | 证据`。
- 客户钦点台词只有在确认效力后才能进入项目锁定项。
- 批注、聊天和客户偏好默认属于项目私有知识。

## 团队学习

把结果分为项目私有偏好、可泛化候选和不确定推断。只有匿名化、跨项目证据充分、检查过反例并经管理员批准的规则，才能进入共享 Skill；不得因单个客户的一次意见自动更新总 Agent。

