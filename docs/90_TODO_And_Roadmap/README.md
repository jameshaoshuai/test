# 90 TODO And Roadmap

## 目标 / 范围（What & Why）
- 统一维护跨模块待办事项与阶段路线图。
- 提供可执行优先级规则，支持短中期迭代决策。

## 术语表
- Backlog：已记录但未开始的任务。
- Doing：当前进行中的任务。
- Done：已完成并可验证的任务。
- 里程碑：阶段性目标集合（Demo / Next Fest / EA）。

## 系统边界
- 管：任务状态流转、优先级评估框架、里程碑占位。
- 不管：具体实现方案细节（应回填各模块文档）。

## 核心流程（伪流程）
1. 收集各模块输入并归档至 Backlog。
2. 依据优先级规则选择进入 Doing。
3. 完成后转移到 Done 并补充验证记录。
4. 定期复盘并重排里程碑内容。

## TODO 列表模板
### Backlog
- [ ] TBD
- [ ] TBD

### Doing
- [ ] TBD

### Done
- [ ] TBD

## 近期优先级评估规则（占位）
- 玩家价值：TBD
- 技术风险：TBD
- 产能成本：TBD
- 章节阻塞程度：TBD
- 评分与排序方法：TBD

## 里程碑（占位，无具体日期）
- Demo：TBD
- Next Fest：TBD
- EA：TBD

## 数据结构 / 配置（占位）
- DataTable：`DT_RoadmapItems`（TBD）
- 枚举：`Enum_TodoStatus` / `Enum_Milestone`（TBD）
- 标签：`Tag.Roadmap.*`（TBD）

## 与其他系统依赖
- 依赖所有模块定期回填状态与风险。
- 反向驱动 `02_Chapters` 与 `06_Technical_UE5` 的优先开发序列。

## 常见坑 / 待验证点
- TODO：任务粒度过大导致长期停留 Doing。
- TODO：跨模块依赖未显式标注导致排期失真。
- TODO：里程碑目标与当前产能不匹配。

