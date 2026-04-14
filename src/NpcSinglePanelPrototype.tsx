import React, { useMemo, useState } from 'react';

type Identity = '居民' | '猎人' | '商人';
type JoinType = 'camp' | 'recruitable' | 'merchant';
type WorkMode = '伐木' | '采矿' | '搬运' | '巡逻' | '待命';
type CombatMode = '前排' | '后排' | '保命';
type ItemCategory = 'weapon' | 'tool' | 'accessory' | 'consumable' | 'goods';
type EquipSlot = 'weapon' | 'tool' | 'accessoryA' | 'accessoryB' | 'consumableA' | 'consumableB';

interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  power?: number;
}

interface Stats {
  hp: number;
  hunger: number;
  sleep: number;
  clean: number;
}

interface Env {
  window: boolean;
  roof: boolean;
  crowding: number;
  bath: boolean;
  fedToday: boolean;
}

interface Flags {
  recentDeath: boolean;
  wound: boolean;
}

interface Equipment {
  weapon: Item | null;
  tool: Item | null;
  accessoryA: Item | null;
  accessoryB: Item | null;
  consumableA: Item | null;
  consumableB: Item | null;
}

interface RecruitState {
  needBed: boolean;
  needMeal: boolean;
  needThreatClear: boolean;
}

interface Npc {
  id: string;
  name: string;
  identity: Identity;
  title: string;
  joined: boolean;
  joinType: JoinType;
  level: number;
  exp: number;
  expMax: number;
  workMode: WorkMode;
  combatMode: CombatMode;
  follow: boolean;
  statusText: string;
  traits: string[];
  stats: Stats;
  env: Env;
  flags: Flags;
  equipment: Equipment;
  bag: Item[];
  logs: string[];
  recruit: RecruitState | null;
}

interface CastleResource {
  spareBeds: number;
  foodStock: number;
}

interface MoodRow {
  label: string;
  value: number;
}

interface MoodResult {
  score: number;
  rows: MoodRow[];
  efficiency: string;
  expGain: string;
  tier: string;
  behavior: string;
}

const item = (id: string, name: string, category: ItemCategory, power?: number): Item => ({ id, name, category, power });

const initialCastle: CastleResource = {
  spareBeds: 1,
  foodStock: 3,
};

const initialNpcs: Npc[] = [
  {
    id: 'npc-1',
    name: '林溪',
    identity: '居民',
    title: '木工学徒',
    joined: true,
    joinType: 'camp',
    level: 5,
    exp: 210,
    expMax: 300,
    workMode: '伐木',
    combatMode: '后排',
    follow: false,
    statusText: '正在木场作业，状态稳定。',
    traits: ['勤快', '手稳', '乐观'],
    stats: { hp: 88, hunger: 80, sleep: 76, clean: 72 },
    env: { window: true, roof: true, crowding: 28, bath: true, fedToday: true },
    flags: { recentDeath: false, wound: false },
    equipment: {
      weapon: item('w1', '短弓', 'weapon', 12),
      tool: item('t1', '钢斧', 'tool', 10),
      accessoryA: item('a1', '木灵吊坠', 'accessory'),
      accessoryB: null,
      consumableA: item('c1', '体力药剂', 'consumable'),
      consumableB: item('c2', '净水包', 'consumable'),
    },
    bag: [
      item('g1', '木材', 'goods'),
      item('g2', '树脂', 'goods'),
      item('w2', '骨匕', 'weapon', 6),
      item('a2', '鹿皮护符', 'accessory'),
      item('c3', '急救绷带', 'consumable'),
    ],
    logs: ['[系统] 已加入城堡。', '[岗位] 设为伐木。'],
    recruit: null,
  },
  {
    id: 'npc-2',
    name: '卓岳',
    identity: '猎人',
    title: '边境追踪者',
    joined: true,
    joinType: 'camp',
    level: 7,
    exp: 90,
    expMax: 340,
    workMode: '巡逻',
    combatMode: '前排',
    follow: true,
    statusText: '巡逻后疲惫，建议优先恢复。',
    traits: ['顽强', '急性子', '夜视'],
    stats: { hp: 24, hunger: 32, sleep: 34, clean: 18 },
    env: { window: false, roof: true, crowding: 82, bath: false, fedToday: false },
    flags: { recentDeath: true, wound: true },
    equipment: {
      weapon: item('w3', '裂口长矛', 'weapon', 15),
      tool: item('t2', '捕猎套索', 'tool', 8),
      accessoryA: null,
      accessoryB: null,
      consumableA: item('c4', '止血包', 'consumable'),
      consumableB: null,
    },
    bag: [item('g3', '兽骨', 'goods'), item('c5', '抗寒药', 'consumable'), item('a3', '狼牙挂件', 'accessory')],
    logs: ['[战斗] 昨夜前哨冲突中倒地。', '[系统] 当前跟随玩家。'],
    recruit: null,
  },
  {
    id: 'npc-3',
    name: '秋南',
    identity: '居民',
    title: '流亡织匠',
    joined: false,
    joinType: 'recruitable',
    level: 2,
    exp: 20,
    expMax: 120,
    workMode: '待命',
    combatMode: '保命',
    follow: false,
    statusText: '暂住营地外围，观望中。',
    traits: ['细心', '谨慎'],
    stats: { hp: 68, hunger: 55, sleep: 61, clean: 58 },
    env: { window: true, roof: false, crowding: 40, bath: false, fedToday: false },
    flags: { recentDeath: false, wound: false },
    equipment: {
      weapon: null,
      tool: null,
      accessoryA: null,
      accessoryB: null,
      consumableA: null,
      consumableB: null,
    },
    bag: [item('g4', '破旧布匹', 'goods'), item('c6', '干粮包', 'consumable')],
    logs: ['[接触] 表示愿意谈条件。'],
    recruit: { needBed: true, needMeal: true, needThreatClear: true },
  },
  {
    id: 'npc-4',
    name: '莫兹',
    identity: '商人',
    title: '流动行商',
    joined: false,
    joinType: 'merchant',
    level: 4,
    exp: 0,
    expMax: 100,
    workMode: '待命',
    combatMode: '保命',
    follow: false,
    statusText: '带来新货，等待交易。',
    traits: ['精明', '话多', '识货'],
    stats: { hp: 72, hunger: 70, sleep: 65, clean: 66 },
    env: { window: true, roof: true, crowding: 30, bath: false, fedToday: true },
    flags: { recentDeath: false, wound: false },
    equipment: {
      weapon: item('w4', '护身短杖', 'weapon', 7),
      tool: null,
      accessoryA: item('a4', '算盘戒指', 'accessory'),
      accessoryB: null,
      consumableA: null,
      consumableB: null,
    },
    bag: [
      item('g5', '香料', 'goods'),
      item('g6', '盐砖', 'goods'),
      item('c7', '便携口粮', 'consumable'),
      item('t3', '修补钳', 'tool', 5),
    ],
    logs: ['[商队] 今日抵达城堡停靠点。'],
    recruit: null,
  },
];

const cardBase = 'rounded-xl border border-slate-700/80 bg-slate-900/70 backdrop-blur p-4';

const Card: React.FC<{ title?: string; className?: string; children: React.ReactNode }> = ({ title, className = '', children }) => (
  <section className={`${cardBase} ${className}`}>
    {title ? <h3 className="mb-3 text-sm font-semibold tracking-wide text-slate-200">{title}</h3> : null}
    {children}
  </section>
);

const ActionButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  intent?: 'primary' | 'warn' | 'ghost';
  className?: string;
}> = ({ onClick, disabled, children, intent = 'primary', className = '' }) => {
  const styleMap = {
    primary: 'bg-cyan-500/80 hover:bg-cyan-500 text-slate-900',
    warn: 'bg-amber-500/80 hover:bg-amber-500 text-slate-900',
    ghost: 'bg-slate-700/80 hover:bg-slate-600 text-slate-100',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${styleMap[intent]} ${className}`}
    >
      {children}
    </button>
  );
};

const PillButton: React.FC<{ active?: boolean; onClick?: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-3 py-1 text-xs transition ${
      active ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-600 bg-slate-800/60 text-slate-300 hover:border-slate-500'
    }`}
  >
    {children}
  </button>
);

const StatBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const color = value >= 70 ? 'bg-emerald-400' : value >= 40 ? 'bg-amber-400' : 'bg-rose-500';
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
        <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
};

const EmptySlot: React.FC<{ slot: string }> = ({ slot }) => (
  <div className="rounded-lg border border-dashed border-slate-600 bg-slate-800/40 px-3 py-2 text-xs text-slate-500">{slot}：空</div>
);

const FilledSlot: React.FC<{ slot: string; item: Item }> = ({ slot, item }) => (
  <div className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-xs text-slate-200">
    <div className="font-medium">{slot}</div>
    <div className="text-slate-300">{item.name}</div>
  </div>
);

const CheckBadge: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <div className={`rounded-lg border px-3 py-2 text-sm ${ok ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/60 bg-rose-500/10 text-rose-200'}`}>
    {ok ? '✔' : '✖'} {label}
  </div>
);

const toSlotLabel: Record<EquipSlot, string> = {
  weapon: '武器',
  tool: '工具',
  accessoryA: '饰品A',
  accessoryB: '饰品B',
  consumableA: '道具A',
  consumableB: '道具B',
};

function computeMood(npc: Npc): MoodResult {
  const rows: MoodRow[] = [];
  const add = (label: string, value: number) => rows.push({ label, value });

  add('生命状态', npc.stats.hp >= 80 ? 18 : npc.stats.hp >= 50 ? 8 : -24);
  add('饱食度', npc.stats.hunger >= 70 && npc.env.fedToday ? 16 : npc.stats.hunger >= 40 ? 2 : -20);
  add('睡眠', npc.stats.sleep >= 70 ? 12 : npc.stats.sleep >= 40 ? 2 : -12);
  add('清洁', npc.stats.clean >= 70 ? 10 : npc.stats.clean >= 40 ? 0 : -16);
  add('有窗户', npc.env.window ? 6 : -4);
  add('有屋顶', npc.env.roof ? 6 : -8);
  add('拥挤度', npc.env.crowding <= 45 ? 8 : npc.env.crowding <= 70 ? 0 : -15);
  add('木桶浴', npc.env.bath ? 6 : 0);
  if (npc.flags.recentDeath) add('近期死亡阴影', -45);
  if (npc.flags.wound) add('旧伤影响', -10);

  const score = rows.reduce((s, r) => s + r.value, 40);

  if (score <= 0) {
    return { score, rows, efficiency: '0%', expGain: '0%', tier: '停摆', behavior: '不干活，优先恢复' };
  }
  if (score < 60) {
    return { score, rows, efficiency: '65%', expGain: '60%', tier: '低迷', behavior: '勉强工作，建议减压' };
  }
  if (score < 120) {
    return { score, rows, efficiency: '100%', expGain: '100%', tier: '稳定', behavior: '正常工作' };
  }
  return { score, rows, efficiency: '130%', expGain: '125%', tier: '高昂', behavior: '高心情工作，效率提升' };
}

function countWarnings(npc: Npc): string[] {
  const warnings: string[] = [];
  if (npc.stats.hp < 35) warnings.push('生命值过低，建议停止高风险任务');
  if (npc.stats.hunger < 40 || !npc.env.fedToday) warnings.push('处于饥饿状态，需尽快补给');
  if (npc.stats.clean < 30) warnings.push('过于脏乱，可能导致负面情绪');
  if (npc.env.crowding > 75) warnings.push('居住区过于拥挤，影响心情恢复');
  if (npc.flags.recentDeath) warnings.push('近期死亡事件造成心理阴影');
  if (!warnings.length) warnings.push('暂无明显预警，可以维持当前安排');
  return warnings;
}

function runMockChecks(npcs: Npc[], castle: CastleResource): string[] {
  const results: string[] = [];
  results.push(npcs.length >= 4 ? 'NPC 数量检查通过（>=4）' : 'NPC 数量不足');
  results.push(npcs.some((n) => n.joinType === 'merchant') ? '商人样本存在' : '缺少商人样本');
  results.push(npcs.some((n) => !!n.recruit) ? '可招募样本存在' : '缺少招募样本');
  results.push(castle.foodStock >= 0 && castle.spareBeds >= 0 ? '公共资源数值合法' : '公共资源出现负值');
  const mood = computeMood(npcs[0]);
  results.push(mood.rows.length >= 6 ? '心情来源计算正常' : '心情来源项过少');
  return results;
}

const NpcSinglePanelPrototype: React.FC = () => {
  const [castle, setCastle] = useState<CastleResource>(initialCastle);
  const [npcs, setNpcs] = useState<Npc[]>(initialNpcs);
  const [selectedNpcId, setSelectedNpcId] = useState<string>(initialNpcs[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedNpc = useMemo(() => npcs.find((n) => n.id === selectedNpcId) ?? npcs[0], [npcs, selectedNpcId]);
  const mood = useMemo(() => computeMood(selectedNpc), [selectedNpc]);
  const warnings = useMemo(() => countWarnings(selectedNpc), [selectedNpc]);
  const checks = useMemo(() => runMockChecks(npcs, castle), [npcs, castle]);

  const updateNpc = (npcId: string, updater: (npc: Npc) => Npc) => {
    setNpcs((prev) => prev.map((n) => (n.id === npcId ? updater(n) : n)));
  };

  const pushLog = (npc: Npc, msg: string): Npc => ({ ...npc, logs: [`[${new Date().toLocaleTimeString('zh-CN', { hour12: false })}] ${msg}`, ...npc.logs].slice(0, 12) });

  const onSwitchNpc = (id: string) => {
    setSelectedNpcId(id);
    setDrawerOpen(false);
  };

  const switchWorkMode = (mode: WorkMode) => {
    if (!selectedNpc.joined) return;
    updateNpc(selectedNpc.id, (npc) => pushLog({ ...npc, workMode: mode, statusText: `岗位已调整为${mode}。` }, `岗位切换为${mode}`));
  };

  const switchCombatMode = (mode: CombatMode) => {
    if (!selectedNpc.joined) return;
    updateNpc(selectedNpc.id, (npc) => pushLog({ ...npc, combatMode: mode }, `战斗策略改为${mode}`));
  };

  const toggleFollow = () => {
    if (!selectedNpc.joined) return;
    updateNpc(selectedNpc.id, (npc) => {
      const next = !npc.follow;
      return pushLog({ ...npc, follow: next, statusText: next ? '正在跟随玩家行动。' : '已取消跟随，返回原岗位。' }, next ? '设为跟随' : '取消跟随');
    });
  };

  const quickRecover = (type: 'rest' | 'wash') => {
    if (!selectedNpc.joined) return;
    updateNpc(selectedNpc.id, (npc) => {
      if (type === 'rest') {
        return pushLog({ ...npc, stats: { ...npc.stats, sleep: Math.min(100, npc.stats.sleep + 20) }, statusText: '已安排短时休息。' }, '执行快捷操作：安排休息');
      }
      return pushLog({ ...npc, stats: { ...npc.stats, clean: Math.min(100, npc.stats.clean + 25) }, statusText: '已安排洗漱。' }, '执行快捷操作：安排洗漱');
    });
  };

  const useConsumable = (slot: 'consumableA' | 'consumableB') => {
    if (!selectedNpc.joined) return;
    updateNpc(selectedNpc.id, (npc) => {
      const using = npc.equipment[slot];
      if (!using) return npc;
      const newStats: Stats = {
        ...npc.stats,
        hp: Math.min(100, npc.stats.hp + 18),
        hunger: Math.min(100, npc.stats.hunger + 8),
      };
      return pushLog(
        {
          ...npc,
          stats: newStats,
          equipment: { ...npc.equipment, [slot]: null },
          statusText: `已使用${using.name}，状态小幅恢复。`,
        },
        `使用${slot === 'consumableA' ? '快捷道具A' : '快捷道具B'}：${using.name}`,
      );
    });
  };

  const equipFromBag = (itemId: string) => {
    updateNpc(selectedNpc.id, (npc) => {
      const targetItem = npc.bag.find((it) => it.id === itemId);
      if (!targetItem || targetItem.category === 'goods') return npc;

      const bagWithout = npc.bag.filter((it) => it.id !== itemId);
      const equipment = { ...npc.equipment };
      const backToBag: Item[] = [];

      const swapInto = (slot: EquipSlot) => {
        const old = equipment[slot];
        if (old) backToBag.push(old);
        equipment[slot] = targetItem;
      };

      if (targetItem.category === 'weapon') swapInto('weapon');
      if (targetItem.category === 'tool') swapInto('tool');
      if (targetItem.category === 'accessory') {
        if (!equipment.accessoryA) swapInto('accessoryA');
        else if (!equipment.accessoryB) swapInto('accessoryB');
        else swapInto('accessoryA');
      }
      if (targetItem.category === 'consumable') {
        if (!equipment.consumableA) swapInto('consumableA');
        else if (!equipment.consumableB) swapInto('consumableB');
        else swapInto('consumableA');
      }

      return pushLog(
        { ...npc, equipment, bag: [...bagWithout, ...backToBag] },
        `从背包装备：${targetItem.name}`,
      );
    });
  };

  const recruitAction = (action: 'bed' | 'meal' | 'threat' | 'invite') => {
    if (!selectedNpc.recruit || selectedNpc.joinType !== 'recruitable') return;

    if (action === 'bed') {
      if (castle.spareBeds <= 0 || !selectedNpc.recruit.needBed) return;
      setCastle((c) => ({ ...c, spareBeds: c.spareBeds - 1 }));
      updateNpc(selectedNpc.id, (npc) => {
        if (!npc.recruit) return npc;
        return pushLog({ ...npc, recruit: { ...npc.recruit, needBed: false } }, '已为其预留床位');
      });
      return;
    }

    if (action === 'meal') {
      if (castle.foodStock <= 0 || !selectedNpc.recruit.needMeal) return;
      setCastle((c) => ({ ...c, foodStock: c.foodStock - 1 }));
      updateNpc(selectedNpc.id, (npc) => {
        if (!npc.recruit) return npc;
        return pushLog({ ...npc, recruit: { ...npc.recruit, needMeal: false }, env: { ...npc.env, fedToday: true } }, '已提供一顿热食');
      });
      return;
    }

    if (action === 'threat') {
      if (!selectedNpc.recruit.needThreatClear) return;
      updateNpc(selectedNpc.id, (npc) => {
        if (!npc.recruit) return npc;
        return pushLog({ ...npc, recruit: { ...npc.recruit, needThreatClear: false } }, '已清理附近威胁');
      });
      return;
    }

    if (action === 'invite') {
      const rec = selectedNpc.recruit;
      if (!rec || rec.needBed || rec.needMeal || rec.needThreatClear) return;
      updateNpc(selectedNpc.id, (npc) =>
        pushLog(
          {
            ...npc,
            joined: true,
            joinType: 'camp',
            recruit: null,
            workMode: '待命',
            statusText: '已加入城堡，等待岗位安排。',
          },
          '接受邀请，加入城堡',
        ),
      );
    }
  };

  const merchantAction = (kind: 'trade' | 'view') => {
    if (selectedNpc.joinType !== 'merchant') return;
    updateNpc(selectedNpc.id, (npc) => pushLog(npc, kind === 'trade' ? '开启交易窗口（原型）' : '查看商人货物（原型）'));
  };

  const recruitReady = selectedNpc.recruit
    ? !selectedNpc.recruit.needBed && !selectedNpc.recruit.needMeal && !selectedNpc.recruit.needThreatClear
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-100">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-4">
        <aside className="col-span-3 space-y-4">
          <Card title="NPC 切换（原型辅助）">
            <div className="space-y-2">
              {npcs.map((npc) => (
                <button
                  key={npc.id}
                  onClick={() => onSwitchNpc(npc.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                    selectedNpc.id === npc.id
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                      : 'border-slate-600 bg-slate-800/60 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-semibold">{npc.name}</div>
                  <div className="text-xs opacity-80">
                    {npc.identity} · {npc.joined ? '已加入' : npc.joinType === 'merchant' ? '商人' : '未加入'}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card title="城堡公共资源">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-800/70 p-3">
                <div className="text-slate-400">空床位</div>
                <div className="text-lg font-semibold text-emerald-300">{castle.spareBeds}</div>
              </div>
              <div className="rounded-lg bg-slate-800/70 p-3">
                <div className="text-slate-400">食物库存</div>
                <div className="text-lg font-semibold text-amber-300">{castle.foodStock}</div>
              </div>
            </div>
          </Card>

          <Card title="内置自检">
            <div className="space-y-2 text-xs">
              {checks.map((line, idx) => (
                <div key={idx} className="rounded bg-slate-800/60 px-2 py-1 text-slate-300">
                  {idx + 1}. {line}
                </div>
              ))}
            </div>
          </Card>
        </aside>

        <main className="col-span-9 space-y-4">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-2xl font-bold">{selectedNpc.name}</div>
                <div className="mt-1 text-sm text-slate-300">
                  {selectedNpc.identity} · {selectedNpc.title}
                </div>
                <div className="mt-2 text-sm text-slate-200">当前状态：{selectedNpc.statusText}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedNpc.traits.map((t) => (
                    <span key={t} className="rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm md:min-w-[360px]">
                <div className="rounded-lg bg-slate-800/70 p-2">今日心情：<span className="font-semibold text-cyan-300">{mood.score}</span></div>
                <div className="rounded-lg bg-slate-800/70 p-2">层级：<span className="font-semibold">{mood.tier}</span></div>
                <div className="rounded-lg bg-slate-800/70 p-2">效率：<span className="font-semibold text-emerald-300">{mood.efficiency}</span></div>
                <div className="rounded-lg bg-slate-800/70 p-2">经验增长：<span className="font-semibold text-amber-300">{mood.expGain}</span></div>
                <div className="rounded-lg bg-slate-800/70 p-2">等级：<span className="font-semibold">Lv.{selectedNpc.level}</span></div>
                <div className="rounded-lg bg-slate-800/70 p-2">建议：<span className="font-semibold">{mood.behavior}</span></div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card title="即时结论">
                <p className="text-sm text-slate-200">{selectedNpc.joinType === 'merchant' ? '此目标为商人，建议直接交易并查看货物。' : mood.score < 60 ? '状态偏低，建议先恢复再安排任务。' : '状态可用，可继续执行当前安排。'}</p>
              </Card>

              <Card title="今日心情来源">
                <div className="space-y-2 text-sm">
                  {mood.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded bg-slate-800/60 px-2 py-1">
                      <span className="text-slate-300">{row.label}</span>
                      <span className={row.value >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{row.value >= 0 ? `+${row.value}` : row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="装备栏">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(Object.keys(toSlotLabel) as EquipSlot[]).map((slot) => {
                    const eq = selectedNpc.equipment[slot];
                    return eq ? <FilledSlot key={slot} slot={toSlotLabel[slot]} item={eq} /> : <EmptySlot key={slot} slot={toSlotLabel[slot]} />;
                  })}
                </div>
              </Card>

              {selectedNpc.joined ? (
                <Card title="岗位与战斗策略">
                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 text-xs text-slate-400">工作模式</div>
                      <div className="flex flex-wrap gap-2">
                        {(['伐木', '采矿', '搬运', '巡逻', '待命'] as WorkMode[]).map((mode) => (
                          <PillButton key={mode} active={selectedNpc.workMode === mode} onClick={() => switchWorkMode(mode)}>
                            {mode}
                          </PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-xs text-slate-400">战斗策略</div>
                      <div className="flex flex-wrap gap-2">
                        {(['前排', '后排', '保命'] as CombatMode[]).map((mode) => (
                          <PillButton key={mode} active={selectedNpc.combatMode === mode} onClick={() => switchCombatMode(mode)}>
                            {mode}
                          </PillButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}

              {!selectedNpc.joined && selectedNpc.joinType === 'recruitable' && selectedNpc.recruit ? (
                <Card title="加入条件">
                  <div className="space-y-2">
                    <CheckBadge ok={!selectedNpc.recruit.needBed} label="已经预留空床位" />
                    <CheckBadge ok={!selectedNpc.recruit.needMeal} label="已经提供一顿热食" />
                    <CheckBadge ok={!selectedNpc.recruit.needThreatClear} label="已经清掉附近威胁" />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <ActionButton intent="ghost" disabled={castle.spareBeds <= 0 || !selectedNpc.recruit.needBed} onClick={() => recruitAction('bed')}>
                        预留床位
                      </ActionButton>
                      <ActionButton intent="ghost" disabled={castle.foodStock <= 0 || !selectedNpc.recruit.needMeal} onClick={() => recruitAction('meal')}>
                        给一顿热食
                      </ActionButton>
                      <ActionButton intent="ghost" disabled={!selectedNpc.recruit.needThreatClear} onClick={() => recruitAction('threat')}>
                        清理附近威胁
                      </ActionButton>
                      <ActionButton disabled={!recruitReady} onClick={() => recruitAction('invite')}>
                        邀请加入城堡
                      </ActionButton>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>

            <div className="space-y-4">
              <Card title="当前状态条">
                <div className="space-y-3">
                  <StatBar label="生命" value={selectedNpc.stats.hp} />
                  <StatBar label="饱食" value={selectedNpc.stats.hunger} />
                  <StatBar label="睡眠" value={selectedNpc.stats.sleep} />
                  <StatBar label="清洁" value={selectedNpc.stats.clean} />
                </div>
              </Card>

              <Card title="需求与提醒">
                <div className="space-y-2 text-sm">
                  {warnings.map((w, idx) => (
                    <div key={idx} className={`rounded px-2 py-1 ${w.includes('暂无') ? 'bg-emerald-500/10 text-emerald-200' : 'bg-amber-500/10 text-amber-200'}`}>
                      {w}
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="背包摘要">
                <div className="text-sm text-slate-300">物品数量：{selectedNpc.bag.length}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedNpc.bag.slice(0, 6).map((it) => (
                    <span key={it.id} className="rounded bg-slate-800/70 px-2 py-1 text-xs">
                      {it.name}
                    </span>
                  ))}
                </div>
              </Card>

              {selectedNpc.joined ? (
                <Card title="快捷操作">
                  <div className="grid grid-cols-2 gap-2">
                    <ActionButton intent="ghost" onClick={() => quickRecover('rest')}>
                      安排休息
                    </ActionButton>
                    <ActionButton intent="ghost" onClick={() => quickRecover('wash')}>
                      安排洗漱
                    </ActionButton>
                    <ActionButton
                      intent="warn"
                      disabled={!selectedNpc.equipment.consumableA}
                      onClick={() => useConsumable('consumableA')}
                    >
                      使用快捷道具A
                    </ActionButton>
                    <ActionButton
                      intent="warn"
                      disabled={!selectedNpc.equipment.consumableB}
                      onClick={() => useConsumable('consumableB')}
                    >
                      使用快捷道具B
                    </ActionButton>
                  </div>
                </Card>
              ) : null}

              {selectedNpc.joinType === 'merchant' ? (
                <Card title="商人操作">
                  <div className="flex gap-2">
                    <ActionButton onClick={() => merchantAction('trade')}>与商人交易</ActionButton>
                    <ActionButton intent="ghost" onClick={() => merchantAction('view')}>
                      查看货物
                    </ActionButton>
                  </div>
                </Card>
              ) : null}

              <Card title="最近操作日志">
                <div className="max-h-52 space-y-2 overflow-auto pr-1 text-xs text-slate-300">
                  {selectedNpc.logs.map((log, idx) => (
                    <div key={`${log}-${idx}`} className="rounded bg-slate-800/60 px-2 py-1">
                      {log}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="sticky bottom-2 z-10 rounded-xl border border-slate-600 bg-slate-900/90 p-3 backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              {selectedNpc.joined ? (
                <>
                  <ActionButton onClick={toggleFollow}>{selectedNpc.follow ? '取消跟随' : '跟随我'}</ActionButton>
                  <ActionButton intent="ghost" onClick={() => setDrawerOpen(true)}>
                    打开背包与装备管理
                  </ActionButton>
                </>
              ) : null}

              {!selectedNpc.joined && selectedNpc.joinType === 'recruitable' ? (
                <ActionButton disabled={!recruitReady} onClick={() => recruitAction('invite')}>
                  邀请加入
                </ActionButton>
              ) : null}

              {selectedNpc.joinType === 'merchant' ? (
                <>
                  <ActionButton onClick={() => merchantAction('trade')}>与商人交易</ActionButton>
                  <ActionButton intent="ghost" onClick={() => setDrawerOpen(true)}>
                    打开背包与装备管理
                  </ActionButton>
                </>
              ) : null}
            </div>
          </div>
        </main>
      </div>

      <div
        className={`fixed inset-y-0 right-0 z-30 w-[420px] transform border-l border-slate-700 bg-slate-900/95 p-4 shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">背包与装备管理</h3>
          <ActionButton intent="ghost" onClick={() => setDrawerOpen(false)}>
            关闭
          </ActionButton>
        </div>

        <Card title="当前装备概览" className="mb-3">
          <div className="space-y-2 text-xs">
            {(Object.keys(toSlotLabel) as EquipSlot[]).map((slot) => {
              const eq = selectedNpc.equipment[slot];
              return (
                <div key={slot} className="flex items-center justify-between rounded bg-slate-800/70 px-2 py-1">
                  <span>{toSlotLabel[slot]}</span>
                  <span className="text-slate-300">{eq ? eq.name : '空'}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="完整背包（点击可装备）">
          <div className="max-h-[65vh] space-y-2 overflow-auto pr-1">
            {selectedNpc.bag.map((it) => {
              const canEquip = it.category !== 'goods';
              return (
                <button
                  key={it.id}
                  disabled={!canEquip}
                  onClick={() => equipFromBag(it.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                    canEquip
                      ? 'border-slate-600 bg-slate-800/70 text-slate-200 hover:border-cyan-400'
                      : 'cursor-not-allowed border-slate-700 bg-slate-800/40 text-slate-500'
                  }`}
                >
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs">
                    分类：{it.category}
                    {!canEquip ? '（不可装备）' : ''}
                  </div>
                </button>
              );
            })}
            {!selectedNpc.bag.length ? <div className="text-sm text-slate-500">背包为空</div> : null}
          </div>
        </Card>
      </div>

      {drawerOpen ? <div className="fixed inset-0 z-20 bg-black/40" onClick={() => setDrawerOpen(false)} /> : null}
    </div>
  );
};

export default NpcSinglePanelPrototype;
