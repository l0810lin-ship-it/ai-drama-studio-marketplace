---
name: drama-storyboard
description: >-
  Convert a locked AI comic-drama script into a production-ready shot list linked
  to versioned visual assets and the selected generation workflow. Use for
  storyboards, shot breakdowns, image or video prompts, timing plans, lip-sync
  notes, production feasibility review, and hook-frame design.
---

# 漫剧分镜

分镜只把封板内容翻译成镜头，不在这一轮偷偷改戏或台词。

## 前置闸门

- 剧本已经封板，当前版本和目标时长明确。
- 已有视觉资产圣经；缺少时先调用 `drama-visual-consistency`。
- 已确认生成模型、画幅、可用时长、口型和镜头限制。

默认约束候选见 [references/default-generation-constraints.md](references/default-generation-constraints.md)。必须按实际工具和测试结果覆盖。

## 工作流

1. 逐场拆分动作、反应、信息和钩子，不改变原台词。
2. 建表：`shot_id | source_scene | duration | framing | camera | visual_action | asset_ids | generation_prompt | dialogue | lip_sync | audio | continuity | risk`。
3. 按目标模型扫描多人交互、手部、文字、倒影、换装、复杂运镜等失败风险；每项给替代拍法。
4. 核算总时长、镜头节奏和每集钩子最后一帧。
5. 对分镜台词与封板剧本做逐字对比，对资产 ID 做引用完整性检查。

## 对标 OCR 边界

对标 OCR、参考剧分镜和平台热剧拆解是 `benchmark_reference`，不是项目真源：

- 记录来源、时长范围、覆盖区间、是否完整版、是否与其他 OCR 分段重叠。
- 只能提取结构、镜头节奏、卡点和情绪机制；不得复制具体台词、角色设定或未授权剧情。
- 多份同一对标 OCR 并存时，先做 coverage/overlap 检查，再选用最完整或最适合任务的版本。
- 参考剧结论必须转成抽象原则，再回到当前 Project Bible 和封板剧本验证。

## 输出

输出分镜表、风险及替代方案、关键帧清单、时长核算、台词差异、资产缺口和需人工确认项。生成平台特有经验写入版本化平台配置，不直接写成全局铁律。
