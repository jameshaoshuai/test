# 06 Technical UE5

## 目标 / 范围（What & Why）
- 将玩法需求映射到 UE5 可执行的技术骨架。
- 统一蓝图、DataTable、行为树、检查器/通知、存档等实现约定。

## 术语表
- Notify：事件触发通知节点/机制（TBD）。
- Checker：条件校验器，用于任务或状态推进（TBD）。
- 状态机：用于系统状态切换与决策的框架（TBD）。

## 系统边界
- 管：实现规范、数据驱动约定、跨系统同步机制。
- 不管：纯设计层决策、剧情文案、商业化配置。

## 核心流程（伪流程）
1. 设计层定义规则与目标。
2. 转译为 DataTable / Enum / Tag 配置。
3. 在蓝图/行为树中实现执行逻辑。
4. 通过 Notify/Checker 驱动状态推进。
5. 写入存档并保证跨章节一致性。

## 蓝图组织规范（占位）
- 模块拆分策略：TBD
- 命名规范：TBD
- 事件分发约定：TBD

## DataTable / 行为树 / Notify-Checker 规范（占位）
- DataTable 字段最小集合：TBD
- 行为树任务节点规范：TBD
- Notify/Checker 配对规则：TBD

## 存档系统（占位）
- 记录 NPC 状态：TBD
- 记录世界种子：TBD
- 记录章节与解锁：TBD
- 版本兼容策略：TBD

## 世界分区 / 加载（占位）
- 是否启用世界分区：TBD
- 场景加载粒度：TBD
- 章节切换加载策略：TBD

## 移动城堡状态机（占位）
- 基础状态：Move / Idle
- 决策输入条件：TBD
- 多条件决策框架：TBD
- 异常回退策略：TBD

## 数据结构 / 配置（占位）
- DataTable：`DT_SystemConfig` / `DT_SaveVersion`（TBD）
- 枚举：`Enum_CastleMoveState` / `Enum_CheckerResult`（TBD）
- 标签：`Tag.System.Notify.*` / `Tag.System.Checker.*`（TBD）

## 与其他系统依赖
- 为 `02_Chapters` 提供推进与状态同步框架。
- 为 `03_NPC_System` 提供行为树与持久化基础。
- 为 `04_Building_System` 提供规则校验与运行时约束。

## 常见坑 / 待验证点
- TODO：Notify 与 Checker 时序不一致导致卡任务。
- TODO：存档版本变更造成旧档兼容问题。
- TODO：移动状态机与建造系统并发冲突。

