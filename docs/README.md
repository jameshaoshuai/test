# Moving Castle 文档库

> 版本：v0.1（骨架版）

本目录用于维护 UE5 3D 生存建造游戏《Moving Castle》的设计与实现文档。当前版本提供“分层文档库”基础结构与可持续填写模板，便于后续逐步补充细节。

## 快速入口
- [项目总览](./00_Overview/README.md)
- [主循环与节奏](./01_Gameplay_Loops/README.md)
- [章节系统](./02_Chapters/README.md)
- [NPC 系统](./03_NPC_System/README.md)
- [建筑系统](./04_Building_System/README.md)
- [战斗与生物](./05_Combat_And_Creatures/README.md)
- [UE5 技术实现](./06_Technical_UE5/README.md)
- [TODO 与路线图](./90_TODO_And_Roadmap/README.md)

## 模块导航
- `00_Overview`：项目电梯陈述、核心卖点、章节路线概览、术语与命名规范。
- `01_Gameplay_Loops`：生存、资源、建造、风险回报节奏。
- `02_Chapters`：Chapter 1/2/3 的结构化设计与推进规则。
- `03_NPC_System`：NPC 行为层级、职业岗位、需求状态、任务逻辑。
- `04_Building_System`：建筑分类、解锁配方、规则约束、与移动城堡关系。
- `05_Combat_And_Creatures`：敌对生物、战斗手段、掉落门槛、Boss 规划。
- `06_Technical_UE5`：蓝图/DataTable/行为树/notify-checker/存档/状态机等实现框架。
- `90_TODO_And_Roadmap`：跨模块 TODO、优先级规则、里程碑占位。

## 如何贡献 / 更新
1. 先在对应模块 `README.md` 中补充“目标/范围”与“系统边界”。
2. 若新增子系统，在对应模块下创建子目录与 `README.md`，并在本页补充导航。
3. 未确认内容统一使用 `TBD`。
4. 涉及跨系统改动时，补充“依赖关系”与“待验证点（TODO）”。

## 变更摘要
- 初始化 `/docs` 分层目录结构。
- 为所有核心模块创建入口文档与骨架模板。
- 为章节（Chapter 1/2/3）创建独立文档，并补充 Chapter 1 的任务链模板与规范占位。

