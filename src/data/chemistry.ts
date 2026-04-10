export interface ChemistryTemplate {
  text: string
  textEn: string
  mood: 'fire' | 'ice' | 'lightning' | 'rainbow' | 'chaos' | 'zen' | 'mystery'
}

export const PAIR_MAP: Record<string, ChemistryTemplate> = {
  'CTRL+CTRL': { text: '两个控制狂相遇，整个宇宙的遥控器都在你们手里。谁先松手谁输。', textEn: 'Two control freaks meet. The universe\'s remote is in both your hands. Whoever lets go first loses.', mood: 'chaos' },
  'CTRL+BOSS': { text: '拿捏者 vs 领导者，办公室已经装不下你们了。', textEn: 'The Controller vs The Leader. The office can\'t contain you both.', mood: 'fire' },
  'CTRL+Dior-s': { text: '一个拼命拿捏，一个躺平被拿捏。天造地设。', textEn: 'One tries to control everything, the other lies flat and lets it happen. Made for each other.', mood: 'zen' },
  'BOSS+BOSS': { text: '双BOSS局：两条高速公路并道，谁都不让谁。', textEn: 'Double BOSS: Two highways merging, neither yielding.', mood: 'fire' },
  'SEXY+LOVE-R': { text: '尤物遇到多情者，空气中弥漫着玫瑰和闪电的味道。', textEn: 'Bombshell meets Romantic. The air smells of roses and lightning.', mood: 'rainbow' },
  'SHIT+THAN-K': { text: '愤世者负责吐槽，感恩者负责说谢谢。完美互补。', textEn: 'The Cynic complains, The Grateful says thanks. Perfect complement.', mood: 'zen' },
  'FAKE+MONK': { text: '伪人碰上僧人，一个在演，一个在看穿。', textEn: 'The Chameleon meets The Monk. One performs, the other sees through.', mood: 'mystery' },
  'JOKE-R+IMSB': { text: '小丑让傻逼笑，傻逼让小丑觉得自己还挺搞笑的。', textEn: 'The Jester makes The Conflicted laugh, and vice versa.', mood: 'rainbow' },
  'OJBK+ZZZZ': { text: '无所谓人说"都行"，装死者说"好的"然后继续睡。', textEn: '"Whatever" says "fine", "Sleeper" says "ok" and goes back to sleep.', mood: 'zen' },
  'MALO+GOGO': { text: '猴子跟行者一起出发了，但猴子可能半路去荡秋千了。', textEn: 'The Monkey set off with The Goer, but might swing on vines halfway.', mood: 'chaos' },
  'DEAD+IMFW': { text: '死者遇到废物，两个灵魂在废墟里点了一根烟。', textEn: 'Two broken souls sharing a cigarette in the ruins.', mood: 'ice' },
  'WOC!+FUCK': { text: '握草人和草者一起出现了。世界已经承受不住这种能量。', textEn: 'Wower and Rebel together. The world can\'t handle this energy.', mood: 'chaos' },
  'SOLO+MUM': { text: '孤儿遇到了妈妈，坚硬的外壳终于被温暖融化了一点。', textEn: 'The Lone Wolf meets Mom. The tough shell softens a little.', mood: 'rainbow' },
  'OH-NO+POOR': { text: '哦不人担心一切，贫困者只专注一件事。焦虑的极致对立。', textEn: 'The Worrier worries about everything, The Focused focuses on one thing. Ultimate contrast.', mood: 'lightning' },
  'THIN-K+ATM-er': { text: '思考者想了一百遍该不该送，送钱者已经把钱打过去了。', textEn: 'The Thinker considers 100 times whether to give. The Giver already transferred the money.', mood: 'lightning' },
  'DRUNK+ANY': { text: '酒鬼出场了，其他人都是配角。今晚谁也别想清醒着回家。', textEn: 'The Drunk shows up. Everyone else is a supporting character. Nobody goes home sober tonight.', mood: 'chaos' },
  'HHHH+ANY': { text: '傻乐者笑了。哈哈哈哈哈哈哈。对不起这真是全部的反应了。', textEn: 'The Laughing one just laughs. Hahahahahaha. Sorry, that\'s the entire reaction.', mood: 'rainbow' },
  'CTRL+SEXY': { text: '拿捏者想拿捏尤物，尤物微微一笑，拿捏者手抖了。', textEn: 'The Controller tries to control The Bombshell. The Bombshell smiles. The Controller\'s hands shake.', mood: 'fire' },
  'BOSS+Dior-s': { text: 'BOSS说"跟我冲"，屌丝说"你先冲，我殿后（指在后面躺着）"。', textEn: 'BOSS says "charge with me!" Loser says "you go first, I\'ll guard the rear (by lying down)."', mood: 'chaos' },
  'LOVE-R+SOLO': { text: '多情者靠近孤儿，孤儿建起了万里长城。但这次城墙有点动摇。', textEn: 'The Romantic approaches The Lone Wolf. The Great Wall trembles slightly.', mood: 'rainbow' },
  'SHIT+FAKE': { text: '愤世者一眼看穿伪人，伪人秒切真诚模式。互相佩服。', textEn: 'The Cynic sees through The Chameleon instantly. Mutual respect ensues.', mood: 'lightning' },
  'MONK+ZZZZ': { text: '僧人在打坐，装死者在睡觉。境界不同，姿势一样。', textEn: 'The Monk meditates, The Sleeper sleeps. Different levels, same posture.', mood: 'zen' },
  'GOGO+MALO': { text: '行者说出发，猴子说先吃根香蕉。最终一起出发了（带着香蕉）。', textEn: 'The Goer says let\'s go, The Monkey says banana first. They went together (with bananas).', mood: 'chaos' },
  'THAN-K+IMFW': { text: '感恩者说"谢谢你做你自己"，废物哭了。', textEn: 'The Grateful says "thank you for being you." The Fragile cries.', mood: 'rainbow' },
  'THIN-K+JOKE-R': { text: '思考者分析笑话的逻辑，小丑说："这不好笑吗？"思考者说："让我再想想。"', textEn: 'The Thinker analyzes the joke. The Jester says "wasn\'t it funny?" Thinker: "Let me think more."', mood: 'lightning' },
  'OH-NO+WOC!': { text: '哦不人预见灾难，握草人震惊于灾难已经发生。黄金搭档。', textEn: 'The Worrier foresees disaster, The Wower is shocked it already happened. Golden duo.', mood: 'chaos' },
  'CTRL+FAKE': { text: '拿捏者拿捏伪人，伪人切换了八种人格来应对。棋逢对手。', textEn: 'The Controller tries to read The Chameleon. Eight personality switches later: worthy opponent.', mood: 'lightning' },
  'SEXY+SHIT': { text: '尤物闪亮登场，愤世者说"这也太他妈好看了吧"。真香定律。', textEn: 'The Bombshell enters. The Cynic says "well that\'s f***ing gorgeous." True fragrance law.', mood: 'fire' },
  'BOSS+SHIT': { text: 'BOSS说干就干，愤世者说这活儿真狗屎然后默默干完了。最佳拍档。', textEn: 'BOSS says do it. The Cynic says it\'s shit and then does it perfectly. Best partners.', mood: 'fire' },
  'LOVE-R+OJBK': { text: '多情者问"你爱我吗"，无所谓人说"都行"。浪漫被暴击。', textEn: 'The Romantic asks "do you love me?" Whatever says "sure." Romance crit-hit.', mood: 'ice' },
  'POOR+MALO': { text: '贫困者专注深耕，猴子在旁边翻跟头。一种奇妙的陪伴。', textEn: 'The Focused digs deep while The Monkey cartwheels nearby. Strange companionship.', mood: 'zen' },
  'CTRL+LOVE-R': { text: '拿捏者试图拿捏感情，多情者已经感动到哭了。完全不在一个频道。', textEn: 'The Controller tries to manage emotions. The Romantic is already crying from being moved.', mood: 'rainbow' },
  'DRUNK+CTRL': { text: '酒鬼想拿捏拿捏者，拿捏者说"你先醒醒"。', textEn: 'The Drunk tries to control The Controller. "Sober up first."', mood: 'chaos' },
  'SEXY+OJBK': { text: '尤物问今晚吃什么，无所谓人说"随便"。气氛突然降温。', textEn: 'The Bombshell asks what\'s for dinner. "Whatever." Temperature drops.', mood: 'ice' },
  'IMSB+SOLO': { text: '傻逼想靠近孤儿又不敢，孤儿想靠近傻逼又害怕。两只刺猬跳恰恰。', textEn: 'Two hedgehogs doing the cha-cha. Wanting closeness, fearing pain.', mood: 'rainbow' },
  'DEAD+MONK': { text: '死者超脱了欲望，僧人超脱了红尘。两个NPC在服务器里发呆。', textEn: 'Two NPCs idling in the server. Beyond desire, beyond worldly things.', mood: 'zen' },
  'ATM-er+IMFW': { text: '送钱者给废物花了一块钱，废物感动了一整年。性价比之王。', textEn: 'The Giver spent one yuan on The Fragile. Moved for a whole year. Best ROI.', mood: 'rainbow' },
  'FUCK+GOGO': { text: '草者说"操"，行者说"走"。宇宙最短最高效的对话。', textEn: 'The Rebel says "f***", The Goer says "go". Shortest most efficient conversation in the universe.', mood: 'lightning' },
  'WOC!+MALO': { text: '握草人震惊于猴子的行为，猴子继续荡秋千。信息不对称的美。', textEn: 'The Wower is shocked by The Monkey. The Monkey keeps swinging. Beautiful information asymmetry.', mood: 'chaos' },
  'THAN-K+SHIT': { text: '感恩者感谢愤世者说出了大家的心声，愤世者说"谢什么谢"。', textEn: 'The Grateful thanks The Cynic for speaking truth. "Don\'t thank me."', mood: 'lightning' },
  'OH-NO+CTRL': { text: '哦不人预判了所有风险，拿捏者按预判的逐一解决。最佳项目组。', textEn: 'The Worrier predicts all risks, The Controller solves them one by one. Best project team.', mood: 'zen' },
  'SEXY+MALO': { text: '尤物和猴子在一起，像美女与野兽的赛博朋克版。', textEn: 'The Bombshell and The Monkey. Cyberpunk Beauty and the Beast.', mood: 'rainbow' },
  'ZZZZ+DEAD': { text: '装死者遇到了死者，两个人比赛谁更没有存在感。', textEn: 'The Sleeper meets The Deceased. Competing for lowest presence.', mood: 'ice' },
  'THIN-K+MONK': { text: '思考者悟了，僧人说"你终于悟了"。但其实思考者只是在想晚饭吃什么。', textEn: 'The Thinker seems enlightened. The Monk says "you finally get it." Thinker was just thinking about dinner.', mood: 'zen' },
  'LOVE-R+SHIT': { text: '多情者写了一首诗，愤世者说"这诗比你的感情还短命"。', textEn: 'The Romantic writes a poem. The Cynic: "Shorter-lived than your relationships."', mood: 'ice' },
  'JOKE-R+OJBK': { text: '小丑讲了个笑话，无所谓人说"都行"。小丑哭了。', textEn: 'The Jester tells a joke. "Whatever." The Jester cries.', mood: 'ice' },
  'IMSB+GOGO': { text: '傻逼纠结要不要冲，行者已经冲出去了。然后行者回来拉上傻逼一起冲。', textEn: 'The Conflicted hesitates. The Goer already went, then came back to drag them along.', mood: 'lightning' },
  'CTRL+OH-NO': { text: '拿捏者精准规划，哦不人精确担忧。焦虑界的黄金搭档。', textEn: 'The Controller plans precisely, The Worrier worries precisely. Golden anxiety duo.', mood: 'lightning' },
  'BOSS+GOGO': { text: 'BOSS下达指令，行者还没听完就已经执行完了。效率天花板。', textEn: 'BOSS gives orders. The Goer finished before hearing them all. Peak efficiency.', mood: 'fire' },
  'FAKE+LOVE-R': { text: '伪人展示了完美的人设，多情者爱上了这个人设。然后发现人设下面是空的。', textEn: 'The Chameleon shows a perfect persona. The Romantic falls in love with it. Then finds nothing underneath.', mood: 'mystery' },
  'POOR+THIN-K': { text: '贫困者用所有精力思考一个问题，思考者用所有问题思考一个精力。', textEn: 'The Focused spends all energy on one question. The Thinker uses all questions on one energy.', mood: 'zen' },
}

const DEFAULT_CHEMISTRY: ChemistryTemplate = {
  text: '你们的组合就像量子纠缠——观测之前谁也不知道会发生什么，但一定很精彩。',
  textEn: 'Your combination is like quantum entanglement — nobody knows what will happen until observed, but it\'ll definitely be spectacular.',
  mood: 'mystery',
}

export function getChemistry(codeA: string, codeB: string): ChemistryTemplate {
  const key1 = `${codeA}+${codeB}`
  const key2 = `${codeB}+${codeA}`

  if (PAIR_MAP[key1]) return PAIR_MAP[key1]
  if (PAIR_MAP[key2]) return PAIR_MAP[key2]

  if (codeA === 'DRUNK' || codeB === 'DRUNK') return PAIR_MAP['DRUNK+ANY']
  if (codeA === 'HHHH' || codeB === 'HHHH') return PAIR_MAP['HHHH+ANY']

  return DEFAULT_CHEMISTRY
}

export function getMoodEmoji(mood: ChemistryTemplate['mood']): string {
  const map: Record<ChemistryTemplate['mood'], string> = {
    fire: '🔥',
    ice: '🧊',
    lightning: '⚡',
    rainbow: '🌈',
    chaos: '🌪️',
    zen: '🧘',
    mystery: '🔮',
  }
  return map[mood]
}

export function getMoodGradient(mood: ChemistryTemplate['mood']): string {
  const map: Record<ChemistryTemplate['mood'], string> = {
    fire: 'from-orange-500/20 via-red-500/20 to-yellow-500/20',
    ice: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    lightning: 'from-yellow-300/20 via-amber-500/20 to-orange-500/20',
    rainbow: 'from-pink-500/20 via-purple-500/20 to-cyan-500/20',
    chaos: 'from-red-500/20 via-purple-500/20 to-green-500/20',
    zen: 'from-green-500/20 via-teal-500/20 to-cyan-500/20',
    mystery: 'from-purple-500/20 via-indigo-500/20 to-blue-500/20',
  }
  return map[mood]
}
