---
name: drama-format-spec
description: >-
  Define, apply, and validate project-specific formats for AI comic-drama
  synopses, episode outlines, task cards, scripts, bilingual files, and client
  deliveries. Use when writing or checking document structure, reformatting a
  draft, comparing against a client sample, or diagnosing format rejection.
---

# 漫剧格式规范

格式规则必须可追溯、可覆盖、可机检；不得把单个客户的习惯固化为全局铁律。

## 规则优先级

1. 当前交付的客户样例或明确书面要求。
2. 已批准的项目格式配置。
3. 目标平台的已验证配置。
4. 团队默认建议，见 [references/default-profile.md](references/default-profile.md)。

缺少前三级时，使用默认建议并明确标记为假设，不声称是客户要求。

## 格式配置

先形成配置表：`artifact_type | rule | value | source | scope | required | approved_at`。至少覆盖标题、场次头、动作行、对白、OS/VO、字幕、集末钩子、字数/时长、场景数、文件格式、文件名和修订痕迹策略。

## 执行方式

- 重排任务只改格式，不改内容；发现内容问题单列。
- 校验报告定位到文件、集、场和原文，不使用“部分格式有问题”之类模糊结论。
- 阈值型规则同时报告实测值、目标值、来源和严重度。
- DOCX 交付使用文档工具检查批注、修订、样式和兼容性。
- 只有实际运行过检查并复核结果后，才能声明通过。

## DOCX / 双语 / 红线细则

- 带 tracked changes 的文件先确认接受/保留/另存策略；接受修订后必须复查重复文本、残片、异常空格和标点。
- 双语稿要按活动配置检查：目标语是否紧跟源语、是否错误翻译动作行/SFX/场景头、已有英文是否被重复翻译。
- 红字、批注、删除线和客户标色是证据层，不是装饰；格式清理不得抹掉未确认的审稿信息。
- WPS/Word 兼容性要在成品副本上复检。
- 剧本、集纲、梗概、术语表和交付说明要同轮更新；任何只改剧本不改梗概/集纲的任务都要标版本错位风险。

## 输出

输出活动格式配置、违规清单、无法自动判断的条目、建议修复和仅格式变更日志。未经批准的客户特例只写入项目配置，不进入共享 Skill。
