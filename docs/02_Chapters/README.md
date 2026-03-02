# 02 Chapters

## 目标 / 范围（What & Why）
- 定义 Chapter 1/2/3 的结构、推进逻辑与内容边界。
- 提供章节内任务链、解锁、关卡结构的统一模板。

## 术语表
- 章节主线：推进当前章节完成条件的核心任务集（TBD）。
- 码头跳转：Chapter 2 中固定节点间的线性迁移机制。
- 章节检查器：用于校验阶段条件是否达成的逻辑单元（TBD）。

## 系统边界
- 管：章节目标、阶段解锁、线性/半线性结构规则。
- 不管：单个任务脚本实现细节、剧情文本成稿。

## 核心流程
1. 初始化章节入口条件。
2. 激活章节任务链与引导。
3. 完成阶段目标并触发检查器。
4. 发放解锁并更新章节状态。
5. 进入下一阶段/下一章节。

## 子章节入口
- [02_01 Chapter1](./02_01_Chapter1/README.md)
- [02_02 Chapter2](./02_02_Chapter2/README.md)
- [02_03 Chapter3](./02_03_Chapter3/README.md)

## 数据结构 / 配置（占位）
- DataTable：`DT_ChapterFlow`（TBD）
- DataTable：`DT_QuestChain`（TBD）
- 枚举：`Enum_ChapterId` / `Enum_ChapterState`（TBD）
- 标签：`Tag.Chapter.*`（TBD）

## 与其他系统依赖
- `01_Gameplay_Loops`：提供章节内循环压力与资源节奏。
- `04_Building_System`：章节解锁驱动建造能力开放。
- `06_Technical_UE5`：章节状态机、notify/checker 实现。

## 常见坑 / 待验证点
- TODO：Chapter 1 到 Chapter 2 的过渡是否平滑。
- TODO：码头跳转会否削弱探索连续感。
- TODO：Chapter 3 技术复杂度是否超出当前架构承载。

