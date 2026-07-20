---
name: drama-hook-pacing-polish
description: >-
  Polish short-drama drafts for hook strength, paywall pacing, scene economy,
  emotional curve, relationship visibility, and cut/fold decisions. Use for
  "too slow", "not addictive enough", weak hooks, flat middle episodes,
  draft polishing, episode compression, or paid-point upgrade work.
---

# 钩子节奏精修

本 Skill 只处理从初稿/已有稿到更好看的精修，不负责从 0 生成整剧。所有建议都在 Project Bible、当前头版本、锁定项和批准状态之下执行。

## 输入

必须先确认：

1. 项目、当前头版本、集数范围和目标平台。
2. 不可改锁定项、身份揭露时机、关系进度、术语和交付格式。
3. 当前任务是删减、提速、卡点增强、中段重排、人物增强，还是付费点升级。
4. 若有初稿/定稿/对照复盘，先调用 `$drama-draft-comparison` 或读取其输出。

缺少当前头版本或锁定项时输出 `blocked`。

## 场景功能扫描

逐场建立表：`scene_id | source_range | relationship_advanced | hook_created | emotional_function | spectacle | can_cut | can_fold | lock_risk | evidence`。

每场先问：

- 是否推进“谁和谁”的关系？
- 是否制造下一集/下一场想看的钩子？
- 是否承担不可替代的信息、爽点、虐点、奇观或角色高光？

如果三项都答不上来，进入删减候选；但删减前必须检查是否触碰锁定项、伏笔或后续回收。

## Cut List

优先删减或折叠：

- 重复受难：主角被同一类人用同一种逻辑反复羞辱。
- 重复规则说明：观众已经懂的世界观又讲一遍。
- 无对手戏的纯氛围长场：只有独处、VO、心理活动，没有关系推进。
- 解释成本过高的支线：需要大量前置说明，却不能换来强爽点。
- 群像膨胀：新增配角稀释主线关系。
- 低产结构花活：平行蒙太奇、双线交叉但主 CP 不同框。

删减优先“信息折叠”，不是机械整段删除。

## 信息折叠

把背景、规则、动机和力量解释放进一个可演的强动作或在场反派：

- 背景折叠：用践踏、抢夺、摔毁、公开羞辱等动作同时交代处境和冲突。
- 阻力人格化：把制度/命运/规则变成一个角色当面刁难。
- 高光折叠：把觉醒、真相、反击焊在情绪最高点。
- 动机内因化：偏执、失控、黑化优先来自上瘾、心动、执念，而不是生病/中毒等外因。

## Hook 升级

付费点尽量同时具备：

- 不可逆代价：绑定、揭穿、生死、失去身份、失去婚约、错过救援。
- 双倒计时：生理/客观倒计时 + 剧情/规则倒计时。
- 第三方介入：二人局面升级为三方对撞。

集尾优先反转钩，不只抛悬念。输出时标注 `current_hook_type` 和 `upgraded_hook_type`。

## 情绪曲线

中段每 1-2 集翻一次情绪面：甜、虐、误会、救援、认错、克制、爆发都要由事件触发，不能只靠台词或 VO 硬转。

关系高光必须被对方看见。独处深情只能算观众信息，不能算 CP 情感账户入账。

多角关系优先同框对照：把主角夹在多方中间，让角色当场表态；平行剪辑作为次选。

## 输出

输出：

- `scene_function_table`
- `cut_candidates`
- `folding_candidates`
- `paywall_hook_upgrade`
- `episode_end_hook_audit`
- `emotion_curve`
- `relationship_visibility_gaps`
- `locked_items_not_changed`
- `revision_plan_needs_approval`

不得直接改当前头版本。所有正文改动先进入修订提案。

## Eval 钩子

- weak hook: 付费点不能只靠模糊敲门/短信/谁来了。
- flat middle: 连续两集平情绪必须提出翻面方案。
- cut safety: 删减不能破坏锁定项、伏笔和后续回收。
- relationship visibility: 深情/反差必须被关键角色目击。
