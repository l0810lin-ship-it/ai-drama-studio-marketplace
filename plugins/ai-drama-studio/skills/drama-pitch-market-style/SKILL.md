---
name: drama-pitch-market-style
description: >-
  Build and review pitch packs, market-facing story positioning, genre style,
  comparable-title reasoning, audience assumptions, and release hypotheses for
  AI comic dramas. Use for pitch documents, one-card concepts, first-episodes
  packages, market style, and benchmark-informed but evidence-labeled selling points.
---

# Pitch 与市场风格

Pitch 是对外表达，不是自由编数据。只使用已确认项目事实；市场、平台、投放和受众判断必须标为假设或引用来源。

## 输入

读取：

- `project_catalog`: 剧名、男女频、题材、集数、简介、一卡梗概、卡点、对标剧。
- `project_artifact`: Pitch、前十集、一卡剧本、集纲、人物世界观、当前头版本。
- `market_or_worldbuilding_reference`: 海外短剧研究、平台风格、类型世界观。
- `benchmark_reference`: 对标 OCR 分析输出。

缺少项目事实时输出待确认，不编造。

## Pitch 结构

输出至少包含：

- logline
- audience and genre lane
- core relationship engine
- first paid hook
- episode range / package scope
- character promise
- spectacle or worldbuilding promise
- comparable-title reasoning
- market assumptions
- production risks
- facts vs assumptions table

## 事实/假设边界

必须标注：

- confirmed_fact：来自 Project Bible、Sheet、当前头、批准材料。
- source_backed_reference：来自市场研究、对标 OCR、公开资料或已审核方法论。
- assumption：基于经验的市场/投放判断。
- tbd：缺资料，待确认。

不得把“适合北美”“容易投放”“平台会喜欢”写成事实，除非有具体证据。

## 对标使用

对标用于解释类型位置、钩子机制、节奏和受众预期，不复制剧情。对标 OCR 结论应先由 `$drama-benchmark-ocr-analysis` 抽象化。

## 输出

输出：

- `pitch_pack`
- `fact_assumption_table`
- `comparable_reasoning`
- `market_style_notes`
- `risk_and_tbd`
- `approved_sources`

对外版本必须先经人工审阅。

## Eval 钩子

- fact discipline: confirmed fact and assumption must be separated.
- benchmark boundary: 对标不能变成项目真源。
- source coverage: 市场判断要有来源或标假设。
- no overclaim: 不承诺平台表现、收入或过审。
