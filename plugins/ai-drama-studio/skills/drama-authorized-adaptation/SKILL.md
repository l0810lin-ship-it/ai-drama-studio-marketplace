---
name: drama-authorized-adaptation
description: >-
  Plan and review authorized short-drama adaptations from novels, original
  stories, source manuscripts, or client-provided IP. Use for source-to-script
  mapping, rights gates, adaptation scope, similarity risk, exclusion lists, and
  delivery packages that include source material.
---

# 授权改编

改编不是“照着原作写短剧”。先确认授权和边界，再把源素材转成短剧结构。没有授权时，只能做高层结构分析或原创替代方案。

## 权限闸门

必须确认：

- `rights_status=authorized`
- 授权范围：可改编、可翻译、可商用、可二创、可投放地区。
- 原作/源素材版本。
- 禁止使用或必须隐藏的 IP 细节。
- 客户要求的保留项和可改项。

缺少授权状态时输出 `blocked`。

## 源到短剧映射

建立表：

`source_unit | source_summary | adaptation_episode | kept | changed | dropped | reason | risk | evidence`

重点处理：

- 长篇现实/年代/小说素材压缩成短剧高频冲突。
- 原作人物合并、动机外化、冲突人格化。
- 原作慢铺垫改为短剧强开场。
- 付费点和集尾反转重建。
- 原作细节排除清单，避免泄露不该使用的内容。

## 相似性与合规

输出相似性风险：

- 角色关系过近。
- 标志桥段过近。
- 台词/场景可识别。
- 原作核心设定未获授权。
- 平台或地区合规风险。

需要时调用 `$drama-compliance-review`。

## 输出

输出：

- `rights_gate`
- `source_inventory`
- `source_to_episode_map`
- `adaptation_strategy`
- `kept_changed_dropped`
- `similarity_risk`
- `excluded_source_detail`
- `approval_questions`

不得把未授权原文、客户原始素材或项目私有 IP 细节写入共享 Skill。

## Eval 钩子

- rights gate: 未授权必须阻塞。
- mapping evidence: 改编方案必须有源素材映射。
- no source leakage: 排除项不能出现在输出正文。
- similarity risk: 高相似桥段必须标风险或替代。
