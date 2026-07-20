---
name: drama-bilingual-localization
description: >-
  Produce and revise bilingual short-drama deliverables with a locked source,
  target-market profile, Project Bible and worldbuilding constraints, client
  format profile, termbase, character-voice review, on-screen text localization,
  and incremental translation merge. Use for script translation, bilingual DOCX
  files, SMS/chat/phone-screen/UI text, localization QA, terminology consistency,
  cultural adaptation, or revised-source merge work.
---

# 双语本地化

先锁定源文、市场、世界观、格式和术语，再翻译。翻译轮不得顺手修复中文母版。

## 真源顺序与阻塞条件

按以下优先级装配本地化上下文：

1. 当前项目 `Project Bible`、时代、地点、角色、锁定项和批准决定。
2. 当前封板源文、客户格式样例、项目术语表和项目私有偏好。
3. 项目采用的世界观资料与类型规则。
4. 团队起始建议和通用语言常识。

高优先级可以覆盖低优先级。缺少目标语言、封板源版本、时代/地点或交付格式时，先列为阻塞项；不得用团队默认值冒充项目事实。世界观与时代约束的具体接法见 [references/worldbuilding-localization-bridge.md](references/worldbuilding-localization-bridge.md)。

## 前置配置

1. 确认封板源版本和不可改项。
2. 读取项目世界观、时代、地理、超自然/组织规则、角色声音与技术条件；建立“允许/禁用通信渠道”清单。
3. 建立目标市场与受众配置；没有证据时不得把某一地区或人群当默认事实。
4. 从客户样例建立活动配置：哪些元素翻译、插入位置、字体样式、字幕和 OS/VO 处理。
5. 建立术语表：`source | target | usage | forbidden | source_evidence | locked`。
6. 扫描全文并建立屏幕文字台账，至少覆盖短信、聊天气泡、群聊、私信、联系人/来电显示、未读/未接、语音消息标签、通知、社媒正文/评论、邮件、信件、合同、新闻标题、招牌和剧情相关 UI。

团队起始建议见 [references/default-localization-profile.md](references/default-localization-profile.md)，只能被当作建议。复制并填写 [assets/localization-activity-config.yaml](assets/localization-activity-config.yaml)、[assets/termbase.csv](assets/termbase.csv) 和 [assets/screen-text-ledger.csv](assets/screen-text-ledger.csv)，不得直接覆盖模板。

## 翻译与复核

- 保留信息、情绪功能、角色声音、节奏和口型约束，不做逐词映射。
- 对文化替换、称谓和类型惯例给出证据或标注待查证。
- 把剧情可读的屏幕文字视为正文，不得因为它位于动作行、画面说明或道具上而漏译；完整规则见 [references/on-screen-text-localization.md](references/on-screen-text-localization.md)。
- 区分视觉屏幕文字（OS）与角色朗读/画外音（VO）。两者同时出现时分别记录，检查是否有意重复；不得擅自删掉剧情信息。
- 保留短信的发送者、接收者、时间、已读状态、气泡顺序、换行、表情和删除/发送失败状态；在画面空间内自然缩写，不牺牲关键信息。
- 先检查“角色会不会通过这个渠道说这句话”，再润色语气。年代不支持的设备、世界观禁用的渠道或违背身份的表达必须标为冲突，不得静默合理化。
- 运行角色 OOC、自然度、术语一致性、长度和格式复核。
- 签名台词的译法经批准后进入项目锁定项。

## 增量合并

客户更新源文时，对比旧源、新源和当前双语稿；同时对比对白与屏幕文字台账，只重译真实变更行，保留未变译文。输出新增、修改、删除、保留行数以及无法自动对齐的条目。新增短信或 UI 文案不能因未出现在对白列而被判定为“无变化”。

## 输出

输出双语文件、活动配置、术语表增量、屏幕文字台账、世界观/时代冲突清单、存疑清单、质量复核和源文到译文的对账记录。质量复核可使用 [assets/localization-qa-report.md](assets/localization-qa-report.md)。客户格式偏好默认属于项目私有知识。
