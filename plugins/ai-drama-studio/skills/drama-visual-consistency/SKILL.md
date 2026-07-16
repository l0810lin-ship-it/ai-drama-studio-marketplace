---
name: drama-visual-consistency
description: >-
  Build and enforce a versioned visual asset bible for AI comic dramas, covering
  character identity, appearance variants, locations, props, motifs, style locks,
  negative constraints, and reference images. Use before batch image or video
  generation and when diagnosing inconsistent characters or visual drift.
---

# 视觉一致性

把反复使用的视觉描述变成版本化资产，而不是每个镜头重新编写。

## 资产结构

- 角色：稳定 ID、外观特征、参考图、状态变体、禁写项、生效集数。
- 场景：地点、时段、光源、材质、构图基准和参考图。
- 道具与符号：外观、叙事功能、连续性约束和伏笔回收。
- 风格：模型/流程版本、提示词锁、负面约束、色彩和镜头基准。
- 视觉母题：触发条件、代价、允许集数和升级路线。

## 纪律

1. 修改资产必须升版本并声明生效范围，不原地覆盖已使用版本。
2. 分镜和生成任务引用资产 ID；允许按目标模型生成适配表达，但必须能追溯到同一语义资产。
3. 特征数量、提示词形式和负面词由生成模型配置决定，不设全局固定数字。
4. 批量生成前跨集、跨状态抽样；记录通过标准和失败模式。
5. 只有跨项目复现的生成规律才能成为共享候选；角色外观、客户风格和参考图始终项目私有。

## 输出

输出角色、场景、道具、风格和视觉母题资产表，以及版本变更记录、抽样验证结果和待确认项。

