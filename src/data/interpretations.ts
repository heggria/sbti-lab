import type { DimensionId } from '../types'

export type InterpretationStyle = 'roast' | 'gentle' | 'philosophy' | 'cyberpunk' | 'mixed'

export interface InterpretationTemplate {
  personalityCode: string
  style: InterpretationStyle
  template: string
}

const PERSONALITY_CODES = [
  'CTRL', 'ATM-er', 'Dior-s', 'BOSS', 'THAN-K', 'OH-NO',
  'GOGO', 'SEXY', 'LOVE-R', 'MUM', 'FAKE', 'OJBK',
  'MALO', 'JOKE-R', 'WOC!', 'THIN-K', 'SHIT', 'ZZZZ',
  'POOR', 'MONK', 'IMSB', 'SOLO', 'FUCK', 'DEAD',
  'IMFW', 'HHHH', 'DRUNK',
]

const STYLES: InterpretationStyle[] = ['roast', 'gentle', 'philosophy', 'cyberpunk', 'mixed']

function generateTemplate(code: string, style: InterpretationStyle): string {
  const placeholders = [
    '{S1}', '{S2}', '{S3}', '{E1}', '{E2}', '{E3}',
    '{A1}', '{A2}', '{A3}', '{Ac1}', '{Ac2}', '{Ac3}',
    '{So1}', '{So2}', '{So3}',
  ]

  const stylePrefixes = {
    roast: ['说实话,', '老实讲,', '不得不说,', '直白点说,'],
    gentle: ['亲爱的,', '其实,', '温柔地说,', '暖心地告诉你,'],
    philosophy: ['从哲学角度看,', '生命如歌,', '思辨地讲,', '超越表象,'],
    cyberpunk: ['[系统日志]', '[神经连接]', '[数据流分析]', '[AI核心]'],
    mixed: ['嘿,', '听着,', '有意思,', '顺便说一句,'],
  }

  const styleContent = {
    roast: [
      `你的${code}人格简直是{S1}的极致体现，{E1}到让人怀疑你是不是故意装成这样的。`,
      `{S2}属性拉满的你，在{E2}方面真的没什么可挑剔的——主要是也没得挑。`,
      `别问我为什么这么{S3}，看看你的{So1}数值就懂了，简直{A1}到了极点。`,
      `你的{So2}表现证明了一件事：{A2}这种东西对你来说，就像{Ac1}一样随意。`,
      `{Ac2}风格的你，在{So3}方面{Ac3}得让人怀疑你是不是出厂设置就改过了。`,
    ],
    gentle: [
      `你带着{S1}的光芒，用{E1}温暖着周围的每一个人。`,
      `{S2}是你的天赋，而{E2}是你与生俱来的温柔。`,
      `你的{S3}和{So1}交织在一起，形成了独特的{A1}气质。`,
      `在{So2}的路上，你用{A2}守护着自己的初心。`,
      `{Ac2}如风，{Ac3}似水，你的{So3}就是最美的风景。`,
    ],
    philosophy: [
      `{S1}不仅是你的特质，更是你存在的证明。{E1}是灵魂的共鸣。`,
      `在{S2}与{E2}的辩证关系中，你找到了生命的平衡。`,
      `{S3}是个体化的过程，而{So1}是集体化的觉醒。这就是{A1}的奥秘。`,
      `{So2}不仅仅是行为，更是一种存在状态。{A2}是选择的艺术。`,
      `从{Ac2}到{Ac3}，这是意识进化的必然。{So3}是终极的自由。`,
    ],
    cyberpunk: [
      `>> 检测到异常人格{code}，{S1}参数超出阈值{E1}%。`,
      `> 神经回路分析：{S2}模块过载，{E2}信号异常。`,
      `>> 赛博意识矩阵：{S3}与{So1}形成量子纠缠，{A1}系数达到临界值。`,
      `> 社交协议解析：{So2}数据流不稳定，{A2}防火墙已激活。`,
      `>> 行动预测算法：{Ac2}路径计算中...{Ac3}完成。{So3}同步率100%。`,
    ],
    mixed: [
      `{S1}？那是你的标配。{E1}程度简直让人{S2}。`,
      `有时候{E2}过头了，但这就是{S3}的魅力。`,
      `{So1}和{A1}在你身上形成了奇妙的化学反应。`,
      `别太在意{So2}，毕竟{A2}才是你的真实写照。`,
      `{Ac2}也好，{Ac3}也罢，{So3}才是你最终的归宿。`,
    ],
  }

  const prefix = stylePrefixes[style][Math.floor(Math.random() * stylePrefixes[style].length)]
  const content = styleContent[style][Math.floor(Math.random() * styleContent[style].length)]

  let result = `${prefix} ${content}`

  for (const placeholder of placeholders) {
    if (Math.random() > 0.7) {
      result += ` 你的${placeholder}值很有趣。`
    }
  }

  return result
}

export const interpretations: InterpretationTemplate[] = []

for (const code of PERSONALITY_CODES) {
  for (const style of STYLES) {
    interpretations.push({
      personalityCode: code,
      style,
      template: generateTemplate(code, style),
    })
  }
}

export function getInterpretationsByPersonality(
  personalityCode: string,
  style?: InterpretationStyle,
): InterpretationTemplate[] {
  let filtered = interpretations.filter((t) => t.personalityCode === personalityCode)
  if (style) {
    filtered = filtered.filter((t) => t.style === style)
  }
  return filtered
}

export function getRandomInterpretation(
  personalityCode: string,
  style?: InterpretationStyle,
): InterpretationTemplate {
  const candidates = getInterpretationsByPersonality(personalityCode, style)
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function replaceDimensionPlaceholders(
  template: string,
  dimensionValues: Record<DimensionId, string>,
): string {
  let result = template
  for (const [dim, value] of Object.entries(dimensionValues)) {
    result = result.replace(new RegExp(`\\{${dim}\\}`, 'g'), value)
  }
  return result
}
