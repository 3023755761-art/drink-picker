// =====================================================
// IBA 鸡尾酒测试题 — 12题 × 8维度
// =====================================================
// 维度：
//   sweet / sour / strong / bitter / fruity / herbal / creamy / refreshing
// =====================================================

export const questions = [
  {
    id: 1,
    text: "推开酒吧的门，你心里想要的第一杯酒是什么样的？",
    options: [
      { label: "清爽解渴，带气泡那种", scores: { sweet: 0, sour: 1, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 3 } },
      { label: "纯烈酒，简简单单有劲儿", scores: { sweet: 0, sour: 0, strong: 3, bitter: 0, fruity: 0, herbal: 1, creamy: 0, refreshing: 0 } },
      { label: "甜的，最好带点果味", scores: { sweet: 3, sour: 0, strong: 0, bitter: 0, fruity: 1, herbal: 0, creamy: 0, refreshing: 0 } },
      { label: "有层次的，慢慢品那种", scores: { sweet: 0, sour: 0, strong: 1, bitter: 1, fruity: 0, herbal: 2, creamy: 0, refreshing: 0 } },
    ],
  },
  {
    id: 2,
    text: "甜度对你来说有多重要？",
    options: [
      { label: "很重要，最好像甜点一样", scores: { sweet: 4, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 1, refreshing: 0 } },
      { label: "微甜就行，过甜会腻", scores: { sweet: 2, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 0 } },
      { label: "一点甜就够", scores: { sweet: 1, sour: 1, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 0 } },
      { label: "不需要甜的，越干越好", scores: { sweet: 0, sour: 0, strong: 0, bitter: 2, fruity: 0, herbal: 1, creamy: 0, refreshing: 0 } },
    ],
  },
  {
    id: 3,
    text: "对柠檬/柑橘那种酸爽感的接受度？",
    options: [
      { label: "越酸越过瘾！柠檬汁直接加", scores: { sweet: 0, sour: 4, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 2 } },
      { label: "酸甜平衡最舒服", scores: { sweet: 1, sour: 2, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 0 } },
      { label: "不太吃酸，偏好柔和口感", scores: { sweet: 1, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 2, refreshing: 0 } },
    ],
  },
  {
    id: 4,
    text: "酒精感要多强？",
    options: [
      { label: "低度清爽，能喝一晚上不醉", scores: { sweet: 0, sour: 0, strong: 0, bitter: 0, fruity: 1, herbal: 0, creamy: 0, refreshing: 3 } },
      { label: "中度的，有微醺的快乐", scores: { sweet: 1, sour: 0, strong: 2, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 0 } },
      { label: "越高越好，要的就是上头", scores: { sweet: 0, sour: 0, strong: 4, bitter: 1, fruity: 0, herbal: 0, creamy: 0, refreshing: 0 } },
      { label: "不太在乎，主要是看风味搭配", scores: { sweet: 0, sour: 0, strong: 1, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 1 } },
    ],
  },
  {
    id: 5,
    text: "苦味在你的世界里是什么位置？",
    options: [
      { label: "越苦越有层次感，Negroni那种完美", scores: { sweet: 0, sour: 0, strong: 0, bitter: 4, fruity: 0, herbal: 2, creamy: 0, refreshing: 0 } },
      { label: "适度的苦可以接受，增加深度", scores: { sweet: 0, sour: 0, strong: 0, bitter: 2, fruity: 0, herbal: 1, creamy: 0, refreshing: 0 } },
      { label: "不喜欢苦的，要甜蜜顺滑", scores: { sweet: 2, sour: 0, strong: 0, bitter: 0, fruity: 2, herbal: 0, creamy: 0, refreshing: 0 } },
    ],
  },
  {
    id: 6,
    text: "水果风味偏好——选一个最对胃口的？",
    options: [
      { label: "热带水果：菠萝、芒果、百香果", scores: { sweet: 2, sour: 0, strong: 0, bitter: 0, fruity: 4, herbal: 0, creamy: 0, refreshing: 1 } },
      { label: "柑橘系：柠檬、橙子、葡萄柚", scores: { sweet: 0, sour: 1, strong: 0, bitter: 0, fruity: 3, herbal: 0, creamy: 0, refreshing: 2 } },
      { label: "莓果系：覆盆子、黑莓、草莓", scores: { sweet: 1, sour: 1, strong: 0, bitter: 0, fruity: 3, herbal: 0, creamy: 0, refreshing: 0 } },
      { label: "不需要果味，纯酒本味就很好", scores: { sweet: 0, sour: 0, strong: 2, bitter: 1, fruity: 0, herbal: 1, creamy: 0, refreshing: 0 } },
    ],
  },
  {
    id: 7,
    text: "薄荷、姜、肉桂这些草本/香料风味——你怎么看？",
    options: [
      { label: "喜欢薄荷、罗勒类清新草本", scores: { sweet: 0, sour: 0, strong: 0, bitter: 0, fruity: 1, herbal: 3, creamy: 0, refreshing: 2 } },
      { label: "喜欢姜、肉桂、豆蔻等温暖辛香", scores: { sweet: 0, sour: 0, strong: 1, bitter: 0, fruity: 0, herbal: 3, creamy: 0, refreshing: 0 } },
      { label: "喜欢茴香、龙胆这类复杂草药", scores: { sweet: 0, sour: 0, strong: 0, bitter: 1, fruity: 0, herbal: 4, creamy: 0, refreshing: 0 } },
      { label: "不太喜欢这些味道，简单点好", scores: { sweet: 1, sour: 0, strong: 0, bitter: 0, fruity: 2, herbal: 0, creamy: 0, refreshing: 0 } },
    ],
  },
  {
    id: 8,
    text: "奶香、丝滑绵密的口感——你爱吗？",
    options: [
      { label: "超爱！绵密奶香是天赐", scores: { sweet: 2, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 4, refreshing: 0 } },
      { label: "有一点奶感就好，不用太多", scores: { sweet: 0, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 2, refreshing: 0 } },
      { label: "完全不要奶味，清透利落才是王道", scores: { sweet: 0, sour: 1, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 2 } },
    ],
  },
  {
    id: 9,
    text: "气泡/碳酸感对你来说——",
    options: [
      { label: "必须有气泡才叫爽！", scores: { sweet: 0, sour: 1, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 3 } },
      { label: "有无皆可，不太在意", scores: { sweet: 0, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 1 } },
      { label: "不喜欢气泡，偏好静饮", scores: { sweet: 1, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 1, refreshing: 0 } },
    ],
  },
  {
    id: 10,
    text: "你喝这杯酒最可能是什么场景？",
    options: [
      { label: "炎炎夏日，解暑第一", scores: { sweet: 0, sour: 0, strong: 0, bitter: 0, fruity: 1, herbal: 0, creamy: 0, refreshing: 3 } },
      { label: "冬夜小酌，暖身驱寒", scores: { sweet: 1, sour: 0, strong: 2, bitter: 0, fruity: 0, herbal: 1, creamy: 0, refreshing: 0 } },
      { label: "餐前开胃，唤醒味蕾", scores: { sweet: 0, sour: 0, strong: 0, bitter: 2, fruity: 0, herbal: 1, creamy: 0, refreshing: 1 } },
      { label: "餐后甜点收尾", scores: { sweet: 3, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 2, refreshing: 0 } },
    ],
  },
  {
    id: 11,
    text: "更看重一杯酒的哪个特质？",
    options: [
      { label: "入口顺滑，轻松易饮", scores: { sweet: 1, sour: 0, strong: 0, bitter: 0, fruity: 0, herbal: 0, creamy: 1, refreshing: 1 } },
      { label: "层次丰富，细细品味", scores: { sweet: 0, sour: 0, strong: 1, bitter: 1, fruity: 0, herbal: 2, creamy: 0, refreshing: 0 } },
      { label: "经典可靠，怎么喝都对", scores: { sweet: 1, sour: 0, strong: 1, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 0 } },
      { label: "新奇有趣，每次都有惊喜", scores: { sweet: 0, sour: 1, strong: 0, bitter: 0, fruity: 1, herbal: 1, creamy: 0, refreshing: 0 } },
    ],
  },
  {
    id: 12,
    text: "在朋友眼里，你的口味通常被形容为什么？",
    options: [
      { label: "「甜食控」——谁能拒绝糖呢", scores: { sweet: 3, sour: 0, strong: 0, bitter: 0, fruity: 1, herbal: 0, creamy: 1, refreshing: 0 } },
      { label: "「重口味」——越烈越苦越过瘾", scores: { sweet: 0, sour: 0, strong: 2, bitter: 2, fruity: 0, herbal: 1, creamy: 0, refreshing: 0 } },
      { label: "「小清新」——清爽果味才是正道", scores: { sweet: 0, sour: 1, strong: 0, bitter: 0, fruity: 1, herbal: 0, creamy: 0, refreshing: 3 } },
      { label: "「什么都喝」——没有特别偏好", scores: { sweet: 1, sour: 0, strong: 1, bitter: 0, fruity: 0, herbal: 0, creamy: 0, refreshing: 1 } },
    ],
  },
];
