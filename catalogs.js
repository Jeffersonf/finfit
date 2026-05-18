const FinfitCatalogs = (() => {
const presets = [
  { type: "academia", label: "Academia", defaultName: "Academia - forca", duration: 60 },
  { type: "natacao", label: "Natacao", defaultName: "Natacao", duration: 45 },
  { type: "futevolei", label: "Futevolei", defaultName: "Futevolei", duration: 90 },
  { type: "corrida", label: "Corrida", defaultName: "Corrida", duration: 40 },
  { type: "mobilidade", label: "Mobilidade", defaultName: "Mobilidade", duration: 25 },
  { type: "outro", label: "Outro", defaultName: "Treino livre", duration: 50 }
];

const activityContexts = {
  academia: {
    title: "Musculacao completa",
    text: "Escolha o grupo muscular para ver sugestoes, historico filtrado e o que registrar no treino.",
    categories: [
      { id: "peito", icon: "🏋️", label: "Peito", match: /peito|supino|crucifixo|crossover|voador|paralela/i, plans: [
        ["Peito forca", "Supino reto 5x5\nSupino inclinado 4x6\nParalela 3x8\nTriceps corda 3x12"],
        ["Peito hipertrofia", "Supino inclinado 4x8\nCrucifixo 3x12\nCrossover 3x15\nFlexao 2xmax"]
      ] },
      { id: "costas", icon: "🧲", label: "Costas", match: /costas|remada|puxada|barra|pulldown|serrote/i, plans: [
        ["Costas densidade", "Remada curvada 4x8\nPuxada aberta 4x10\nRemada baixa 3x12\nFace pull 3x15"],
        ["Costas forca", "Barra fixa 5x5\nRemada unilateral 4x8\nPulldown 3x10\nHiperextensao 3x12"]
      ] },
      { id: "pernas", icon: "🦵", label: "Pernas", match: /perna|agach|leg|terra|stiff|cadeira|mesa|panturrilha|posterior|quadriceps/i, plans: [
        ["Pernas base", "Agachamento 4x6\nLeg press 4x10\nStiff 3x8\nPanturrilha 4x12"],
        ["Posterior e gluteo", "Terra romeno 4x8\nMesa flexora 4x10\nAvanco 3x10\nAbdutora 3x15"]
      ] },
      { id: "ombros", icon: "🎯", label: "Ombros", match: /ombro|desenvolvimento|eleva|lateral|posterior/i, plans: [
        ["Ombros completo", "Desenvolvimento 4x6\nElevacao lateral 4x12\nCrucifixo inverso 3x15\nEncolhimento 3x12"]
      ] },
      { id: "bracos", icon: "💪", label: "Bracos", match: /braco|rosca|biceps|triceps|martelo|frances/i, plans: [
        ["Bracos volume", "Rosca direta 4x8\nTriceps testa 4x10\nRosca martelo 3x12\nTriceps corda 3x15"]
      ] },
      { id: "core", icon: "🧱", label: "Core", match: /core|abdomen|prancha|abdominal|anti/i, plans: [
        ["Core estabilidade", "Prancha 4x40s\nDead bug 3x10\nPallof press 3x12\nAbdominal reverso 3x12"]
      ] }
    ]
  },
  corrida: {
    title: "Corrida completa",
    text: "Separe base, longo, intensidade e recuperacao para o Finfit agir como um diario de corrida privado.",
    categories: [
      { id: "base", icon: "🌿", label: "Base", match: /base|z2|leve|facil|aerob/i, plans: [["Rodagem Z2", "40min leve\nPace confortavel\nRPE 4-5\nRegistrar distancia e dor"]] },
      { id: "longo", icon: "🛣️", label: "Longo", match: /longo|longao|endurance/i, plans: [["Longo controlado", "60-75min facil\nSem sprint final\nNutrir antes\nRegistrar rota"]] },
      { id: "ritmo", icon: "📈", label: "Ritmo", match: /ritmo|tempo|progressivo|controlado/i, plans: [["Progressivo curto", "15min facil\n3x6min moderado\n2min leve\n10min solto"]] },
      { id: "tiros", icon: "⚡", label: "Tiros", match: /tiro|interval|vo2|400|800|forte/i, plans: [["Tiros curtos", "12min aquecer\n8x400m forte\n200m trote\n10min solto"]] },
      { id: "recuperacao", icon: "🧘", label: "Recuperacao", match: /recuper|solto|regenerativo|leve/i, plans: [["Regenerativo", "20-30min muito leve\nSem olhar pace\nMobilidade posterior"]] }
    ]
  },
  natacao: {
    title: "Natacao por objetivo",
    text: "Filtre tecnica, volume e ritmo para acompanhar metragem e qualidade.",
    categories: [
      { id: "tecnica", icon: "🌊", label: "Tecnica", match: /tecnica|educativo|respiracao|crawl/i, plans: [["Tecnica crawl", "300m solto\n8x50m educativo\n6x50m crawl\n200m solto"]] },
      { id: "volume", icon: "📏", label: "Volume", match: /volume|endurance|resistencia|longo/i, plans: [["Volume continuo", "600m solto\n4x200m moderado\n300m solto"]] },
      { id: "ritmo", icon: "⏱️", label: "Ritmo", match: /ritmo|forte|tiro|100/i, plans: [["Ritmo 100m", "400m solto\n8x100m ritmo\n200m leve"]] }
    ]
  },
  futevolei: {
    title: "Futevolei por contexto",
    text: "Separe tecnica, jogo e competicao para entender dupla, local e intensidade.",
    categories: [
      { id: "tecnica", icon: "🎯", label: "Tecnica", match: /tecnica|saque|recepcao|ataque|defesa/i, plans: [["Tecnica fundamentos", "15min aquecer\n20min recepcao\n20min ataque\n10min saque"]] },
      { id: "jogo", icon: "🏐", label: "Jogo", match: /jogo|partida|dupla|resultado/i, plans: [["Jogo controlado", "3 jogos\nAnotar dupla\nResultado\nPonto forte/fraco"]] },
      { id: "competicao", icon: "🏆", label: "Competicao", match: /torneio|competicao|ranking/i, plans: [["Dia competitivo", "Aquecimento completo\nAnotar adversarios\nPlacar\nEnergia final"]] }
    ]
  },
  mobilidade: {
    title: "Mobilidade por area",
    text: "Use como ferramenta de recuperacao para manter dor e amplitude no radar.",
    categories: [
      { id: "quadril", icon: "🦿", label: "Quadril", match: /quadril|gluteo|posterior/i, plans: [["Quadril livre", "90/90 3min\nFlexor 3min\nPosterior 4min\nRespiracao 3min"]] },
      { id: "ombro", icon: "🪽", label: "Ombro", match: /ombro|escapula|toracica/i, plans: [["Ombro leve", "Toracica 5min\nRotacao externa 3x12\nAlongamento peitoral 3min"]] },
      { id: "tornozelo", icon: "🦶", label: "Tornozelo", match: /tornozelo|panturrilha|pe/i, plans: [["Tornozelo corrida", "Mobilidade parede 4min\nPanturrilha 3min\nPe curto 3x12"]] }
    ]
  }
};

const weekDays = [
  { key: 1, label: "Seg" },
  { key: 2, label: "Ter" },
  { key: 3, label: "Qua" },
  { key: 4, label: "Qui" },
  { key: 5, label: "Sex" },
  { key: 6, label: "Sab" },
  { key: 0, label: "Dom" }
];

const foodCatalog = [
  { id: "arroz-frango", name: "Arroz + frango", serving: "1 prato", calories: 520, protein: 42, carbs: 58, fat: 12 },
  { id: "ovo", name: "Ovo inteiro", serving: "2 un", calories: 140, protein: 12, carbs: 1, fat: 10 },
  { id: "banana", name: "Banana", serving: "1 un", calories: 90, protein: 1, carbs: 23, fat: 0 },
  { id: "whey", name: "Whey protein", serving: "1 scoop", calories: 120, protein: 24, carbs: 3, fat: 2 },
  { id: "aveia", name: "Aveia", serving: "40g", calories: 150, protein: 5, carbs: 27, fat: 3 },
  { id: "iogurte", name: "Iogurte natural", serving: "170g", calories: 120, protein: 9, carbs: 12, fat: 4 },
  { id: "macarrao", name: "Macarrao + carne", serving: "1 prato", calories: 680, protein: 38, carbs: 82, fat: 20 },
  { id: "salada", name: "Salada completa", serving: "1 bowl", calories: 240, protein: 12, carbs: 22, fat: 12 },
  { id: "custom", name: "Personalizado", serving: "manual", calories: 0, protein: 0, carbs: 0, fat: 0 }
];

const dailyCheckItems = [
  { id: "academia", type: "academia", icon: "💪", label: "Musculacao", duration: 60, intensity: "moderado", focus: "geral" },
  { id: "corrida", type: "corrida", icon: "🏃", label: "Corrida", duration: 35, intensity: "moderado", focus: "base" },
  { id: "natacao", type: "natacao", icon: "🏊", label: "Natacao", duration: 45, intensity: "moderado", focus: "tecnica" },
  { id: "futevolei", type: "futevolei", icon: "🏐", label: "Futevolei", duration: 90, intensity: "forte", focus: "jogo" },
  { id: "mobilidade", type: "mobilidade", icon: "🧘", label: "Mobilidade", duration: 20, intensity: "leve", focus: "recuperacao" }
];

const dailyFoodItems = ["banana", "whey", "ovo", "arroz-frango"];

const dailyBodyItems = [
  { id: "sono", label: "Sono bom", patch: { sleep: 7.5, energy: 8, pain: 1, stress: 3, mood: 8 } },
  { id: "cansado", label: "Cansado", patch: { sleep: 5.5, energy: 4, pain: 2, stress: 6, mood: 5 } },
  { id: "dor", label: "Com dor", patch: { energy: 5, pain: 6, stress: 4, mood: 5, painAreas: "registrar area" } },
  { id: "ok", label: "Corpo ok", patch: { sleep: 7, energy: 7, pain: 0, stress: 3, mood: 7 } }
];

const baseTemplates = [
  { id: "tpl-upper", name: "Upper strength", type: "academia", detail: "Supino, remada, desenvolvimento, puxada e acessorios." },
  { id: "tpl-swim", name: "Natacao tecnica", type: "natacao", detail: "Aquecimento, educativos, tiros curtos e soltura." },
  { id: "tpl-futevolei", name: "Futevolei competitivo", type: "futevolei", detail: "Aquecimento, fundamentos, jogo e nota de intensidade." },
  { id: "tpl-z2", name: "Cardio zona 2", type: "corrida", detail: "Base aerobica leve com respiracao controlada." },
  { id: "tpl-mob", name: "Mobilidade recuperativa", type: "mobilidade", detail: "Quadril, toracica, tornozelo, ombro e respiracao." }
];

  return {
    presets,
    activityContexts,
    weekDays,
    foodCatalog,
    dailyCheckItems,
    dailyFoodItems,
    dailyBodyItems,
    baseTemplates
  };
})();

window.FinfitCatalogs = FinfitCatalogs;
