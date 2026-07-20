---
name: drama-benchmark-ocr-analysis
description: >-
  Analyze benchmark drama OCR, reference scripts, and storyboard captures for
  structure, hook rhythm, paid-point mechanics, scene density, and visual pacing
  without copying source plots or treating benchmarks as project truth. Use for
  reference OCR files, comparison dramas, and platform style extraction.
---

# 对标 OCR 分析

对标 OCR 是参考，不是项目真源。它只能产出抽象结构、节奏、镜头和卡点规律，不能复制角色、台词、具体桥段或未授权剧情。

## 输入

登记：

- 对标标题和来源。
- 文件类型：Markdown、DOCX、PDF、截图 OCR、分镜表。
- 覆盖范围：起止分钟、起止集、是否完整版。
- 是否与同项目其他 OCR 文件重叠。
- 使用目的：结构、节奏、投放卖点、分镜、平台风格。

## Coverage / Overlap

多份同一对标并存时，先建表：

`benchmark_id | title | range | completeness | overlaps | best_use | risk`

如果一个是 0-3 分钟、一个是 12-18 分钟、一个是 0-18 分钟完整版，默认优先完整版；分段文件只用于补洞或核对。

## 可提取内容

- 开场冲突如何进入。
- 第一个付费点放在什么不可逆代价上。
- 每集/每段钩子类型。
- 情绪翻面频率。
- 角色同框对撞方式。
- 镜头密度、场景切换、字幕/屏幕文字处理。
- 适合目标平台的结构抽象。

## 不可提取内容

- 具体台词。
- 角色姓名和专属设定。
- 未授权剧情桥段。
- 可识别 IP 细节。
- 未经确认的市场数据。

## 输出

输出：

- `coverage_table`
- `structure_map`
- `hook_rhythm`
- `paywall_mechanics`
- `shot_style_notes`
- `abstracted_rules`
- `do_not_copy`
- `how_to_apply_to_current_project`

所有应用建议必须回到当前 Project Bible、当前头版本和锁定项验证。

## Eval 钩子

- no copying: 不能复述或改写成可识别的对标剧情。
- coverage first: 未说明 OCR 覆盖范围前不能下结论。
- truth boundary: 对标规律不能覆盖项目真源。
