# AI 漫剧制片 Agent

这是可安装到 Codex 的 AI 漫剧制片与团队学习插件。安装后会以 **AI 漫剧制片** 智能体插件出现，而不是散落的提示词文件。

## 安装

确保已经安装并登录 Codex，然后在终端依次运行：

```bash
codex plugin marketplace add l0810lin-ship-it/ai-drama-studio-marketplace --ref main
codex plugin add ai-drama-studio@ai-drama-team
```

完成后重新打开 Codex，并新建一个任务。在输入框的 `+` 菜单中选择 **AI 漫剧制片**，或者直接描述剧本、集纲、客户修改、翻译、分镜、交付等任务。

首次使用直接对它说：`初始化 AI 漫剧工作室`。插件自带 Harness，会在当前用户目录创建独立工作区，不需要另外下载运行时项目。

如果电脑里曾使用过旧的独立 `ai-drama-studio` 运行时，可让 Agent 执行一次 `migrate:legacy`。迁移只复制项目真源、私有审批、候选、版本谱系和本地 RAG，旧目录保持不动，也不会上传客户文件。

团队成员需要共享学习候选时，对 Agent 说“登录团队记忆”。Agent 会打开本机登录页，密码不会进入 Codex 对话；登录后再输入管理员生成的一次性邀请码。原稿、客户文件和项目私有偏好只保存在成员电脑；中央库只接收匿名化学习候选。

## 更新

```bash
codex plugin marketplace upgrade ai-drama-team
codex plugin add ai-drama-studio@ai-drama-team
```

更新后重新打开 Codex，并新建任务以加载新版本。

## 能力

- 世界观、梗概、季纲、集纲、剧本和钩子
- 客户意见、批注、红线和多版本修订台账
- 项目可配置格式校验与洁版交付
- 双语本地化、术语锁和增量翻译
- 角色、场景、道具、风格资产与分镜
- 基于版本化平台规则的合规审查
- 可持久化项目记忆、共享候选、管理员审批和已发布规则自动同步

## 数据边界

仓库包含通用 Agent、Skills 和可移植 Harness，不包含客户原稿、聊天记录、项目私有偏好、RAG 私有数据或任何秘密密钥。中央服务只内置公开的 Supabase URL 与 publishable key；真实访问仍由每位成员自己的登录会话、组织成员关系和 RLS 权限控制。
