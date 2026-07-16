---
name: drama-compliance-review
description: >-
  Review AI comic-drama scripts, storyboards, prompts, and delivery text against
  a named, versioned platform and market policy profile. Use for content-risk
  assessment, generation refusals, platform review preparation, or compliance
  QA involving violence, intimacy, minors, self-harm, real persons, brands, or
  sensitive events.
---

# 平台合规审查

合规是带时间、平台、地区和内容形态的判断，不是通用敏感词替换。

## 前置条件

1. 确认目标平台、地区、内容形态、生成模型和政策生效日期。
2. 优先读取官方、当前政策；无法验证时标记 `policy_unverified`，不得承诺可过审。
3. 使用版本化规则包，结构见 [references/policy-profile-schema.md](references/policy-profile-schema.md)。

## 审查

- 逐条记录位置、原文、风险类别、政策依据、置信度和建议处理。
- 区分词语层、画面层、情节结构层和法律/权利层风险。
- 未成年、非自愿亲密、自伤方法、真实人物和重大现实事件默认升级人工。
- 不做静默全局替换；每个修改必须保留原文、理由和对戏剧功能的影响。
- 修改后重新检查冲突强度、角色逻辑、连续性和生成可行性。

## 输出

输出风险台账、政策来源与日期、建议方案、需人工决定项和残余风险。平台规则更新属于 RAG/规则包更新；只有稳定的审查流程可以进入共享 Skill。

