# AI 漫剧制片 Agent

这是可安装到 Codex 的 AI 漫剧制片与团队学习插件。安装后会以 **AI 漫剧制片** 智能体插件出现，而不是散落的提示词文件。

## 安装

确保已经安装并登录 Codex，然后在终端依次运行：

```bash
codex plugin marketplace add l0810lin-ship-it/ai-drama-studio-marketplace --ref main
codex plugin add ai-drama-studio@ai-drama-team
```

完成后重新打开 Codex，并新建一个任务。在输入框的 `+` 菜单中选择 **AI 漫剧制片**，或者直接描述剧本、集纲、客户修改、翻译、分镜、交付等任务。

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
- 项目私有、共享候选和人工审批式团队学习

## 数据边界

仓库只包含通用 Agent 和 Skills，不包含客户原稿、聊天记录、项目私有偏好、RAG 私有数据或任何密钥。安装插件不会自动授予团队数据库权限；中央候选库需要管理员另外开通账号。
