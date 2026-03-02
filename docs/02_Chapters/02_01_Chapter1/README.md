# 02_01 Chapter1（线性路线推进）

## 目标 / 范围（What & Why）
- 建立新手期核心体验：基础生存、基础建造、基础战斗。
- 城堡沿既定路线自动移动，玩家不可控制方向。
- 为 Chapter 2 的飞行与空岛结构做认知铺垫。

## 术语表
- 自动路线推进：城堡按预设路径与节点前进（TBD）。
- 引导检查器：校验新手目标是否达成的检测逻辑（TBD）。

## 系统边界
- 管：线性推进结构、关键任务链模板、基础功能引导。
- 不管：高自由度路径选择、飞行系统细节。

## 核心流程（伪流程）
1. 进入 Chapter 1 并初始化新手状态。
2. 按路线节点逐步触发目标。
3. 完成基础生存与建造教学。
4. 开放有限战斗与资源门槛挑战。
5. 满足章节结束条件后进入 Chapter 2。

## 关键任务链模板（触发-目标-奖励/解锁-备注）
| 任务ID | 触发 | 目标 | 奖励/解锁 | 备注 |
|---|---|---|---|---|
| TBD_Quest_001 | TBD | TBD | TBD | TBD |
| TBD_Quest_002 | TBD | TBD | TBD | TBD |
| TBD_Quest_003 | TBD | TBD | TBD | TBD |

## 引导与检查器 / Notify 规范（占位）
- Checker 命名：`Checker_CH1_*`（TBD）
- Notify 命名：`Notify_CH1_*`（TBD）
- 触发顺序：`Notify -> Checker -> QuestStateUpdate`（TBD）
- 失败回滚策略：TBD

## 关键缺失功能清单入口
- 缺失功能列表：TBD
- 临时替代方案：TBD
- 优先级标注：TBD

## 数据结构 / 配置（占位）
- DataTable：`DT_CH1_QuestChain`（TBD）
- DataTable：`DT_CH1_Guidance`（TBD）
- 枚举：`Enum_CH1_RouteNode`（TBD）
- 标签：`Tag.CH1.*`（TBD）

## 与其他系统依赖
- 依赖 `01_Gameplay_Loops` 的前期生存与建造节奏。
- 依赖 `04_Building_System` 的初始建造白名单。
- 依赖 `06_Technical_UE5` 的章节状态同步与检查器实现。

## 常见坑 / 待验证点
- TODO：线性流程是否导致重复游玩意愿下降。
- TODO：教学密度与玩家自由度的平衡。
- TODO：章节结束前是否已充分预埋 Chapter 2 概念。

