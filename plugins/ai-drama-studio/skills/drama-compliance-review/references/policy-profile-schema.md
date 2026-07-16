# 平台规则包结构

每个规则包至少包含：

```text
platform
market
content_mode
model_or_product
effective_date
verified_at
source_url
rule_id
risk_category
rule_summary
applies_to
severity
required_action
exceptions
```

过期、来源不明或仅来自单次拒绝经验的规则不得标记为正式政策。单次生成失败可以进入候选库，但需要区分模型限制、提示词问题和平台政策。

