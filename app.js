const STORAGE_KEY = "finfit.state.v2";
const LEGACY_WORKOUTS_KEY = "finfit.workouts.v1";
const AUTO_BACKUP_KEY = "finfit.autoBackups.v1";
const ACTIVE_SESSION_KEY = "finfit.activeSession.v1";
const APPEARANCE_KEY = "finfit.appearance.v4";
const SPORT_FILTER_KEY = "finfit.sportFilter.v1";
const DB_NAME = "finfit-db";
const DB_VERSION = 1;

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

const seedState = {
  workouts: [
    { id: "seed-1", type: "academia", name: "Academia - peito e costas", date: "2026-05-11", duration: 70, intensity: "forte", status: "feito", rpe: 8, energy: 8, pain: 1, distance: "", volume: 9200, focus: "peito costas", location: "academia", note: "boa carga, sem dor", details: "supino 4x8 70kg\nremada 4x10 60kg\ndesenvolvimento 3x8 32kg" },
    { id: "seed-2", type: "natacao", name: "Natacao tecnica", date: "2026-05-13", duration: 45, intensity: "moderado", status: "feito", rpe: 6, energy: 7, pain: 0, distance: 1500, volume: 1500, focus: "respiracao", location: "piscina", note: "respiracao melhorou", details: "400m solto\n8x50m tecnica\n300m moderado" },
    { id: "seed-3", type: "futevolei", name: "Futevolei", date: "2026-05-15", duration: 90, intensity: "forte", status: "feito", rpe: 8, energy: 8, pain: 2, distance: "", volume: "", focus: "jogo", location: "praia", note: "jogo intenso", details: "parceiro Joao\n3 jogos\nresultado 2x1" }
  ],
  bodyLogs: [
    { id: "body-1", date: "2026-05-14", weight: 82.4, sleep: 7, energy: 8, pain: 1, stress: 3, nutrition: 8, mood: 8, waist: 86, chest: 102, hip: 98, painAreas: "ombro leve", note: "recuperacao boa" },
    { id: "body-2", date: "2026-05-15", weight: 82.1, sleep: 6.5, energy: 7, pain: 2, stress: 4, nutrition: 7, mood: 7, waist: 85.8, chest: 102, hip: 98, painAreas: "perna", note: "ombro ok, perna pesada" }
  ],
  foodLogs: [
    { id: "food-1", date: "2026-05-16", meal: "Almoço", foodId: "arroz-frango", name: "Arroz + frango", servings: 1, calories: 520, protein: 42, carbs: 58, fat: 12, note: "base pos-treino" },
    { id: "food-2", date: "2026-05-16", meal: "Lanche", foodId: "whey", name: "Whey protein", servings: 1, calories: 120, protein: 24, carbs: 3, fat: 2, note: "" }
  ],
  nutritionGoals: { calories: 2400, protein: 160, water: 3000 },
  favorites: [],
  templates: baseTemplates,
  seasons: [
    { id: "season-1", name: "Base pessoal", objective: "condicionamento", start: "2026-05-11", end: "2026-06-21", sessionsPerWeek: 5, note: "manter academia, natacao e futevolei sem exagerar carga" }
  ],
  importMode: "merge"
};

let state = loadState();
let selectedPreset = presets[0];
let pendingImport = [];
let pendingImportErrors = [];
let activeSession = loadActiveSession();
let timerInterval = null;
let activeSportFilter = loadSportFilter();
let activeActivityCategory = "todos";
let selectedDailyWorkoutId = "";
let dataHealth = {
  driver: "localStorage",
  indexedDb: "pendente",
  lastSavedAt: "",
  storageBytes: 0,
  migrated: false,
  error: ""
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadSportFilter() {
  const saved = localStorage.getItem(SPORT_FILTER_KEY) || "todos";
  return saved === "todos" || presets.some((preset) => preset.type === saved) ? saved : "todos";
}

function setSportFilter(type) {
  activeSportFilter = type === "todos" ? "todos" : normalizeType(type);
  activeActivityCategory = "todos";
  localStorage.setItem(SPORT_FILTER_KEY, activeSportFilter);
  if ($("#typeFilter")) {
    $("#typeFilter").dataset.value = activeSportFilter === "todos" ? "" : activeSportFilter;
  }
  render();
}

function scopedWorkouts(items = state.workouts) {
  return activeSportFilter === "todos" ? items : items.filter((workout) => workout.type === activeSportFilter);
}

function sportIcon(type) {
  return {
    todos: "◎",
    academia: "💪",
    natacao: "🏊",
    futevolei: "🏐",
    corrida: "🏃",
    mobilidade: "🧘",
    outro: "✦"
  }[type] || "✦";
}

function loadAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem(APPEARANCE_KEY));
    return { theme: "light", accent: "purple", ...saved };
  } catch {
    return { theme: "light", accent: "purple" };
  }
}

function applyAppearance(appearance = loadAppearance()) {
  const theme = ["dark", "black", "light"].includes(appearance.theme) ? appearance.theme : "dark";
  const accent = ["lime", "teal", "purple", "amber"].includes(appearance.accent) ? appearance.accent : "lime";
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.accent = accent;
  const meta = $("#themeColorMeta");
  if (meta) meta.content = theme === "black" ? "#0b0d10" : theme === "dark" ? "#10141a" : "#efeee9";
  const themeButton = $("#themeToggleButton");
  if (themeButton) themeButton.textContent = theme === "light" ? "🌙" : theme === "black" ? "☀️" : "⚫";
  const themeSelect = $("#themeSelect");
  const accentSelect = $("#accentSelect");
  if (themeSelect) themeSelect.value = theme;
  if (accentSelect) accentSelect.value = accent;
  $$("[data-accent-choice]").forEach((button) => button.classList.toggle("active", button.dataset.accentChoice === accent));
}

function saveAppearance(patch) {
  const next = { ...loadAppearance(), ...patch };
  localStorage.setItem(APPEARANCE_KEY, JSON.stringify(next));
  applyAppearance(next);
}

const fields = {
  id: $("#workoutId"),
  name: $("#workoutName"),
  date: $("#workoutDate"),
  duration: $("#workoutDuration"),
  intensity: $("#workoutIntensity"),
  status: $("#workoutStatus"),
  rpe: $("#workoutRpe"),
  energy: $("#workoutEnergy"),
  pain: $("#workoutPain"),
  distance: $("#workoutDistance"),
  volume: $("#workoutVolume"),
  focus: $("#workoutFocus"),
  location: $("#workoutLocation"),
  note: $("#workoutNote"),
  details: $("#workoutDetails")
};

const bodyFields = {
  id: $("#bodyId"),
  date: $("#bodyDate"),
  weight: $("#bodyWeight"),
  sleep: $("#bodySleep"),
  energy: $("#bodyEnergy"),
  pain: $("#bodyPain"),
  stress: $("#bodyStress"),
  nutrition: $("#bodyNutrition"),
  mood: $("#bodyMood"),
  waist: $("#bodyWaist"),
  chest: $("#bodyChest"),
  hip: $("#bodyHip"),
  painAreas: $("#bodyPainAreas"),
  note: $("#bodyNote")
};

const foodFields = {
  id: $("#foodId"),
  date: $("#foodDate"),
  meal: $("#foodMeal"),
  catalog: $("#foodCatalogSelect"),
  servings: $("#foodServings"),
  calories: $("#foodCalories"),
  protein: $("#foodProtein"),
  carbs: $("#foodCarbs"),
  fat: $("#foodFat"),
  note: $("#foodNote")
};

const seasonFields = {
  id: $("#seasonId"),
  name: $("#seasonName"),
  objective: $("#seasonObjective"),
  start: $("#seasonStart"),
  end: $("#seasonEnd"),
  sessionsPerWeek: $("#seasonSessions"),
  note: $("#seasonNote")
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return withDefaults(saved);
  } catch {
    // ignore broken state and fall back
  }

  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_WORKOUTS_KEY)) || [];
    if (legacy.length) return withDefaults({ ...seedState, workouts: legacy.map(normalizeWorkout) });
  } catch {
    // ignore legacy errors
  }

  return withDefaults(seedState);
}

function withDefaults(value) {
  return {
    workouts: (value.workouts || []).map(normalizeWorkout),
    bodyLogs: (value.bodyLogs || []).map(normalizeBodyLog),
    foodLogs: (value.foodLogs || []).map(normalizeFoodLog),
    nutritionGoals: normalizeNutritionGoals(value.nutritionGoals || {}),
    favorites: value.favorites || [],
    templates: value.templates?.length ? value.templates : baseTemplates,
    seasons: (value.seasons || []).map(normalizeSeason),
    importMode: value.importMode || "merge"
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateStorageHealth();
  saveStateToIndexedDb();
  maybeCreateAutoBackup();
}

function openFinfitDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB indisponivel"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbSet(key, value) {
  const db = await openFinfitDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put(value, key);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function idbGet(key) {
  const db = await openFinfitDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readonly");
    const request = tx.objectStore("kv").get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

function saveStateToIndexedDb() {
  const payload = { version: 1, updatedAt: new Date().toISOString(), state };
  idbSet("state", payload)
    .then(() => {
      dataHealth.indexedDb = "ativo";
      dataHealth.driver = "localStorage + IndexedDB";
      dataHealth.lastSavedAt = payload.updatedAt;
      dataHealth.error = "";
      renderDataHealth();
    })
    .catch((error) => {
      dataHealth.indexedDb = "erro";
      dataHealth.error = error?.message || "Falha ao salvar IndexedDB";
      renderDataHealth();
    });
}

async function bootstrapDurableState() {
  try {
    const payload = await idbGet("state");
    if (!payload?.state) {
      await idbSet("state", { version: 1, updatedAt: new Date().toISOString(), state });
      dataHealth.migrated = true;
    }
    dataHealth.indexedDb = "ativo";
    dataHealth.driver = "localStorage + IndexedDB";
    dataHealth.lastSavedAt = payload?.updatedAt || new Date().toISOString();
  } catch (error) {
    dataHealth.indexedDb = "indisponivel";
    dataHealth.error = error?.message || "IndexedDB indisponivel";
  }
  updateStorageHealth();
  renderDataHealth();
}

async function restoreStateFromIndexedDb() {
  try {
    const payload = await idbGet("state");
    if (!payload?.state) {
      $("#dataHint").textContent = "IndexedDB ainda nao tem um estado salvo para restaurar.";
      return;
    }
    state = withDefaults(payload.state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    dataHealth.lastSavedAt = payload.updatedAt || new Date().toISOString();
    dataHealth.driver = "restaurado de IndexedDB";
    $("#dataHint").textContent = "Estado restaurado do IndexedDB.";
    render();
  } catch (error) {
    $("#dataHint").textContent = `Nao consegui restaurar IndexedDB: ${error?.message || "erro desconhecido"}.`;
  }
}

function updateStorageHealth() {
  try {
    dataHealth.storageBytes = new Blob([localStorage.getItem(STORAGE_KEY) || ""]).size;
  } catch {
    dataHealth.storageBytes = 0;
  }
}

function loadAutoBackups() {
  try {
    return JSON.parse(localStorage.getItem(AUTO_BACKUP_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAutoBackups(backups) {
  localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(backups.slice(-7)));
}

function createAutoBackup(reason = "auto") {
  const backups = loadAutoBackups();
  backups.push({
    id: uid("backup"),
    reason,
    createdAt: new Date().toISOString(),
    state
  });
  saveAutoBackups(backups);
}

function maybeCreateAutoBackup() {
  const backups = loadAutoBackups();
  const last = backups.at(-1);
  const lastTime = last ? new Date(last.createdAt).getTime() : 0;
  const hours = (Date.now() - lastTime) / 36e5;
  if (!last || hours >= 12) createAutoBackup("auto");
}

function latestAutoBackup() {
  return loadAutoBackups().at(-1);
}

function loadActiveSession() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function saveActiveSession() {
  if (activeSession) localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));
  else localStorage.removeItem(ACTIVE_SESSION_KEY);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key] || "outro";
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
}

function numberOrBlank(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value !== "" && value !== null && value !== undefined ? parsed : "";
}

function presetLabel(type) {
  return presets.find((preset) => preset.type === type)?.label || "Treino";
}

function normalizeType(value) {
  const raw = String(value || "outro").trim().toLowerCase();
  const normalized = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const aliases = {
    musculacao: "academia",
    gym: "academia",
    swim: "natacao",
    natacao: "natacao",
    futebol: "futevolei",
    futevolei: "futevolei",
    run: "corrida",
    running: "corrida",
    corrida: "corrida",
    mobilidade: "mobilidade"
  };
  const type = aliases[normalized] || aliases[raw] || normalized;
  return presets.some((preset) => preset.type === type) ? type : "outro";
}

function normalizeWorkout(item) {
  const type = normalizeType(item.type || item.modalidade || item.tipo);
  const duration = Number(item.duration || item.duracao || item.duração || item.tempo || item.minutes || 0);
  const intensity = String(item.intensity || item.intensidade || "moderado").trim().toLowerCase();
  const status = String(item.status || "feito").trim().toLowerCase();

  return {
    id: item.id || uid("workout"),
    type,
    name: String(item.name || item.nome || presetLabel(type)).trim(),
    date: String(item.date || item.data || todayIso()).slice(0, 10),
    duration: Number.isFinite(duration) && duration > 0 ? duration : 30,
    intensity: ["leve", "moderado", "forte", "maximo"].includes(intensity) ? intensity : "moderado",
    status: ["feito", "planejado", "parcial", "pulado"].includes(status) ? status : "feito",
    rpe: numberOrBlank(item.rpe),
    energy: numberOrBlank(item.energy || item.energia),
    pain: numberOrBlank(item.pain || item.dor),
    distance: numberOrBlank(item.distance || item.distancia || item.distância),
    volume: numberOrBlank(item.volume || item.carga || item.metragem),
    focus: String(item.focus || item.foco || "").trim(),
    location: String(item.location || item.local || "").trim(),
    note: String(item.note || item.notes || item.observacao || item.observação || item.nota || "").trim(),
    details: String(item.details || item.detalhes || item.series || item.blocos || "").trim(),
    route: normalizeRoute(item.route || item.rota)
  };
}

function normalizeRoute(route) {
  if (!route || typeof route !== "object") return null;
  const splits = Array.isArray(route.splits) ? route.splits.map((split, index) => ({
    km: Number(split.km || index + 1),
    pace: Number(split.pace || 0),
    duration: Number(split.duration || 0)
  })).filter((split) => split.duration > 0 || split.pace > 0).slice(0, 80) : [];
  const points = Array.isArray(route.points) ? route.points.map((point) => ({
    lat: Number(point.lat),
    lon: Number(point.lon)
  })).filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon)).slice(0, 120) : [];
  return {
    source: String(route.source || "manual"),
    elevationGain: Number(route.elevationGain || 0),
    splits,
    points
  };
}

function normalizeBodyLog(item) {
  return {
    id: item.id || uid("body"),
    date: String(item.date || item.data || todayIso()).slice(0, 10),
    weight: numberOrBlank(item.weight || item.peso),
    sleep: numberOrBlank(item.sleep || item.sono),
    energy: numberOrBlank(item.energy || item.energia),
    pain: numberOrBlank(item.pain || item.dor),
    stress: numberOrBlank(item.stress || item.estresse),
    nutrition: numberOrBlank(item.nutrition || item.nutricao || item.nutri),
    mood: numberOrBlank(item.mood || item.humor),
    waist: numberOrBlank(item.waist || item.cintura),
    chest: numberOrBlank(item.chest || item.peito),
    hip: numberOrBlank(item.hip || item.quadril),
    painAreas: String(item.painAreas || item.pain_areas || item.areasDor || item.areas_dor || "").trim(),
    note: String(item.note || item.nota || "").trim()
  };
}

function normalizeFoodLog(item) {
  const catalog = foodCatalog.find((food) => food.id === item.foodId) || foodCatalog.find((food) => food.name === item.name) || foodCatalog.at(-1);
  const servings = Math.max(0.25, Number(item.servings || item.porcoes || 1));
  const baseCalories = Number(item.calories ?? item.calorias ?? catalog.calories);
  const baseProtein = Number(item.protein ?? item.proteina ?? catalog.protein);
  const baseCarbs = Number(item.carbs ?? item.carbo ?? item.carboidratos ?? catalog.carbs);
  const baseFat = Number(item.fat ?? item.gordura ?? catalog.fat);
  return {
    id: item.id || uid("food"),
    date: String(item.date || item.data || todayIso()).slice(0, 10),
    meal: String(item.meal || item.refeicao || "Lanche").trim(),
    foodId: String(item.foodId || catalog.id),
    name: String(item.name || item.nome || catalog.name).trim(),
    servings,
    calories: Math.round((Number.isFinite(baseCalories) ? baseCalories : 0) * servings),
    protein: Math.round(((Number.isFinite(baseProtein) ? baseProtein : 0) * servings) * 10) / 10,
    carbs: Math.round(((Number.isFinite(baseCarbs) ? baseCarbs : 0) * servings) * 10) / 10,
    fat: Math.round(((Number.isFinite(baseFat) ? baseFat : 0) * servings) * 10) / 10,
    note: String(item.note || item.nota || "").trim()
  };
}

function normalizeNutritionGoals(item) {
  return {
    calories: Math.max(1000, Number(item.calories || item.calorias || 2400)),
    protein: Math.max(0, Number(item.protein || item.proteina || 160)),
    water: Math.max(0, Number(item.water || item.agua || 3000))
  };
}

function normalizeSeason(item) {
  const sessions = Number(item.sessionsPerWeek || item.sessions || item.sessoes || 5);
  return {
    id: item.id || uid("season"),
    name: String(item.name || item.nome || "Temporada").trim(),
    objective: String(item.objective || item.objetivo || "condicionamento").trim(),
    start: String(item.start || item.inicio || todayIso()).slice(0, 10),
    end: String(item.end || item.fim || offsetDate(42)).slice(0, 10),
    sessionsPerWeek: Number.isFinite(sessions) && sessions > 0 ? sessions : 5,
    note: String(item.note || item.nota || "").trim()
  };
}

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function currentWeekWorkouts() {
  const now = new Date();
  const start = new Date(now);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return state.workouts.filter((workout) => {
    const date = new Date(`${workout.date}T12:00:00`);
    return date >= start && date < end;
  });
}

function workoutLoad(workout) {
  const rpe = Number(workout.rpe || intensityToRpe(workout.intensity));
  return Math.round(Number(workout.duration || 0) * rpe);
}

function intensityToRpe(intensity) {
  return { leve: 4, moderado: 6, forte: 8, maximo: 10 }[intensity] || 6;
}

function latestBodyLog() {
  return [...state.bodyLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
}

function readiness() {
  const body = latestBodyLog();
  const weekLoad = currentWeekWorkouts().reduce((sum, item) => sum + workoutLoad(item), 0);
  const pain = Number(body?.pain || 0);
  const energy = Number(body?.energy || 7);
  const sleep = Number(body?.sleep || 7);
  const stress = Number(body?.stress || 0);
  const nutrition = Number(body?.nutrition || 7);
  const mood = Number(body?.mood || 7);
  const loadPenalty = Math.min(22, Math.round(weekLoad / 180));
  const score = Math.max(25, Math.min(98, 48 + energy * 3 + sleep * 2 + nutrition * 1.5 + mood - pain * 5 - stress * 2 - loadPenalty));
  return Math.round(score);
}

function recommendation() {
  const week = currentWeekWorkouts().filter((item) => item.status !== "pulado");
  const types = new Set(week.map((item) => item.type));
  const score = readiness();
  const last = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date))[0];

  if (score < 55) return ["Baixar carga e priorizar recuperacao.", "A prontidao esta baixa. Mobilidade, natacao leve ou descanso ativo parecem melhores hoje."];
  if (!types.has("academia")) return ["Falta forca na semana.", "Um treino curto de academia ajuda a manter estrutura sem depender so de esportes."];
  if (!types.has("natacao")) return ["Natacao encaixa bem agora.", "Ela soma cardio e tecnica com menor impacto, boa ponte entre academia e futevolei."];
  if (!types.has("futevolei")) return ["Semana ainda sem futevolei.", "Se o corpo estiver bem, registre ou planeje uma sessao tecnica/jogo."];
  if (last?.rpe >= 8) return ["Depois de carga alta, controle o proximo treino.", "Mantenha intensidade moderada e registre dor/energia para comparar depois."];
  return ["Semana equilibrada.", "Siga registrando detalhes pequenos: eles vao alimentar progresso, dores e recomendacoes."];
}

function setPage(page) {
  document.documentElement.dataset.page = page;
  $$(".page").forEach((item) => item.classList.toggle("active", item.id === `page-${page}`));
  $$("[data-page-target]").forEach((button) => button.classList.toggle("active", button.dataset.pageTarget === page));
  const titles = { today: "Feed de treino", xp: "Consistencia", plan: "Plano", history: "Diario", progress: "Performance", nutrition: "Nutri", body: "Corpo e recuperacao", library: "Biblioteca", data: "Dados", user: "Usuario" };
  $("#pageTitle").textContent = titles[page] || "Finfit";
}

function setPreset(type) {
  selectedPreset = presets.find((preset) => preset.type === type) || presets[0];
  fields.name.value = selectedPreset.defaultName;
  fields.duration.value = selectedPreset.duration;
  $("#modalityHint").textContent = modalityHint(selectedPreset.type);
  renderPresets();
  renderDetailHelper();
}

function modalityHint(type) {
  const hints = {
    academia: "Uma linha por exercicio: supino 4x8 70kg. Use foco como peito/costas/pernas para recomendacoes por grupo.",
    natacao: "Use blocos com metragem: 8x50m tecnica, 400m solto. O volume entra no progresso.",
    futevolei: "Registre parceiro, quantidade de jogos, resultado e sensacao do corpo.",
    corrida: "Registre distancia, pace/zona, terreno, RPE e dor. Isso alimenta zonas, carga, longao e segmentos privados.",
    mobilidade: "Anote regioes, dor antes/depois e foco corporal.",
    outro: "Use linhas curtas com o que voce quer lembrar depois."
  };
  return hints[type] || hints.outro;
}

function resetForm() {
  fields.id.value = "";
  fields.date.value = todayIso();
  fields.intensity.value = "moderado";
  fields.status.value = "feito";
  fields.rpe.value = "";
  fields.energy.value = "";
  fields.pain.value = "";
  fields.distance.value = "";
  fields.volume.value = "";
  fields.focus.value = "";
  fields.location.value = "";
  fields.note.value = "";
  fields.details.value = "";
  $("#saveWorkoutButton").textContent = "Salvar treino";
  setPreset(selectedPreset.type);
}

function workoutFromForm() {
  return normalizeWorkout({
    id: fields.id.value || uid("workout"),
    type: selectedPreset.type,
    name: fields.name.value,
    date: fields.date.value,
    duration: fields.duration.value,
    intensity: fields.intensity.value,
    status: fields.status.value,
    rpe: fields.rpe.value,
    energy: fields.energy.value,
    pain: fields.pain.value,
    distance: fields.distance.value,
    volume: fields.volume.value,
    focus: fields.focus.value,
    location: fields.location.value,
    note: fields.note.value,
    details: fields.details.value
  });
}

function fillWorkoutForm(workout) {
  selectedPreset = presets.find((preset) => preset.type === workout.type) || presets[0];
  fields.id.value = workout.id;
  fields.name.value = workout.name;
  fields.date.value = workout.date;
  fields.duration.value = workout.duration;
  fields.intensity.value = workout.intensity;
  fields.status.value = workout.status;
  fields.rpe.value = workout.rpe;
  fields.energy.value = workout.energy;
  fields.pain.value = workout.pain;
  fields.distance.value = workout.distance;
  fields.volume.value = workout.volume;
  fields.focus.value = workout.focus;
  fields.location.value = workout.location;
  fields.note.value = workout.note;
  fields.details.value = workout.details;
  $("#saveWorkoutButton").textContent = "Atualizar treino";
  renderPresets();
  setPage("today");
  $("#quickAdd").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderPresets() {
  $("#sportPresetGrid").innerHTML = presets.map((preset) => `
    <button class="sport-preset ${preset.type === selectedPreset.type ? "active" : ""}" type="button" data-type="${preset.type}">
      <strong>${preset.label}</strong>
      <small>${preset.duration} min sugeridos</small>
    </button>
  `).join("");
}

function renderQuickStart() {
  $("#quickStartGrid").innerHTML = presets.map((preset) => `
    <button type="button" data-quick-start="${preset.type}">
      <strong>${preset.label}</strong><br>
      <small>${preset.duration} min</small>
    </button>
  `).join("");
}

function renderDetailHelper() {
  const helpers = {
    academia: ["supino reto 4x8 70kg\nsupino inclinado 3x10 56kg\ncrucifixo 3x12 18kg\ntriceps corda 3x12", "agachamento 4x6 90kg\nstiff 3x8 80kg\nleg press 4x10 140kg\npanturrilha 4x12", "puxada aberta 4x10 65kg\nremada baixa 4x10 60kg\nface pull 3x15\nrosca direta 3x10 16kg"],
    natacao: ["400m solto\n8x50m tecnica\n300m moderado", "600m crawl\n6x100m ritmo\n200m solto"],
    futevolei: ["dupla Joao\n3 jogos\nresultado 2x1\nponto forte: saque", "treino tecnico\nrecepcao e ataque\nsensacao: leve"],
    corrida: ["Z2 facil\npace alvo 6:30-7:10/km\nterreno plano\nRPE 4-5\ndor 0-2", "progressivo\n15min facil\n3x6min controlado\n2min leve\n10min solto", "tiros\n12min aquecer\n8x400m forte\n200m trote\n10min solto"],
    mobilidade: ["quadril 10min\ntoracica 8min\nombro 6min\ndor antes/depois", "respiracao 5min\nalongamento posterior\nmobilidade tornozelo"],
    outro: ["objetivo:\nblocos:\nsensacao:"]
  };
  const items = helpers[selectedPreset.type] || helpers.outro;
  $("#detailHelper").innerHTML = items.map((text, index) => `<button type="button" data-detail-template="${encodeURIComponent(text)}">Modelo ${index + 1}</button>`).join("");
}

function renderActivityFocus() {
  const options = [{ type: "todos", label: "Tudo" }, ...presets];
  const active = options.find((item) => item.type === activeSportFilter) || options[0];
  $("#activityFocusLabel").textContent = active.label;
  $("#activityFocusGrid").innerHTML = options.map((item) => {
    const count = item.type === "todos" ? state.workouts.length : state.workouts.filter((workout) => workout.type === item.type).length;
    return `
      <button type="button" class="${item.type === activeSportFilter ? "active" : ""}" data-sport-focus="${item.type}">
        <span>${sportIcon(item.type)}</span>
        <strong>${item.label}</strong>
        <small>${count}</small>
      </button>
    `;
  }).join("");
  renderActivityHub();
}

function renderActivityHub() {
  const target = $("#activityHub");
  if (!target) return;
  const items = scopedWorkouts([...state.workouts]);
  const week = scopedWorkouts(currentWeekWorkouts());
  const label = activeSportFilter === "todos" ? "Todas modalidades" : presetLabel(activeSportFilter);
  const minutes = items.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const distance = items.reduce((sum, item) => sum + Number(item.distance || 0), 0);
  const load = loadSum(items);
  const last = [...items].sort((a, b) => b.date.localeCompare(a.date))[0];
  const best = [...items].sort((a, b) => workoutLoad(b) - workoutLoad(a))[0];
  const specific = activitySpecificHtml(activeSportFilter, items);
  const context = activityContextHtml(activeSportFilter, items);
  target.innerHTML = `
    <div class="activity-hub-main">
      <div class="activity-hub-title">
        <span>${sportIcon(activeSportFilter)}</span>
        <div>
          <p class="eyebrow">foco atual</p>
          <h3>${label}</h3>
        </div>
      </div>
      <div class="activity-hub-actions">
        <button type="button" data-activity-action="new">${activeSportFilter === "todos" ? "Novo treino" : `Registrar ${label}`}</button>
        <button type="button" data-activity-action="history">Historico</button>
        <button type="button" data-activity-action="progress">Progresso</button>
      </div>
    </div>
    <div class="activity-hub-stats">
      <div><span>Sessoes</span><strong>${items.length}</strong><small>${week.length} nesta semana</small></div>
      <div><span>Tempo</span><strong>${minutes}min</strong><small>historico filtrado</small></div>
      <div><span>Carga</span><strong>${load}</strong><small>${best ? `pico ${workoutLoad(best)}` : "sem pico"}</small></div>
      <div><span>${activeSportFilter === "corrida" ? "Distancia" : activeSportFilter === "natacao" ? "Metragem" : "Ultimo"}</span><strong>${distance ? `${Math.round(distance * 10) / 10}` : last ? formatDate(last.date) : "--"}</strong><small>${last ? last.name : "sem registros"}</small></div>
    </div>
    ${specific}
    ${context}
  `;
}

function activitySpecificHtml(type, items) {
  if (type === "todos") return "";
  if (!items.length) return `<div class="activity-specific empty-state">Sem dados de ${presetLabel(type).toLowerCase()} ainda. Clique em registrar para comecar.</div>`;
  if (type === "corrida") {
    const runs = runningWorkouts();
    const avg = runs.reduce((sum, run) => sum + Number(run.duration || 0), 0) / Math.max(1, runs.reduce((sum, run) => sum + Number(run.distance || 0), 0));
    const longest = [...runs].sort((a, b) => Number(b.distance || 0) - Number(a.distance || 0))[0];
    return `<div class="activity-specific"><strong>Pace medio ${formatPace(avg)}/km</strong><span>Maior corrida: ${longest ? `${longest.distance}km em ${formatDate(longest.date)}` : "--"}. Running Engine fica em Progresso.</span></div>`;
  }
  if (type === "academia") {
    const exercises = parseExerciseDetails();
    return `<div class="activity-specific"><strong>${exercises.length} exercicios detectados</strong><span>${exercises[0] ? `Principal: ${exercises[0].name}, melhor volume ${Math.round(exercises[0].bestVolume)}` : "Use detalhes como supino 4x8 70kg para destravar recordes."}</span></div>`;
  }
  if (type === "natacao") {
    const volume = items.reduce((sum, item) => sum + Number(item.volume || item.distance || 0), 0);
    return `<div class="activity-specific"><strong>${Math.round(volume)}m registrados</strong><span>Registre metragem, estilo e series para comparar tecnica e resistencia.</span></div>`;
  }
  if (type === "futevolei") {
    const places = new Set(items.map((item) => item.location).filter(Boolean));
    return `<div class="activity-specific"><strong>${places.size || 0} local(is)</strong><span>Anote dupla, resultado e intensidade para descobrir combinacoes melhores.</span></div>`;
  }
  return `<div class="activity-specific"><strong>${presetLabel(type)} em foco</strong><span>O historico e a semana estao filtrados para esta modalidade.</span></div>`;
}

function activityContextHtml(type, items) {
  const context = activityContexts[type];
  if (!context) return "";
  const categories = [{ id: "todos", icon: sportIcon(type), label: "Tudo", plans: [] }, ...context.categories];
  const active = categories.find((item) => item.id === activeActivityCategory) || categories[0];
  const activeItems = active.id === "todos" ? items : items.filter((workout) => categoryMatches(active, workout));
  const plans = contextualPlans(type, active, items, context);
  const last = [...activeItems].sort((a, b) => b.date.localeCompare(a.date))[0];
  return `
    <div class="activity-context">
      <div class="activity-context-head">
        <div>
          <strong>${context.title}</strong>
          <small>${context.text}</small>
        </div>
        <span>${activeItems.length} registro(s)</span>
      </div>
      <div class="activity-category-grid">
        ${categories.map((item) => `
          <button type="button" class="${item.id === active.id ? "active" : ""}" data-activity-category="${item.id}">
            <span>${item.icon}</span>
            <strong>${item.label}</strong>
            <small>${item.id === "todos" ? items.length : items.filter((workout) => categoryMatches(item, workout)).length}</small>
          </button>
        `).join("")}
      </div>
      <div class="activity-context-body">
        <div class="context-last">
          <span>Contexto selecionado</span>
          <strong>${active.label}</strong>
          <small>${last ? `${last.name} em ${formatDate(last.date)} - ${last.duration}min` : "Sem treino nessa categoria ainda."}</small>
        </div>
        <div class="context-plan-list">
          ${plans.map(([title, detail]) => `
            <button type="button" data-category-plan="${encodeURIComponent(JSON.stringify({ type, title, detail, focus: active.id }))}">
              <span>recomendado</span>
              <strong>${title}</strong>
              <small>${detail.split(/\n/).slice(0, 2).join(" • ")}</small>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function contextualPlans(type, active, items, context) {
  const basePlans = active.id === "todos" ? context.categories.flatMap((item) => item.plans).slice(0, 3) : active.plans;
  if (type === "academia") return strengthContextPlans(active, items, basePlans);
  if (type === "corrida") return runningContextPlans(active, basePlans);
  return basePlans;
}

function strengthContextPlans(active, items, basePlans) {
  const group = active.id === "todos" ? "geral" : active.label.toLowerCase();
  const groupExercises = parseExerciseDetails().filter((exercise) => active.id === "todos" || strengthMuscleGroup(exercise.name).toLowerCase() === active.label.toLowerCase());
  const last = [...items].filter((workout) => active.id === "todos" || categoryMatches(active, workout)).sort((a, b) => b.date.localeCompare(a.date))[0];
  const nextLoad = groupExercises[0]?.bestWeight ? `${Math.round((groupExercises[0].bestWeight + 2.5) * 10) / 10}kg` : "carga moderada";
  const smart = [
    [`${active.label} progressao`, `${groupExercises[0]?.name || `exercicio principal ${group}`}: 4x6-8 ${nextLoad}\nAcessorio 3x10-12\nFinalizador leve 2x15\nRPE alvo 7-8`],
    [`${active.label} controle`, `${last ? `Repetir base de ${formatDate(last.date)}` : "Escolher 3 exercicios"}\nManter tecnica limpa\nRegistrar series, reps e carga\nAnotar dor/articulacao`]
  ];
  return [...smart, ...basePlans].slice(0, 4);
}

function runningContextPlans(active, basePlans) {
  const prescriptions = runPrescriptions().map((item) => [`Corrida - ${item.title}`, `${item.detail}\nMotivo: ${item.reason}\nRegistrar distancia, RPE e dor`]);
  const zones = paceZones().slice(0, 2).map((zone) => [`Zona ${zone.label}`, `${formatPace(zone.range[0])}-${formatPace(zone.range[1])}/km\n${zone.note}\nRegistrar terreno e sensacao`]);
  if (active.id === "tiros") return [["Tiros controlados", "12min aquecer\n6-8x400m forte\n200m trote\n10min solto\nRegistrar pace medio"]].concat(zones).slice(0, 4);
  if (active.id === "longo") return [["Longo privado", "Aumentar no maximo 10-12% do maior longo recente\nRPE 5-6\nSem sprint final\nRegistrar rota"]].concat(prescriptions).slice(0, 4);
  if (active.id === "recuperacao") return [["Regenerativo real", "20-30min muito leve\nSem olhar pace\nMobilidade posterior\nDor antes/depois"]].concat(basePlans).slice(0, 4);
  return [...prescriptions, ...basePlans].slice(0, 4);
}

function categoryMatches(category, workout) {
  const text = `${workout.name} ${workout.focus} ${workout.note} ${workout.details}`.toLowerCase();
  return category.match?.test(text);
}

function formatClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function elapsedSeconds() {
  if (!activeSession) return 0;
  const base = Number(activeSession.elapsedBefore || 0);
  if (!activeSession.running) return base;
  return base + Math.floor((Date.now() - activeSession.startedAt) / 1000);
}

function restSecondsLeft() {
  if (!activeSession?.restEndsAt) return 0;
  return Math.max(0, Math.ceil((activeSession.restEndsAt - Date.now()) / 1000));
}

function startSession(type = selectedPreset.type) {
  const preset = presets.find((item) => item.type === type) || selectedPreset;
  activeSession = {
    type: preset.type,
    name: preset.defaultName,
    startedAt: Date.now(),
    elapsedBefore: 0,
    running: true,
    restEndsAt: null,
    setCount: 0
  };
  saveActiveSession();
  renderTimer();
}

function toggleSessionTimer() {
  if (!activeSession) {
    startSession();
    return;
  }
  if (activeSession.running) {
    activeSession.elapsedBefore = elapsedSeconds();
    activeSession.running = false;
  } else {
    activeSession.startedAt = Date.now();
    activeSession.running = true;
  }
  saveActiveSession();
  renderTimer();
}

function startRest() {
  if (!activeSession) startSession();
  const seconds = Number($("#restSecondsInput").value || 90);
  activeSession.restEndsAt = Date.now() + seconds * 1000;
  saveActiveSession();
  renderTimer();
}

function nextSet() {
  if (!activeSession) startSession();
  activeSession.setCount = Number(activeSession.setCount || 0) + 1;
  startRest();
}

function resetSession() {
  activeSession = null;
  saveActiveSession();
  renderTimer();
}

function finishActiveSession() {
  if (!activeSession) return;
  const duration = Math.max(1, Math.round(elapsedSeconds() / 60));
  upsertWorkout(normalizeWorkout({
    type: activeSession.type,
    name: activeSession.name,
    date: todayIso(),
    duration,
    intensity: "moderado",
    status: "feito",
    details: `Modo treino agora\nsets: ${activeSession.setCount || 0}\ntempo: ${formatClock(elapsedSeconds())}`
  }));
  resetSession();
  render();
}

function renderTimer() {
  $("#timerDisplay").textContent = formatClock(elapsedSeconds());
  $("#restDisplay").textContent = formatClock(restSecondsLeft());
  $("#setCounter").textContent = activeSession?.setCount || 0;
  $("#activeWorkoutLabel").textContent = activeSession ? activeSession.name : "Nenhum treino ativo";
  $("#timerStatus").textContent = activeSession
    ? activeSession.running ? "rodando offline no navegador" : "pausado"
    : "Escolha um atalho para iniciar";
  $("#startPauseButton").textContent = activeSession?.running ? "Pausar" : "Iniciar";
}

function todayWorkouts() {
  const today = todayIso();
  return state.workouts.filter((workout) => workout.date === today && workout.status !== "pulado");
}

function todayFoodLogs() {
  return state.foodLogs.filter((item) => item.date === todayIso());
}

function missionXpForWorkout(workout) {
  const base = Math.max(10, Math.round(Number(workout.duration || 0) / 5) * 5);
  const bonus = { leve: 5, moderado: 15, forte: 25, maximo: 35 }[workout.intensity] || 10;
  return Math.min(120, base + bonus);
}

function missionXpForQuickItem(item) {
  return missionXpForWorkout({ duration: item.duration, intensity: item.intensity });
}

function dailyMissionStats(done = todayWorkouts(), foods = todayFoodLogs(), bodyLog = todayBodyLog()) {
  const workoutXp = done.reduce((sum, workout) => sum + missionXpForWorkout(workout), 0);
  const foodXp = Math.min(60, foods.length * 15);
  const bodyXp = bodyLog ? 25 : 0;
  const xp = workoutXp + foodXp + bodyXp;
  const level = Math.floor(xp / 100) + 1;
  const levelXp = xp % 100;
  const missionsDone = done.length + foods.length + (bodyLog ? 1 : 0);
  const target = 5;
  const streak = weekDays.reduce((sum, day) => {
    const date = dateForCurrentWeekday(day.key);
    return sum + (state.workouts.some((workout) => workout.date === date && workout.status !== "pulado") ? 1 : 0);
  }, 0);
  return { xp, level, levelXp, missionsDone, target, streak };
}

function missionBoardHtml(done, foods, bodyLog) {
  const stats = dailyMissionStats(done, foods, bodyLog);
  const minutes = done.reduce((sum, workout) => sum + Number(workout.duration || 0), 0);
  const load = loadSum(done);
  const burned = exerciseCalories(todayIso());
  const weekMinutes = currentWeekWorkouts().reduce((sum, workout) => sum + Number(workout.duration || 0), 0);
  const dots = weekDays.map((day) => {
    const date = dateForCurrentWeekday(day.key);
    const active = state.workouts.some((workout) => workout.date === date && workout.status !== "pulado");
    return `<span class="${active ? "done" : ""}"></span>`;
  }).join("");
  return `
    <div class="mission-progress">
      <div class="mission-track">${dots}</div>
      <strong>${minutes} min</strong>
      <small>${done.length} atividade(s) hoje</small>
    </div>
    <div class="mission-copy">
      <span>Resumo do dia</span>
      <h3>${done.length ? "Atividade registrada." : "Pronto para registrar."}</h3>
      <p>Carga ${load}, gasto estimado ${burned} kcal e ${foods.length} registro(s) de alimentacao.</p>
      <div class="mission-bar"><i style="width: ${Math.min(100, (minutes / 90) * 100)}%"></i></div>
    </div>
    <div class="mission-streak">
      <span>Semana ativa</span>
      <strong>${stats.streak}/7</strong>
      <small>${weekMinutes}min acumulados</small>
    </div>
  `;
}

function renderXpDashboard() {
  const target = $("#xpDashboard");
  if (!target) return;
  const done = todayWorkouts();
  const foods = todayFoodLogs();
  const bodyLog = todayBodyLog();
  const stats = dailyMissionStats(done, foods, bodyLog);
  const weekActive = weekDays.map((day) => {
    const date = dateForCurrentWeekday(day.key);
    const sessions = state.workouts.filter((workout) => workout.date === date && workout.status !== "pulado");
    return { ...day, sessions, minutes: sessions.reduce((sum, workout) => sum + Number(workout.duration || 0), 0) };
  });
  const topTypes = Object.entries(groupBy(state.workouts, "type"))
    .map(([type, workouts]) => ({ type, minutes: workouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0), total: workouts.length }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5);
  const todayMissions = [
    ...dailyCheckItems.map((item) => ({ label: item.label, meta: `${item.duration}min padrao`, done: done.some((workout) => workout.type === item.type), value: item.intensity })),
    { label: "Alimentacao", meta: `${foods.length} registro(s)`, done: foods.length > 0, value: `${nutritionSummary(todayIso()).consumed} kcal` },
    { label: "Corpo", meta: bodyLog ? "check-in feito" : "sono, dor, energia", done: Boolean(bodyLog), value: bodyLog ? `dor ${bodyLog.pain || 0}` : "pendente" }
  ];
  const weekMinutes = weekActive.reduce((sum, day) => sum + day.minutes, 0);
  const weekLoad = loadSum(currentWeekWorkouts());
  target.innerHTML = `
    <div class="xp-hero">
      <span>Consistencia semanal</span>
      <strong>${stats.streak}/7 dias</strong>
      <small>${weekMinutes}min acumulados - carga ${weekLoad}</small>
      <div class="mission-bar"><i style="width: ${Math.min(100, (stats.streak / 7) * 100)}%"></i></div>
    </div>
    <div class="xp-week">
      ${weekActive.map((day) => `<div class="${day.sessions.length ? "done" : ""}"><span>${day.label}</span><strong>${day.minutes}</strong><small>${day.sessions.length} sessao</small></div>`).join("")}
    </div>
    <div class="xp-list">
      <div class="daily-section-title">Check-ins de hoje</div>
      ${todayMissions.map((item) => `
        <div class="${item.done ? "done" : ""}">
          <span></span>
          <strong>${item.label}</strong>
          <small>${item.meta}</small>
          <em>${item.value}</em>
        </div>
      `).join("")}
    </div>
    <div class="xp-list">
      <div class="daily-section-title">Modalidades mais frequentes</div>
      ${topTypes.length ? topTypes.map((item) => `
        <div>
          <span></span>
          <strong>${presetLabel(item.type)}</strong>
          <small>${item.total} registros</small>
          <em>${item.minutes}min</em>
        </div>
      `).join("") : '<p class="empty-state">Registre treinos para criar categorias de consistencia.</p>'}
    </div>
  `;
}

function todayBodyLog() {
  return state.bodyLogs.find((item) => item.date === todayIso());
}

function dailyCheckKey(item) {
  return `checkin:${todayIso()}:${item.type}`;
}

function dailyCheckWorkout(item) {
  return normalizeWorkout({
    id: uid("workout"),
    type: item.type,
    name: item.label,
    date: todayIso(),
    duration: item.duration,
    intensity: item.intensity,
    status: "feito",
    rpe: intensityToRpe(item.intensity),
    focus: item.focus,
    note: "Marcado no painel de hoje",
    details: dailyCheckKey(item)
  });
}

function renderDailyCheck() {
  const grid = $("#dailyCheckGrid");
  const summary = $("#dailySummaryGrid");
  const missionBoard = $("#missionBoard");
  const quickEdit = $("#dailyQuickEdit");
  const timeline = $("#dailyTimeline");
  const weekStrip = $("#dailyWeekStrip");
  const foodGrid = $("#dailyFoodGrid");
  const bodyGrid = $("#dailyBodyGrid");
  const analysis = $("#dailyAnalysis");
  if (!grid || !summary || !quickEdit || !timeline || !weekStrip || !foodGrid || !bodyGrid || !analysis) return;
  const done = todayWorkouts();
  const foods = todayFoodLogs();
  const bodyLog = todayBodyLog();
  const nutrition = nutritionSummary(todayIso());
  const favoriteItems = buildTodayFavorites();
  const minutes = done.reduce((sum, workout) => sum + Number(workout.duration || 0), 0);
  const load = done.reduce((sum, workout) => sum + workoutLoad(workout), 0);
  const burned = exerciseCalories(todayIso());
  if (selectedDailyWorkoutId && !state.workouts.some((workout) => workout.id === selectedDailyWorkoutId)) selectedDailyWorkoutId = "";
  const selected = state.workouts.find((workout) => workout.id === selectedDailyWorkoutId) || done.at(-1);
  if (missionBoard) missionBoard.innerHTML = missionBoardHtml(done, foods, bodyLog);
  grid.innerHTML = dailyCheckItems.map((item) => {
    const checked = done.some((workout) => workout.type === item.type);
    return `
      <button type="button" class="${checked ? "done" : ""}" data-daily-check="${item.id}">
        <span>${item.icon}</span>
        <strong>${item.label}</strong>
        <small>${checked ? "registrado hoje" : `${item.duration}min padrao`}</small>
        <em><b>${item.duration} min</b><b>${item.intensity}</b></em>
      </button>
    `;
  }).join("");
  summary.innerHTML = [
    ["Treinos", done.length, `${minutes}min hoje`],
    ["Carga", load, load ? "min x RPE" : "sem carga"],
    ["Gasto", `${burned} kcal`, "estimado"],
    ["Alimentacao", `${nutrition.consumed} kcal`, `${nutrition.remaining >= 0 ? nutrition.remaining : Math.abs(nutrition.remaining)} kcal ${nutrition.remaining >= 0 ? "livres" : "acima"}`]
  ].map(([label, value, hint]) => `<div><span>${label}</span><strong>${value}</strong><small>${hint}</small></div>`).join("");
  weekStrip.innerHTML = weekDays.map((day) => {
    const date = dateForCurrentWeekday(day.key);
    const items = state.workouts.filter((workout) => workout.date === date && workout.status !== "pulado");
    const isToday = date === todayIso();
    return `<div class="${isToday ? "today" : ""} ${items.length ? "done" : ""}"><span>${day.label}</span><strong>${items.length}</strong><small>${items.reduce((sum, item) => sum + Number(item.duration || 0), 0)}min</small></div>`;
  }).join("");
  foodGrid.innerHTML = dailyFoodItems.map((id) => {
    const food = foodCatalog.find((item) => item.id === id);
    if (!food) return "";
    return `<button type="button" data-daily-food="${food.id}"><strong>${food.name}</strong><small>${food.calories} kcal - ${food.serving}</small></button>`;
  }).join("") + '<button type="button" data-page-target="nutrition"><strong>Completo</strong><small>abrir diario</small></button>';
  bodyGrid.innerHTML = dailyBodyItems.map((item) => `
    <button type="button" class="${bodyLog && bodyLog.note?.includes(item.label) ? "done" : ""}" data-daily-body="${item.id}">
      <strong>${item.label}</strong>
      <small>${bodyLog ? `energia ${bodyLog.energy || "-"} / dor ${bodyLog.pain || 0}` : "registrar agora"}</small>
    </button>
  `).join("") + '<button type="button" data-page-target="body"><strong>Completo</strong><small>sono, peso, medidas</small></button>';
  const favoritesHtml = favoriteItems.length ? `
    <div class="daily-section-title">Favoritos de hoje</div>
    <div class="daily-favorite-grid">
      ${favoriteItems.map((item) => `
        <button type="button" data-daily-favorite="${item.kind}:${item.id}">
          <strong>${item.label}</strong>
          <small>${item.hint}</small>
        </button>
      `).join("")}
    </div>
  ` : "";
  quickEdit.innerHTML = selected ? `
    <div class="daily-edit-head">
      <div>
        <span>Editar rapido</span>
        <strong>${selected.name}</strong>
      </div>
      <button type="button" data-daily-select="${selected.id}">Abrir completo</button>
    </div>
    <div class="daily-edit-form">
      <label><span>Tempo</span><input id="dailyEditDuration" type="number" min="1" step="1" value="${Number(selected.duration || 0)}"></label>
      <label><span>Intensidade</span><select id="dailyEditIntensity">
        ${["leve", "moderado", "forte", "maximo"].map((value) => `<option value="${value}" ${selected.intensity === value ? "selected" : ""}>${value}</option>`).join("")}
      </select></label>
      <label><span>RPE</span><input id="dailyEditRpe" type="number" min="1" max="10" step="1" value="${selected.rpe || intensityToRpe(selected.intensity)}"></label>
      <label class="wide"><span>Nota</span><input id="dailyEditNote" value="${escapeAttr(selected.note || "")}" placeholder="como foi?"></label>
      <button type="button" class="save-workout" id="dailyEditSaveButton">Salvar ajuste</button>
    </div>
  ` : '<p class="empty-state">Marque um treino acima para ajustar tempo, intensidade e nota.</p>';
  const timelineItems = [
    ...done.map((workout) => `
      <button type="button" class="${workout.id === selected?.id ? "active" : ""}" data-daily-focus="${workout.id}">
        <span>${sportIcon(workout.type)}</span>
        <strong>${workout.name}</strong>
        <small>${workout.duration}min - ${workout.intensity} - carga ${workoutLoad(workout)}</small>
        <em>
          <b data-daily-edit-workout="${workout.id}">editar</b>
          <b data-daily-remove-workout="${workout.id}">remover</b>
        </em>
      </button>
    `),
    ...foods.map((food) => `
      <button type="button" data-page-target="nutrition">
        <span>🍽️</span>
        <strong>${food.meal} - ${food.name}</strong>
        <small>${food.calories} kcal - P ${food.protein}g / C ${food.carbs}g / G ${food.fat}g</small>
        <em><b data-daily-remove-food="${food.id}">remover</b></em>
      </button>
    `),
    bodyLog ? `
      <button type="button" data-page-target="body">
        <span>🫀</span>
        <strong>Corpo registrado</strong>
        <small>sono ${bodyLog.sleep || "-"}h - energia ${bodyLog.energy || "-"} - dor ${bodyLog.pain || 0}</small>
        <em><b data-daily-remove-body="${bodyLog.id}">remover</b></em>
      </button>
    ` : ""
  ].filter(Boolean);
  timeline.innerHTML = timelineItems.length ? `
    ${favoritesHtml}
    <div class="daily-section-title">Hoje registrado</div>
    ${timelineItems.join("")}
  ` : `${favoritesHtml}<p class="empty-state">Nada registrado hoje ainda. Marque treino, comida ou corpo acima.</p>`;
  analysis.innerHTML = dailyAnalysisHtml();
}

function toggleDailyCheck(id) {
  const item = dailyCheckItems.find((entry) => entry.id === id);
  if (!item) return;
  const key = dailyCheckKey(item);
  const existing = state.workouts.find((workout) => workout.date === todayIso() && workout.type === item.type && String(workout.details || "").includes(key));
  const sameTypeAlreadyLogged = state.workouts.some((workout) => workout.date === todayIso() && workout.type === item.type);
  if (existing) {
    state.workouts = state.workouts.filter((workout) => workout.id !== existing.id);
  } else if (sameTypeAlreadyLogged) {
    return;
  } else {
    const workout = dailyCheckWorkout(item);
    selectedDailyWorkoutId = workout.id;
    upsertWorkout(workout);
  }
  render();
}

function undoLastTodayWorkout() {
  const last = todayWorkouts().at(-1);
  if (!last) return;
  state.workouts = state.workouts.filter((workout) => workout.id !== last.id);
  selectedDailyWorkoutId = "";
  render();
}

function buildTodayFavorites() {
  const workoutFavorites = state.favorites.slice(0, 3).map((item) => ({
    kind: "workout",
    id: item.id,
    label: item.name,
    hint: `${presetLabel(item.type)} - ${item.duration}min`
  }));
  const foodFavorites = dailyFoodItems.slice(0, 3).map((id) => {
    const food = foodCatalog.find((item) => item.id === id);
    return food && { kind: "food", id: food.id, label: food.name, hint: `${food.calories} kcal - ${food.serving}` };
  }).filter(Boolean);
  return [...workoutFavorites, ...foodFavorites].slice(0, 6);
}

function applyTodayFavorite(value) {
  const [kind, id] = value.split(":");
  if (kind === "food") {
    addDailyFood(id);
    return;
  }
  const favorite = state.favorites.find((item) => item.id === id);
  if (!favorite) return;
  const workout = normalizeWorkout({ ...favorite, id: uid("workout"), date: todayIso(), status: "feito", note: favorite.note || "Favorito de hoje" });
  selectedDailyWorkoutId = workout.id;
  upsertWorkout(workout);
  render();
}

function removeDailyItem(kind, id) {
  if (kind === "workout") state.workouts = state.workouts.filter((item) => item.id !== id);
  if (kind === "food") state.foodLogs = state.foodLogs.filter((item) => item.id !== id);
  if (kind === "body") state.bodyLogs = state.bodyLogs.filter((item) => item.id !== id);
  if (selectedDailyWorkoutId === id) selectedDailyWorkoutId = "";
  render();
}

function addDailyFood(id) {
  const food = foodCatalog.find((item) => item.id === id);
  if (!food) return;
  state.foodLogs.push(normalizeFoodLog({
    id: uid("food"),
    date: todayIso(),
    meal: new Date().getHours() < 11 ? "Café" : new Date().getHours() < 15 ? "Almoço" : new Date().getHours() < 19 ? "Lanche" : "Jantar",
    foodId: food.id,
    name: food.name,
    servings: 1,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    note: "Marcado no painel de hoje"
  }));
  render();
}

function addDailyBody(id) {
  const item = dailyBodyItems.find((entry) => entry.id === id);
  if (!item) return;
  const existing = todayBodyLog();
  const next = normalizeBodyLog({
    ...(existing || {}),
    id: existing?.id || uid("body"),
    date: todayIso(),
    nutrition: existing?.nutrition || 7,
    ...item.patch,
    note: [`Check-in rapido: ${item.label}`, existing?.note].filter(Boolean).join(" - ")
  });
  const index = state.bodyLogs.findIndex((log) => log.id === next.id);
  if (index >= 0) state.bodyLogs[index] = next;
  else state.bodyLogs.push(next);
  render();
}

function dateForCurrentWeekday(dayKey) {
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay() || 7;
  monday.setDate(monday.getDate() - day + 1);
  const date = new Date(monday);
  const offset = dayKey === 0 ? 6 : dayKey - 1;
  date.setDate(monday.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function dailyRecommendation() {
  const done = todayWorkouts();
  const body = latestBodyLog();
  const load = loadSum(done);
  const nutrition = nutritionSummary(todayIso());
  if (!done.length && !todayFoodLogs().length && !todayBodyLog()) return ["Marque o primeiro dado do dia.", "Treino, comida ou corpo: qualquer check-in ja deixa o Finfit mais util."];
  if (!done.length) return ["Ainda falta treino hoje.", "Alimentacao/corpo ja ajudam, mas marque um treino para calcular carga e gasto."];
  if (body?.pain >= 5) return ["Hoje pede cuidado.", `Voce ja registrou ${done.length} treino(s), mas a dor recente esta ${body.pain}/10. Melhor fechar com recuperacao.`];
  if (load >= 700) return ["Carga alta para hoje.", `Carga ${load}. Se ainda for treinar, prefira mobilidade ou tecnica leve.`];
  if (nutrition.consumed && nutrition.remaining < 0) return ["Dia acima da meta alimentar.", `Treino marcado, mas o saldo passou ${Math.abs(nutrition.remaining)} kcal da meta. Ajuste a proxima refeicao sem drama.`];
  if (done.some((workout) => workout.type === "academia") && !done.some((workout) => workout.type === "mobilidade")) return ["Feche com mobilidade curta.", "Academia ja entrou hoje. Dez minutos de mobilidade deixam a recuperacao mais legivel."];
  return ["Dia em movimento.", `${done.length} treino(s), ${done.reduce((sum, item) => sum + Number(item.duration || 0), 0)}min e carga ${load}. Continue registrando o essencial.`];
}

function periodSummary(workouts, bodyLogs = [], foodLogs = []) {
  const activeDays = new Set(workouts.map((item) => item.date)).size;
  const load = loadSum(workouts);
  const minutes = workouts.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const calories = foodLogs.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const avgPain = bodyLogs.length ? bodyLogs.reduce((sum, item) => sum + Number(item.pain || 0), 0) / bodyLogs.length : 0;
  const avgSleep = bodyLogs.length ? bodyLogs.reduce((sum, item) => sum + Number(item.sleep || 0), 0) / bodyLogs.length : 0;
  return { activeDays, load, minutes, calories, avgPain, avgSleep };
}

function dailyAnalysisHtml() {
  const today = todayIso();
  const week = currentWeekWorkouts();
  const prev = previousWeekWorkouts();
  const weekStart = weekWindow(0).start.toISOString().slice(0, 10);
  const weekEnd = weekWindow(0).end.toISOString().slice(0, 10);
  const prevStart = weekWindow(-1).start.toISOString().slice(0, 10);
  const prevEnd = weekWindow(-1).end.toISOString().slice(0, 10);
  const bodyWeek = state.bodyLogs.filter((item) => item.date >= weekStart && item.date < weekEnd);
  const bodyPrev = state.bodyLogs.filter((item) => item.date >= prevStart && item.date < prevEnd);
  const foodWeek = state.foodLogs.filter((item) => item.date >= weekStart && item.date < weekEnd);
  const foodToday = state.foodLogs.filter((item) => item.date === today);
  const current = periodSummary(week, bodyWeek, foodWeek);
  const previous = periodSummary(prev, bodyPrev, []);
  const loadDelta = previous.load ? Math.round(((current.load - previous.load) / previous.load) * 100) : 0;
  const todayLoad = loadSum(todayWorkouts());
  const actions = nextActionOptions(current, previous, todayLoad);
  const sportInsights = qualifiedSportInsights();
  const feed = privateActivityFeed();
  return `
    <div class="daily-section-title">Analise simples</div>
    <div class="daily-analysis-grid">
      <div><span>Hoje</span><strong>${todayWorkouts().length} treino(s)</strong><small>${todayLoad} carga - ${foodToday.reduce((sum, item) => sum + Number(item.calories || 0), 0)} kcal</small></div>
      <div><span>Semana</span><strong>${current.activeDays}/7 dias</strong><small>${current.minutes}min - carga ${current.load}</small></div>
      <div><span>Vs anterior</span><strong>${previous.load ? `${loadDelta > 0 ? "+" : ""}${loadDelta}%` : "--"}</strong><small>${previous.load ? `carga anterior ${previous.load}` : "sem base anterior"}</small></div>
      <div><span>Recuperacao</span><strong>${current.avgSleep ? `${Math.round(current.avgSleep * 10) / 10}h` : "--"}</strong><small>dor media ${Math.round(current.avgPain * 10) / 10}</small></div>
    </div>
    <div class="next-action-grid">
      ${actions.map((item) => `
        <button type="button" data-next-action="${item.action}">
          <span>${item.tag}</span>
          <strong>${item.title}</strong>
          <small>${item.text}</small>
        </button>
      `).join("")}
    </div>
    ${sportInsights.length ? `
      <div class="daily-section-title">Insights por modalidade</div>
      <div class="sport-insight-grid">
        ${sportInsights.map((item) => `<div><span>${item.tag}</span><strong>${item.title}</strong><small>${item.text}</small></div>`).join("")}
      </div>
    ` : ""}
    ${feed.length ? `
      <div class="daily-section-title">Feed pessoal</div>
      <div class="private-feed">
        ${feed.map((item) => `
          <div>
            <span>${sportIcon(item.type)}</span>
            <strong>${item.title}</strong>
            <small>${item.meta}</small>
            ${item.note ? `<em>${item.note}</em>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;
}

function nextActionOptions(current, previous, todayLoad) {
  const body = latestBodyLog();
  const missingBody = !todayBodyLog();
  const missingFood = !todayFoodLogs().length;
  const actions = [];
  if (todayLoad < 250 && !(body?.pain >= 5)) actions.push({ tag: "Treinar", title: "Sessao curta", text: "Marque musculacao, corrida leve ou mobilidade para criar rastro hoje.", action: "train" });
  if (body?.pain >= 5 || todayLoad > 650 || (previous.load && current.load > previous.load * 1.35)) actions.push({ tag: "Recuperar", title: "Baixar impacto", text: "Carga/dor pedem mobilidade, sono e treino tecnico.", action: "recover" });
  if (missingBody || missingFood) actions.push({ tag: "Registrar", title: missingBody ? "Check-in de corpo" : "Check-in de comida", text: "Falta dado basico para o coach ler o dia direito.", action: missingBody ? "body" : "food" });
  actions.push({ tag: "Analisar", title: "Ver progresso", text: "Abra progresso para conferir recordes, carga e modalidades.", action: "progress" });
  return actions.slice(0, 3);
}

function qualifiedSportInsights() {
  const insights = [];
  const runs = runningWorkouts(42);
  if (runs.length >= 3) {
    const summary = runningSummary();
    insights.push({
      tag: "Corrida",
      title: `${Math.round(summary.distance28 * 10) / 10}km em 28d`,
      text: summary.avgPace ? `Pace medio ${formatPace(summary.avgPace)}/km. ${runningInsights()[0]?.[1] || "Base mensuravel."}` : "Registre distancia para liberar pace e zonas."
    });
  }
  const strength = strengthSummary();
  if (strength.workouts.length >= 3 && strength.exercises.length >= 2) {
    const main = strength.exercises[0];
    insights.push({
      tag: "Musculacao",
      title: `${strength.exercises.length} exercicios detectados`,
      text: `${main.name}: melhor ${main.bestWeight || "-"}kg, volume ${Math.round(main.bestVolume)}. Grupo foco: ${strength.groups[0]?.[0] || "geral"}.`
    });
  }
  const swim = swimSummary();
  if (swim.swims.length >= 2 && swim.meters > 0) {
    insights.push({
      tag: "Natacao",
      title: `${Math.round(swim.meters)}m registrados`,
      text: `Media ${Math.round(swim.meters / swim.swims.length)}m por sessao. Foco mais comum: ${swim.styles[0]?.[0] || "sem estilo"}.`
    });
  }
  const beach = beachSummary();
  if (beach.games.length >= 2) {
    insights.push({
      tag: "Futevolei",
      title: `${beach.games.length} sessoes`,
      text: `Local mais comum: ${beach.places[0]?.[0] || "sem local"}. Intensos: ${beach.intense}.`
    });
  }
  return insights.slice(0, 4);
}

function privateActivityFeed() {
  return [...state.workouts]
    .filter((workout) => workout.status !== "pulado")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)
    .map((workout) => {
      const pr = personalBestLabel(workout);
      return {
        type: workout.type,
        title: workout.name,
        meta: `${formatDate(workout.date)} - ${workout.duration}min - carga ${workoutLoad(workout)}${pr ? ` - ${pr}` : ""}`,
        note: workout.note || workout.focus || ""
      };
    });
}

function personalBestLabel(workout) {
  const before = state.workouts.filter((item) => item.id !== workout.id && item.type === workout.type && item.date <= workout.date);
  if (Number(workout.distance || 0) > 0) {
    const best = Math.max(0, ...before.map((item) => Number(item.distance || 0)));
    if (Number(workout.distance) >= best && best > 0) return "PR distancia";
  }
  if (Number(workout.volume || 0) > 0) {
    const best = Math.max(0, ...before.map((item) => Number(item.volume || 0)));
    if (Number(workout.volume) >= best && best > 0) return "PR volume";
  }
  const bestLoad = Math.max(0, ...before.map(workoutLoad));
  if (workoutLoad(workout) >= bestLoad && bestLoad > 0) return "maior carga";
  return "";
}

function renderMetrics() {
  const week = scopedWorkouts(currentWeekWorkouts());
  const minutes = week.reduce((total, workout) => total + Number(workout.duration || 0), 0);
  const sports = new Set(week.map((workout) => workout.type));
  const load = week.reduce((sum, item) => sum + workoutLoad(item), 0);
  const score = readiness();
  const [title, text] = activeSportFilter === "todos" ? dailyRecommendation() : sportRecommendation(activeSportFilter, week);

  $("#todayLabel").textContent = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  $("#readinessScore").textContent = score;
  $("#readinessLabel").textContent = score >= 75 ? "boa para carga" : score >= 55 ? "moderada" : "cautela";
  $("#recommendationTitle").textContent = title;
  $("#recommendationText").textContent = text;
  $("#sessionMetric").textContent = week.length;
  $("#timeMetric").textContent = `${minutes}min`;
  $("#sportMetric").textContent = sports.size;
  $("#loadMetric").textContent = load;
}

function buildWeeklyCoachActions() {
  const week = scopedWorkouts(currentWeekWorkouts());
  const allWeek = currentWeekWorkouts();
  const body = latestBodyLog();
  const actions = [];
  const type = activeSportFilter;
  const label = type === "todos" ? "semana" : presetLabel(type).toLowerCase();
  const load = loadSum(week);
  const previous = loadSum(scopedWorkouts(previousWeekWorkouts()));
  const planned = week.filter((item) => item.status === "planejado");
  const done = week.filter((item) => item.status === "feito");

  if (planned.length) actions.push({ tag: "Executar", title: `Fechar ${planned[0].name}`, text: `${formatDate(planned[0].date)} esta planejado. Depois registre RPE, energia e dor para calibrar o coach.`, action: "today" });
  if (!week.length) actions.push({ tag: "Comecar", title: `Registrar ${label}`, text: type === "todos" ? "Sem treino filtrado nesta semana. Comece com uma sessao curta para criar lastro." : `Sem ${label} nesta semana. Use o botao registrar para criar a primeira sessao.`, action: "new" });
  if (body?.pain >= 5) actions.push({ tag: "Recuperar", title: "Baixar impacto", text: `Dor recente ${body.pain}/10. Troque treino forte por mobilidade, natacao leve ou tecnica.`, action: "body" });
  if (body?.sleep && body.sleep < 6) actions.push({ tag: "Sono", title: "Evitar intensidade maxima", text: `Sono recente ${body.sleep}h. Melhor volume facil do que teste de performance.`, action: "body" });
  if (previous > 0 && load > previous * 1.35) actions.push({ tag: "Carga", title: "Semana subiu rapido", text: `Carga de ${label} esta ${Math.round(((load - previous) / previous) * 100)}% acima da anterior. Considere deload curto.`, action: "progress" });
  if (type === "corrida") actions.push(...runningInsights().slice(0, 1).map(([title, text]) => ({ tag: "Corrida", title, text, action: "progress" })));
  if (type === "academia" && parseExerciseDetails().length < 3) actions.push({ tag: "Academia", title: "Detalhar exercicios", text: "Use linhas tipo supino 4x8 70kg para destravar progressao e recordes.", action: "new" });
  if (type === "natacao" && week.some((item) => !item.volume && !item.distance)) actions.push({ tag: "Natacao", title: "Registrar metragem", text: "Coloque volume/metragem para o progresso da natacao ficar real.", action: "new" });
  if (type === "todos" && !new Set(allWeek.map((item) => item.type)).has("mobilidade")) actions.push({ tag: "Recuperacao", title: "Adicionar mobilidade", text: "Ainda nao tem mobilidade na semana. Dez minutos ja melhoram a leitura do corpo.", action: "new-mobility" });
  if (!actions.length) actions.push({ tag: "Manter", title: "Semana equilibrada", text: `${done.length} sessao(oes) feitas e carga sob controle. Continue registrando detalhes pequenos.`, action: "progress" });

  return actions.slice(0, 5);
}

function renderWeeklyCoach() {
  $("#coachActionList").innerHTML = buildWeeklyCoachActions().map((item) => `
    <button type="button" class="coach-action-card" data-coach-action="${item.action}">
      <span>${item.tag}</span>
      <strong>${item.title}</strong>
      <small>${item.text}</small>
    </button>
  `).join("");
}

function renderWorkoutList() {
  const ordered = scopedWorkouts([...state.workouts]).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  $("#workoutList").innerHTML = ordered.length ? ordered.map((item, index) => workoutListItem(item, index)).join("") : '<p class="empty-state">Nenhum treino registrado ainda.</p>';
}

function sportRecommendation(type, week) {
  const label = presetLabel(type);
  if (!week.length) return [`Semana sem ${label.toLowerCase()}.`, `O filtro esta em ${label}. Registre uma sessao ou use os exemplos para ver progresso especifico.`];
  const minutes = week.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const load = loadSum(week);
  if (type === "corrida") return ["Corrida em foco.", `Nesta semana: ${week.length} sessao(oes), ${minutes}min e carga ${load}. Veja Running Engine para proxima corrida.`];
  if (type === "academia") return ["Academia em foco.", `Nesta semana: ${week.length} sessao(oes). Use detalhes por exercicio para alimentar recordes e progressao.`];
  if (type === "natacao") return ["Natacao em foco.", `Volume e tecnica aparecem melhor quando voce registra metragem, estilo e series.`];
  return [`${label} em foco.`, `Nesta semana: ${week.length} sessao(oes), ${minutes}min e carga ${load}.`];
}

function workoutListItem(item, index) {
  return `
    <li>
      <span class="step">${String(index + 1).padStart(2, "0")}</span>
      <span class="exercise">
        <strong>${item.name}</strong>
        <small>${formatDate(item.date)} - ${item.duration}min - ${item.intensity} - RPE ${item.rpe || intensityToRpe(item.intensity)}${item.note ? ` - ${item.note}` : ""}</small>
      </span>
      <span class="tag">${presetLabel(item.type)}</span>
      <span class="status-pill">${item.status}</span>
      <button class="icon-button" type="button" data-action="delete" data-id="${item.id}" aria-label="Remover ${item.name}">x</button>
    </li>
  `;
}

function renderWeek() {
  const week = scopedWorkouts(currentWeekWorkouts());
  $("#weekGrid").innerHTML = weekDays.map((day) => {
    const dayWorkouts = week.filter((workout) => new Date(`${workout.date}T12:00:00`).getDay() === day.key);
    const title = dayWorkouts.length ? dayWorkouts.map((workout) => presetLabel(workout.type)).join(" + ") : "Livre";
    const stateName = dayWorkouts.length ? "done" : "";
    return `<div class="day"><strong>${day.label}</strong><span>${title}</span><i class="status ${stateName}" aria-hidden="true"></i></div>`;
  }).join("");
}

function filteredWorkouts() {
  const search = $("#searchInput").value.trim().toLowerCase();
  const type = $("#typeFilter").value;
  const status = $("#statusFilter").value;
  const from = $("#fromFilter").value;
  const to = $("#toFilter").value;

  return scopedWorkouts([...state.workouts])
    .filter((item) => !type || item.type === type)
    .filter((item) => !status || item.status === status)
    .filter((item) => !from || item.date >= from)
    .filter((item) => !to || item.date <= to)
    .filter((item) => {
      if (!search) return true;
      return [item.name, item.note, item.focus, item.location, presetLabel(item.type)].join(" ").toLowerCase().includes(search);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function renderHistory() {
  $("#typeFilter").innerHTML = '<option value="">Todas modalidades</option>' + presets.map((preset) => `<option value="${preset.type}">${preset.label}</option>`).join("");
  const currentType = $("#typeFilter").dataset.value || "";
  $("#typeFilter").value = currentType;

  const items = filteredWorkouts();
  $("#timeline").innerHTML = items.length ? items.map((item) => `
    <div class="timeline-item">
      <div><strong>${formatDate(item.date)}</strong><div class="timeline-meta">${presetLabel(item.type)} - ${item.status}</div></div>
      <div>
        <strong>${item.name}</strong>
        <div class="timeline-meta">${item.duration}min - ${item.intensity} - carga ${workoutLoad(item)}${item.focus ? ` - ${item.focus}` : ""}${item.location ? ` - ${item.location}` : ""}</div>
        ${item.note ? `<div class="timeline-meta">${item.note}</div>` : ""}
        ${item.details ? `<div class="timeline-meta">${item.details.split("\n").slice(0, 2).join(" / ")}</div>` : ""}
      </div>
      <div class="timeline-actions">
        <button type="button" data-action="edit" data-id="${item.id}">Editar</button>
        <button type="button" data-action="duplicate" data-id="${item.id}">Duplicar</button>
        <button type="button" data-action="delete" data-id="${item.id}">Excluir</button>
      </div>
    </div>
  `).join("") : '<p class="empty-state">Nada encontrado com os filtros atuais.</p>';
}

function weekWindow(offsetWeeks = 0) {
  const now = new Date();
  const start = new Date(now);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1 + offsetWeeks * 7);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}

function workoutsInWindow(start, end) {
  return state.workouts.filter((workout) => {
    const date = new Date(`${workout.date}T12:00:00`);
    return date >= start && date < end;
  });
}

function previousWeekWorkouts() {
  const { start, end } = weekWindow(-1);
  return workoutsInWindow(start, end);
}

function workoutsSince(days) {
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  return state.workouts.filter((workout) => new Date(`${workout.date}T12:00:00`) >= start);
}

function loadSum(items) {
  return items.reduce((sum, item) => sum + workoutLoad(item), 0);
}

function buildSportBreakdown() {
  const totalLoad = Math.max(1, loadSum(state.workouts));
  return presets.map((preset) => {
    const items = state.workouts.filter((workout) => workout.type === preset.type);
    const minutes = items.reduce((sum, item) => sum + Number(item.duration || 0), 0);
    const load = loadSum(items);
    const distance = items.reduce((sum, item) => sum + Number(item.distance || 0), 0);
    return {
      ...preset,
      sessions: items.length,
      minutes,
      load,
      distance,
      pct: Math.round((load / totalLoad) * 100)
    };
  }).filter((item) => item.sessions > 0);
}

function parseExerciseDetails() {
  const records = new Map();
  state.workouts.forEach((workout) => {
    if (workout.type !== "academia" || !workout.details) return;
    workout.details.split(/\r?\n/).forEach((line) => {
      const match = line.trim().match(/^(.+?)\s+(\d+)x(\d+)(?:\s+(\d+(?:[.,]\d+)?)\s*kg)?/i);
      if (!match) return;
      const name = match[1].trim().toLowerCase();
      const sets = Number(match[2]);
      const reps = Number(match[3]);
      const weight = Number(String(match[4] || 0).replace(",", "."));
      const volume = sets * reps * weight;
      const current = records.get(name) || { name, bestWeight: 0, bestVolume: 0, lastDate: workout.date, count: 0 };
      current.bestWeight = Math.max(current.bestWeight, weight);
      current.bestVolume = Math.max(current.bestVolume, volume);
      current.lastDate = current.lastDate > workout.date ? current.lastDate : workout.date;
      current.count += 1;
      records.set(name, current);
    });
  });
  return [...records.values()].sort((a, b) => b.bestVolume - a.bestVolume);
}

function strengthMuscleGroup(name) {
  const text = String(name || "").toLowerCase();
  if (/supino|peito|crucifixo|crossover/.test(text)) return "Peito";
  if (/remada|puxada|barra|costas|pulldown/.test(text)) return "Costas";
  if (/agach|leg|terra|stiff|cadeira|mesa|panturrilha/.test(text)) return "Pernas";
  if (/desenvolvimento|ombro|eleva/.test(text)) return "Ombros";
  if (/rosca|triceps|bíceps|biceps/.test(text)) return "Braços";
  return "Geral";
}

function strengthSummary() {
  const workouts = state.workouts.filter((workout) => workout.type === "academia");
  const week = currentWeekWorkouts().filter((workout) => workout.type === "academia");
  const exercises = parseExerciseDetails();
  const groups = exercises.reduce((map, item) => {
    const group = strengthMuscleGroup(item.name);
    map.set(group, (map.get(group) || 0) + item.count);
    return map;
  }, new Map());
  const totalVolume = workouts.reduce((sum, workout) => sum + Number(workout.volume || 0), 0) || exercises.reduce((sum, item) => sum + Number(item.bestVolume || 0), 0);
  return { workouts, week, exercises, groups: [...groups.entries()].sort((a, b) => b[1] - a[1]), totalVolume };
}

function swimSummary() {
  const swims = state.workouts.filter((workout) => workout.type === "natacao");
  const week = currentWeekWorkouts().filter((workout) => workout.type === "natacao");
  const meters = swims.reduce((sum, workout) => sum + Number(workout.volume || workout.distance || 0), 0);
  const weekMeters = week.reduce((sum, workout) => sum + Number(workout.volume || workout.distance || 0), 0);
  const styles = new Map();
  swims.forEach((workout) => {
    String(`${workout.focus} ${workout.details}`).toLowerCase().split(/\W+/).forEach((word) => {
      if (["crawl", "costas", "peito", "borboleta", "tecnica", "solto"].includes(word)) styles.set(word, (styles.get(word) || 0) + 1);
    });
  });
  return { swims, week, meters, weekMeters, styles: [...styles.entries()].sort((a, b) => b[1] - a[1]) };
}

function beachSummary() {
  const games = state.workouts.filter((workout) => workout.type === "futevolei");
  const week = currentWeekWorkouts().filter((workout) => workout.type === "futevolei");
  const places = new Map();
  const partners = new Map();
  games.forEach((workout) => {
    if (workout.location) places.set(workout.location, (places.get(workout.location) || 0) + 1);
    const partner = String(workout.details || workout.note || "").match(/(?:parceiro|dupla)\s+([a-zA-ZÀ-ÿ]+)/i)?.[1];
    if (partner) partners.set(partner, (partners.get(partner) || 0) + 1);
  });
  const intense = games.filter((workout) => ["forte", "maximo"].includes(workout.intensity)).length;
  return { games, week, places: [...places.entries()].sort((a, b) => b[1] - a[1]), partners: [...partners.entries()].sort((a, b) => b[1] - a[1]), intense };
}

function renderSportModules() {
  renderStrengthModule();
  renderSwimModule();
  renderBeachModule();
}

function renderStrengthModule() {
  const data = strengthSummary();
  $("#strengthKpis").innerHTML = moduleKpis([
    ["Sessões", data.workouts.length, `${data.week.length} esta semana`],
    ["Exercícios", data.exercises.length, "detectados"],
    ["Volume", Math.round(data.totalVolume), "kg estimado"],
    ["Grupo foco", data.groups[0]?.[0] || "--", data.groups[0] ? `${data.groups[0][1]} registros` : "sem dados"]
  ]);
  $("#strengthProgression").innerHTML = data.exercises.length
    ? data.exercises.slice(0, 5).map((item) => {
      const next = item.bestWeight ? `${Math.round((item.bestWeight + 2.5) * 10) / 10}kg` : "registrar carga";
      return `<div><strong>${item.name}</strong><span>${strengthMuscleGroup(item.name)} - melhor ${item.bestWeight || "-"}kg - volume ${Math.round(item.bestVolume)}</span><small>Próxima progressão: ${next}, mantendo RPE controlado.</small></div>`;
    }).join("")
    : '<p class="empty-state">Use detalhes como "supino 4x8 70kg" para destravar progressão.</p>';
}

function renderSwimModule() {
  const data = swimSummary();
  const avg = data.swims.length ? Math.round(data.meters / data.swims.length) : 0;
  $("#swimKpis").innerHTML = moduleKpis([
    ["Sessões", data.swims.length, `${data.week.length} esta semana`],
    ["Volume", `${Math.round(data.meters)}m`, `${Math.round(data.weekMeters)}m semana`],
    ["Média", `${avg}m`, "por sessão"],
    ["Foco", data.styles[0]?.[0] || "--", data.styles[0] ? `${data.styles[0][1]} menções` : "sem estilo"]
  ]);
  $("#swimProgression").innerHTML = data.swims.length
    ? data.swims.slice(0, 5).map((item) => `<div><strong>${item.name}</strong><span>${formatDate(item.date)} - ${item.volume || item.distance || "-"}m - ${item.duration}min</span><small>${item.details || item.note || "Adicione séries como 8x50m para detectar padrões."}</small></div>`).join("")
    : '<p class="empty-state">Registre metragem, estilo e séries para criar evolução de natação.</p>';
}

function renderBeachModule() {
  const data = beachSummary();
  $("#beachKpis").innerHTML = moduleKpis([
    ["Sessões", data.games.length, `${data.week.length} esta semana`],
    ["Intensos", data.intense, "forte/máximo"],
    ["Local", data.places[0]?.[0] || "--", data.places[0] ? `${data.places[0][1]} vezes` : "sem local"],
    ["Dupla", data.partners[0]?.[0] || "--", data.partners[0] ? `${data.partners[0][1]} vezes` : "sem dupla"]
  ]);
  $("#beachProgression").innerHTML = data.games.length
    ? data.games.slice(0, 5).map((item) => `<div><strong>${item.name}</strong><span>${formatDate(item.date)} - ${item.duration}min - ${item.intensity}</span><small>${item.details || item.note || "Registre dupla, placar e sensação para comparar jogos."}</small></div>`).join("")
    : '<p class="empty-state">Registre dupla, local e resultado para criar memória de jogo.</p>';
}

function moduleKpis(items) {
  return items.map(([label, value, hint]) => `<div><span>${label}</span><strong>${value}</strong><small>${hint}</small></div>`).join("");
}

function buildRecords() {
  const bestLoad = [...state.workouts].sort((a, b) => workoutLoad(b) - workoutLoad(a))[0];
  const bestDuration = [...state.workouts].sort((a, b) => Number(b.duration || 0) - Number(a.duration || 0))[0];
  const bestDistance = [...state.workouts].filter((item) => Number(item.distance || 0) > 0).sort((a, b) => Number(b.distance || 0) - Number(a.distance || 0))[0];
  const bestVolume = [...state.workouts].filter((item) => Number(item.volume || 0) > 0).sort((a, b) => Number(b.volume || 0) - Number(a.volume || 0))[0];
  return [
    bestLoad && { label: "Maior carga", value: workoutLoad(bestLoad), detail: `${bestLoad.name} - ${formatDate(bestLoad.date)}` },
    bestDuration && { label: "Mais longo", value: `${bestDuration.duration}min`, detail: `${bestDuration.name} - ${formatDate(bestDuration.date)}` },
    bestDistance && { label: "Maior distancia", value: `${bestDistance.distance}`, detail: `${bestDistance.name} - ${formatDate(bestDistance.date)}` },
    bestVolume && { label: "Maior volume", value: bestVolume.volume, detail: `${bestVolume.name} - ${formatDate(bestVolume.date)}` }
  ].filter(Boolean);
}

function buildInsights() {
  const week = currentWeekWorkouts();
  const prev = previousWeekWorkouts();
  const body = latestBodyLog();
  const currentLoad = loadSum(week);
  const previousLoad = loadSum(prev);
  const types = new Set(week.map((workout) => workout.type));
  const insights = [];

  if (previousLoad > 0 && currentLoad > previousLoad * 1.35) insights.push(["Carga subiu rapido", "Semana atual esta mais de 35% acima da anterior. Vale controlar RPE e dor."]);
  if (week.length >= 6) insights.push(["Pouco espaco de descanso", "Ha treino em muitos dias da semana. Um dia leve pode render mais do que forcar."]);
  if (body?.pain >= 5) insights.push(["Dor alta registrada", "Dor corporal recente esta alta. Priorize mobilidade, tecnica ou reducao de carga."]);
  if (body?.painAreas) insights.push(["Mapa de dor ativo", `Areas recentes: ${body.painAreas}. Compare com os treinos de maior carga.`]);
  if (body?.sleep && body.sleep < 6) insights.push(["Sono baixo", "Sono recente abaixo de 6h reduz prontidao e aumenta risco de treino ruim."]);
  if (body?.stress >= 7) insights.push(["Estresse alto", "Estresse recente alto pede treino mais tecnico ou moderado."]);
  if (body?.nutrition && body.nutrition <= 4) insights.push(["Nutri baixa", "Alimentacao percebida baixa pode derrubar treino forte."]);
  if (!types.has("academia")) insights.push(["Forca ausente", "Ainda nao entrou academia nesta semana. Um treino curto pode manter base."]);
  if (!types.has("mobilidade")) insights.push(["Recuperacao esquecida", "Sem mobilidade registrada. Dez minutos ja deixam rastro util no historico."]);
  if (!insights.length) insights.push(["Semana sob controle", "Carga, modalidades e recuperacao estao em uma zona boa pelos dados atuais."]);

  return insights;
}

function runningWorkouts(days = Infinity) {
  const start = new Date();
  if (Number.isFinite(days)) {
    start.setDate(start.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
  }
  return state.workouts
    .filter((workout) => workout.type === "corrida" && Number(workout.distance || 0) > 0 && Number(workout.duration || 0) > 0)
    .filter((workout) => !Number.isFinite(days) || new Date(`${workout.date}T12:00:00`) >= start)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function formatPace(value) {
  if (!Number.isFinite(value) || value <= 0) return "--";
  const minutes = Math.floor(value);
  const seconds = Math.round((value - minutes) * 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function runningSummary() {
  const all = runningWorkouts();
  const last28 = runningWorkouts(28);
  const distance28 = last28.reduce((sum, workout) => sum + Number(workout.distance || 0), 0);
  const duration28 = last28.reduce((sum, workout) => sum + Number(workout.duration || 0), 0);
  const avgPace = distance28 ? duration28 / distance28 : 0;
  const acuteLoad = runningWorkouts(7).reduce((sum, workout) => sum + workoutLoad(workout), 0);
  const chronicLoad = Math.round(runningWorkouts(42).reduce((sum, workout) => sum + workoutLoad(workout), 0) / 6);
  const estimates = all.flatMap((workout) => {
    const distance = Number(workout.distance || 0);
    const duration = Number(workout.duration || 0);
    if (distance < 1 || !duration) return [];
    return [
      { label: "5k", minutes: duration * (5 / distance) ** 1.06, workout },
      { label: "10k", minutes: duration * (10 / distance) ** 1.06, workout }
    ];
  });
  const bestEstimate = estimates.sort((a, b) => a.minutes - b.minutes)[0];
  const longest = [...all].sort((a, b) => Number(b.distance || 0) - Number(a.distance || 0))[0];
  return { all, last28, distance28, avgPace, acuteLoad, chronicLoad, bestEstimate, longest };
}

function weeklyRunningTrend() {
  return Array.from({ length: 6 }, (_, index) => {
    const offset = index - 5;
    const { start, end } = weekWindow(offset);
    const runs = workoutsInWindow(start, end).filter((workout) => workout.type === "corrida");
    const distance = runs.reduce((sum, workout) => sum + Number(workout.distance || 0), 0);
    const duration = runs.reduce((sum, workout) => sum + Number(workout.duration || 0), 0);
    return {
      label: start.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      distance,
      pace: distance ? duration / distance : 0
    };
  });
}

function runningInsights() {
  const { last28, distance28, avgPace, acuteLoad, chronicLoad, longest } = runningSummary();
  const body = latestBodyLog();
  const insights = [];
  const ratio = chronicLoad ? acuteLoad / chronicLoad : 0;
  if (!last28.length) insights.push(["Sem base recente", "Importe GPX/TCX/FIT ou registre distancia para o Finfit analisar corrida como esporte de verdade."]);
  if (ratio > 1.35) insights.push(["Carga aguda alta", "A corrida dos ultimos 7 dias passou bastante da base. Melhor manter leve ou trocar por natacao/mobilidade."]);
  if (ratio > 0 && ratio < 0.55 && distance28 > 0) insights.push(["Base caiu", "A carga de corrida recente esta abaixo da media. Retome por volume facil antes de tiro forte."]);
  if (avgPace && longest && Number(longest.distance) >= 5) insights.push(["Base mensuravel", `Seu longo recente foi ${longest.distance}km. Use pace ${formatPace(avgPace)} como referencia conservadora de base.`]);
  if (body?.pain >= 4 && last28.length) insights.push(["Dor muda a leitura", "Com dor corporal recente, queda de pace pode ser fadiga local e nao perda de condicionamento."]);
  if (state.workouts.some((workout) => workout.type === "academia" && workout.date >= offsetDate(-2))) insights.push(["Contexto hibrido", "Se fez pernas pesado nos ultimos dias, compare corrida por RPE e nao so por pace."]);
  if (!insights.length) insights.push(["Corrida sob controle", "Volume, pace e carga estao coerentes com os dados atuais. Boa fase para construir consistencia."]);
  return insights;
}

function paceZones() {
  const { avgPace, bestEstimate } = runningSummary();
  const racePace = bestEstimate?.label === "5k" ? bestEstimate.minutes / 5 : bestEstimate?.label === "10k" ? bestEstimate.minutes / 10 : 0;
  const anchor = racePace || avgPace || 6.5;
  return [
    { label: "Z2 facil", range: [anchor + 0.9, anchor + 1.7], note: "conversa inteira, base aerobica" },
    { label: "Longo confortavel", range: [anchor + 0.65, anchor + 1.25], note: "volume sem quebrar a semana" },
    { label: "Ritmo controlado", range: [anchor + 0.2, anchor + 0.55], note: "progressivo ou bloco moderado" },
    { label: "Tempo forte", range: [anchor - 0.05, anchor + 0.18], note: "curto, exige corpo bom" },
    { label: "Tiros", range: [Math.max(3.2, anchor - 0.55), Math.max(3.4, anchor - 0.2)], note: "usar com parcimonia" }
  ];
}

function runPrescriptions() {
  const { avgPace, acuteLoad, chronicLoad, distance28, longest } = runningSummary();
  const body = latestBodyLog();
  const ratio = chronicLoad ? acuteLoad / chronicLoad : 0;
  const basePace = avgPace || 6.5;
  const longDistance = Number(longest?.distance || 5);
  if (body?.pain >= 5 || ratio > 1.35) {
    return [
      { type: "Recuperacao", title: "Rodagem muito leve", detail: `20-30min em ${formatPace(basePace + 1.2)}-${formatPace(basePace + 1.8)}/km ou natacao leve`, reason: "dor/carga pedem reduzir impacto" },
      { type: "Tecnica", title: "Mobilidade + strides opcionais", detail: "10min mobilidade, 4x15s solto se estiver sem dor", reason: "mantem gesto sem somar muita carga" }
    ];
  }
  if (!distance28) {
    return [
      { type: "Base", title: "Primeira corrida calibradora", detail: "30min leve + registrar RPE, dor e distancia", reason: "precisamos de referencia real" }
    ];
  }
  if (ratio < 0.7) {
    return [
      { type: "Base", title: "Retomada facil", detail: `35-45min em ${formatPace(basePace + 0.8)}-${formatPace(basePace + 1.4)}/km`, reason: "base recente abaixo do normal" },
      { type: "Progressivo", title: "Final controlado", detail: `30min leve + 10min perto de ${formatPace(basePace + 0.35)}/km`, reason: "acorda ritmo sem virar teste" }
    ];
  }
  return [
    { type: "Base", title: "Rodagem Z2", detail: `40-50min em ${formatPace(basePace + 0.8)}-${formatPace(basePace + 1.4)}/km`, reason: "construir motor sem atrapalhar academia" },
    { type: "Progressivo", title: "Progressivo curto", detail: `15min facil + 3x6min em ${formatPace(basePace + 0.25)}/km com 2min leve`, reason: "melhora controle sem virar prova" },
    { type: "Longo", title: "Longo pessoal", detail: `${Math.round(Math.min(longDistance * 1.12, longDistance + 1.2) * 10) / 10}km facil`, reason: "aumenta teto com incremento conservador" }
  ];
}

function renderRunningLab() {
  const { all, distance28, avgPace, acuteLoad, chronicLoad, bestEstimate, longest } = runningSummary();
  $("#runDistanceMetric").textContent = `${Math.round(distance28 * 10) / 10}km`;
  $("#runPaceMetric").textContent = avgPace ? `${formatPace(avgPace)}` : "--";
  $("#runBestMetric").textContent = bestEstimate ? `${bestEstimate.label} ${formatPace(bestEstimate.minutes)}` : longest ? `${longest.distance}km` : "--";
  $("#runLoadMetric").textContent = chronicLoad ? `${acuteLoad}/${chronicLoad}` : acuteLoad;

  const maxDistance = Math.max(1, ...weeklyRunningTrend().map((week) => week.distance));
  $("#runTrend").innerHTML = weeklyRunningTrend().map((week) => `
    <div class="run-week">
      <span>${week.label}</span>
      <div class="run-bar"><i style="width:${Math.max(4, Math.round((week.distance / maxDistance) * 100))}%"></i></div>
      <strong>${Math.round(week.distance * 10) / 10}km</strong>
      <small>${week.pace ? formatPace(week.pace) : "--"}</small>
    </div>
  `).join("");

  $("#runInsights").innerHTML = runningInsights().map(([title, text]) => `<div class="insight-card"><strong>${title}</strong><small>${text}</small></div>`).join("");
  $("#runPrescriptionList").innerHTML = runPrescriptions().map((item) => `
    <button type="button" class="run-prescription" data-run-prescription="${encodeURIComponent(JSON.stringify(item))}">
      <span>${item.type}</span>
      <strong>${item.title}</strong>
      <small>${item.detail}</small>
      <em>${item.reason}</em>
    </button>
  `).join("");
  $("#paceZoneList").innerHTML = paceZones().map((zone) => `
    <div class="pace-zone">
      <span>${zone.label}</span>
      <strong>${formatPace(zone.range[0])}-${formatPace(zone.range[1])}/km</strong>
      <small>${zone.note}</small>
    </div>
  `).join("");
  const withRoute = all.find((workout) => workout.route?.splits?.length || workout.route?.points?.length);
  $("#routeLab").innerHTML = withRoute ? routeLabHtml(withRoute) : recentRunsHtml(all);
}

function routeLabHtml(workout) {
  const splits = workout.route?.splits || [];
  const points = workout.route?.points || [];
  const similar = similarRuns(workout);
  const pace = Number(workout.duration) / Number(workout.distance || 1);
  return `
    <div class="route-focus">
      ${routeSvg(points)}
      <div class="route-summary">
        <strong>${workout.name}</strong>
        <span>${formatDate(workout.date)} - ${workout.distance}km - ${formatPace(pace)}/km - elev +${Math.round(workout.route?.elevationGain || 0)}m</span>
        <span>${routeVerdict(workout)}</span>
      </div>
    </div>
    <div class="split-grid">
      ${splits.length ? splits.slice(0, 12).map((split) => splitHtml(split, splits)).join("") : '<p class="empty-state">Sem splits por km nesse arquivo.</p>'}
    </div>
    <div class="route-compare">
      <strong>Segmentos pessoais</strong>
      ${similar.length ? similar.slice(0, 4).map((run) => `<div><span>${formatDate(run.date)} - ${run.distance}km</span><b>${formatPace(Number(run.duration) / Number(run.distance || 1))}/km</b></div>`).join("") : "<small>Sem rota parecida ainda. Importe a mesma volta algumas vezes para comparar como um segmento privado.</small>"}
    </div>
    <div class="route-points">${points.length ? `${points.length} pontos guardados como amostra compacta para mapa futuro.` : "Sem amostra de pontos."}</div>
  `;
}

function splitHtml(split, splits) {
  const pace = split.pace || split.duration;
  const paces = splits.map((item) => item.pace || item.duration).filter(Boolean);
  const best = Math.min(...paces);
  const worst = Math.max(...paces);
  const tone = pace === best ? "best" : pace === worst ? "slow" : "";
  return `<div class="${tone}"><span>km ${split.km}</span><strong>${formatPace(pace)}</strong></div>`;
}

function routeVerdict(workout) {
  const splits = workout.route?.splits || [];
  if (splits.length >= 4) {
    const firstHalf = splits.slice(0, Math.floor(splits.length / 2));
    const secondHalf = splits.slice(Math.floor(splits.length / 2));
    const avg = (items) => items.reduce((sum, split) => sum + Number(split.pace || split.duration || 0), 0) / Math.max(1, items.length);
    const first = avg(firstHalf);
    const second = avg(secondHalf);
    if (second < first * 0.97) return "Final progressivo: ritmo melhorou na segunda metade.";
    if (second > first * 1.06) return "Queda no final: pode ser fadiga, calor, subida ou carga acumulada.";
  }
  if (Number(workout.route?.elevationGain || 0) > Number(workout.distance || 0) * 12) return "Rota com subida relevante: compare por esforco, nao so por pace.";
  return "Rota pronta para virar segmento privado quando houver repeticoes.";
}

function routeSvg(points) {
  if (!points?.length) return '<div class="route-map empty">Sem mapa</div>';
  const width = 360;
  const height = 170;
  const lats = points.map((point) => point.lat);
  const lons = points.map((point) => point.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const pad = 16;
  const xScale = (width - pad * 2) / Math.max(0.000001, maxLon - minLon);
  const yScale = (height - pad * 2) / Math.max(0.000001, maxLat - minLat);
  const coords = points.map((point) => {
    const x = pad + (point.lon - minLon) * xScale;
    const y = height - pad - (point.lat - minLat) * yScale;
    return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
  }).join(" ");
  const start = coords.split(" ")[0];
  const end = coords.split(" ").at(-1);
  const [sx, sy] = start.split(",");
  const [ex, ey] = end.split(",");
  return `
    <svg class="route-map" viewBox="0 0 ${width} ${height}" role="img" aria-label="Mapa simplificado da rota">
      <defs>
        <linearGradient id="routeStroke" x1="0" x2="1">
          <stop offset="0%" stop-color="var(--accent)" />
          <stop offset="100%" stop-color="var(--teal)" />
        </linearGradient>
      </defs>
      <polyline points="${coords}" fill="none" stroke="url(#routeStroke)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${sx}" cy="${sy}" r="5" fill="var(--accent)" />
      <circle cx="${ex}" cy="${ey}" r="5" fill="var(--red)" />
    </svg>
  `;
}

function similarRuns(workout) {
  const distance = Number(workout.distance || 0);
  const points = workout.route?.points || [];
  const start = points[0];
  const end = points.at(-1);
  return runningWorkouts()
    .filter((run) => run.id !== workout.id)
    .filter((run) => Math.abs(Number(run.distance || 0) - distance) <= Math.max(0.6, distance * 0.12))
    .filter((run) => {
      const runPoints = run.route?.points || [];
      if (!start || !end || !runPoints.length) return true;
      const runStart = runPoints[0];
      const runEnd = runPoints.at(-1);
      return haversine(start.lat, start.lon, runStart.lat, runStart.lon) < 220 && haversine(end.lat, end.lon, runEnd.lat, runEnd.lon) < 220;
    })
    .sort((a, b) => (Number(a.duration) / Number(a.distance || 1)) - (Number(b.duration) / Number(b.distance || 1)));
}

function recentRunsHtml(runs) {
  return runs.length
    ? runs.slice(0, 5).map((run) => `<div class="route-summary"><strong>${run.name}</strong><span>${formatDate(run.date)} - ${run.distance}km - ${formatPace(Number(run.duration) / Number(run.distance || 1))}/km</span></div>`).join("")
    : '<p class="empty-state">Importe uma corrida GPX/TCX ou registre distancia para ativar o Route Lab.</p>';
}

function renderProgress() {
  const last28 = workoutsSince(28);
  const activeDays = new Set(last28.map((item) => item.date)).size;
  const currentLoad = loadSum(currentWeekWorkouts());
  const previousLoad = loadSum(previousWeekWorkouts());
  const delta = previousLoad ? Math.round(((currentLoad - previousLoad) / previousLoad) * 100) : 0;
  const records = buildRecords();
  const exercises = parseExerciseDetails();
  const bestLoad = records.find((item) => item.label === "Maior carga");

  $("#consistencyMetric").textContent = `${Math.round((activeDays / 28) * 100)}%`;
  $("#weekDeltaMetric").textContent = `${delta > 0 ? "+" : ""}${delta}%`;
  $("#bestLoadMetric").textContent = bestLoad?.value || 0;
  $("#recordCountMetric").textContent = records.length + exercises.length;

  $("#sportBreakdown").innerHTML = buildSportBreakdown().length
    ? buildSportBreakdown().map((item) => `
      <div class="progress-card">
        <strong>${item.label}</strong>
        <small>${item.sessions} sessoes - ${item.minutes}min - carga ${item.load}${item.distance ? ` - distancia ${item.distance}` : ""}</small>
        <div class="progress-bar"><span style="width:${Math.min(100, item.pct)}%"></span></div>
      </div>
    `).join("")
    : '<p class="empty-state">Sem treinos para analisar ainda.</p>';

  $("#insightList").innerHTML = buildInsights().map(([title, text]) => `
    <div class="insight-card"><strong>${title}</strong><small>${text}</small></div>
  `).join("");

  $("#recordGrid").innerHTML = records.length
    ? records.map((item) => `<div class="record-card"><strong>${item.label}: ${item.value}</strong><small>${item.detail}</small></div>`).join("")
    : '<p class="empty-state">Sem recordes suficientes ainda.</p>';

  $("#exerciseGrid").innerHTML = exercises.length
    ? exercises.map((item) => `<div class="exercise-card"><strong>${item.name}</strong><small>${item.count} registros - melhor peso ${item.bestWeight || "-"}kg - melhor volume ${Math.round(item.bestVolume)}</small></div>`).join("")
    : '<p class="empty-state">Use detalhes como "supino 4x8 70kg" para detectar exercicios.</p>';

  renderSportModules();
  renderRunningLab();
}

function activeSeason() {
  const today = todayIso();
  return state.seasons.find((season) => season.start <= today && season.end >= today) || state.seasons.at(-1);
}

function seasonWeeks(season) {
  if (!season) return [];
  const start = new Date(`${season.start}T12:00:00`);
  const end = new Date(`${season.end}T12:00:00`);
  const weeks = [];
  let cursor = new Date(start);
  let index = 1;
  while (cursor <= end && index <= 16) {
    const phase = ["base", "carga", "pico", "deload"][(index - 1) % 4];
    weeks.push({ index, phase, date: cursor.toISOString().slice(0, 10) });
    cursor.setDate(cursor.getDate() + 7);
    index += 1;
  }
  return weeks;
}

function renderSeasons() {
  $("#seasonList").innerHTML = state.seasons.length ? state.seasons.map((season) => `
    <div class="season-card">
      <strong>${season.name}</strong>
      <small>${season.objective} - ${formatDate(season.start)} ate ${formatDate(season.end)} - ${season.sessionsPerWeek} sessoes/sem</small>
      ${season.note ? `<small>${season.note}</small>` : ""}
      <div class="card-actions">
        <button type="button" data-season-action="edit" data-id="${season.id}">Editar</button>
        <button type="button" data-season-action="delete" data-id="${season.id}">Excluir</button>
      </div>
    </div>
  `).join("") : '<p class="empty-state">Nenhuma temporada planejada ainda.</p>';
}

function renderPeriodization() {
  const season = activeSeason();
  $("#periodizationGrid").innerHTML = season ? seasonWeeks(season).map((week) => `
    <div class="period-card">
      <strong>Semana ${week.index}</strong>
      <small>${week.phase} - inicio ${formatDate(week.date)}</small>
    </div>
  `).join("") : '<p class="empty-state">Crie uma temporada para ver a periodizacao.</p>';
}

function renderPlan() {
  const week = currentWeekWorkouts();
  $("#planGrid").innerHTML = weekDays.map((day) => {
    const dayWorkouts = week.filter((workout) => new Date(`${workout.date}T12:00:00`).getDay() === day.key);
    return `
      <div class="plan-day">
        <strong>${day.label}</strong>
        ${dayWorkouts.length ? dayWorkouts.map((item) => `<span>${presetLabel(item.type)}</span><small>${item.name} - ${item.status}</small>`).join("") : "<span>sem treino</span><small>clique em gerar base para planejar</small>"}
      </div>
    `;
  }).join("");
  renderSeasons();
  renderPeriodization();
}

function renderBody() {
  const ordered = [...state.bodyLogs].sort((a, b) => b.date.localeCompare(a.date));
  $("#bodyList").innerHTML = ordered.length ? ordered.map((item) => `
    <div class="body-item">
      <strong>${formatDate(item.date)}</strong>
      <div class="card-meta">peso ${item.weight || "-"}kg - sono ${item.sleep || "-"}h - energia ${item.energy || "-"} - dor ${item.pain || "0"} - estresse ${item.stress || "-"}</div>
      <div class="card-meta">nutri ${item.nutrition || "-"} - humor ${item.mood || "-"} - cintura ${item.waist || "-"}cm - peito ${item.chest || "-"}cm - quadril ${item.hip || "-"}cm</div>
      ${item.painAreas ? `<div class="card-meta">areas: ${item.painAreas}</div>` : ""}
      ${item.note ? `<div class="card-meta">${item.note}</div>` : ""}
      <div class="card-actions">
        <button type="button" data-body-action="edit" data-id="${item.id}">Editar</button>
        <button type="button" data-body-action="delete" data-id="${item.id}">Excluir</button>
      </div>
    </div>
  `).join("") : '<p class="empty-state">Nenhuma leitura corporal ainda.</p>';
}

function exerciseCalories(date = todayIso()) {
  const factors = { academia: 6.5, natacao: 8, futevolei: 7, corrida: 10, mobilidade: 3, outro: 5 };
  return state.workouts
    .filter((workout) => workout.date === date && workout.status !== "pulado")
    .reduce((sum, workout) => sum + Math.round(Number(workout.duration || 0) * (factors[workout.type] || 5)), 0);
}

function nutritionSummary(date = todayIso()) {
  const items = state.foodLogs.filter((item) => item.date === date);
  const consumed = items.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const protein = items.reduce((sum, item) => sum + Number(item.protein || 0), 0);
  const carbs = items.reduce((sum, item) => sum + Number(item.carbs || 0), 0);
  const fat = items.reduce((sum, item) => sum + Number(item.fat || 0), 0);
  const burned = exerciseCalories(date);
  const goal = state.nutritionGoals.calories;
  const net = consumed - burned;
  return { items, consumed, protein, carbs, fat, burned, goal, net, remaining: goal - net };
}

function renderNutrition() {
  if (!$("#nutritionKpis")) return;
  const summary = nutritionSummary(foodFields.date.value || todayIso());
  const proteinGoal = state.nutritionGoals.protein;
  $("#nutritionKpis").innerHTML = moduleKpis([
    ["Consumido", `${summary.consumed} kcal`, `${summary.items.length} alimento(s)`],
    ["Gasto treino", `${summary.burned} kcal`, "estimado pelo treino do dia"],
    ["Saldo", `${summary.net} kcal`, `${summary.remaining >= 0 ? summary.remaining : Math.abs(summary.remaining)} kcal ${summary.remaining >= 0 ? "restantes" : "acima"}`],
    ["Proteina", `${Math.round(summary.protein)}g`, `meta ${proteinGoal}g`]
  ]);
  $("#foodCatalogSelect").innerHTML = foodCatalog.map((food) => `<option value="${food.id}">${food.name} - ${food.serving}</option>`).join("");
  $("#goalCalories").value = state.nutritionGoals.calories;
  $("#goalProtein").value = state.nutritionGoals.protein;
  $("#goalWater").value = state.nutritionGoals.water;
  $("#foodList").innerHTML = summary.items.length ? summary.items.map((item) => `
    <div class="food-item">
      <div>
        <strong>${item.meal} - ${item.name}</strong>
        <small>${item.servings} porcao(oes) - ${item.calories} kcal - P ${item.protein}g / C ${item.carbs}g / G ${item.fat}g</small>
        ${item.note ? `<small>${item.note}</small>` : ""}
      </div>
      <button type="button" class="icon-button" data-food-action="delete" data-id="${item.id}">x</button>
    </div>
  `).join("") : '<p class="empty-state">Nenhum alimento registrado nesta data.</p>';
  $("#foodCatalogGrid").innerHTML = foodCatalog.filter((food) => food.id !== "custom").map((food) => `
    <button type="button" data-food-pick="${food.id}">
      <strong>${food.name}</strong>
      <span>${food.calories} kcal</span>
      <small>${food.serving} - P ${food.protein}g / C ${food.carbs}g / G ${food.fat}g</small>
    </button>
  `).join("");
}

function fillFoodFromCatalog(id = foodFields.catalog.value) {
  const food = foodCatalog.find((item) => item.id === id) || foodCatalog.at(-1);
  foodFields.catalog.value = food.id;
  foodFields.servings.value = 1;
  foodFields.calories.value = food.calories || "";
  foodFields.protein.value = food.protein || "";
  foodFields.carbs.value = food.carbs || "";
  foodFields.fat.value = food.fat || "";
}

function resetFoodForm() {
  foodFields.id.value = "";
  foodFields.date.value = todayIso();
  foodFields.meal.value = "Lanche";
  foodFields.note.value = "";
  fillFoodFromCatalog(foodCatalog[0].id);
}

function foodFromForm() {
  const catalog = foodCatalog.find((food) => food.id === foodFields.catalog.value) || foodCatalog.at(-1);
  return normalizeFoodLog({
    id: foodFields.id.value || uid("food"),
    date: foodFields.date.value,
    meal: foodFields.meal.value,
    foodId: catalog.id,
    name: catalog.id === "custom" ? "Personalizado" : catalog.name,
    servings: foodFields.servings.value,
    calories: foodFields.calories.value,
    protein: foodFields.protein.value,
    carbs: foodFields.carbs.value,
    fat: foodFields.fat.value,
    note: foodFields.note.value
  });
}

function renderLibrary() {
  $("#favoriteGrid").innerHTML = state.favorites.length ? state.favorites.map((item) => `
    <div class="favorite-card">
      <strong>${item.name}</strong>
      <div class="card-meta">${presetLabel(item.type)} - ${item.duration}min - ${item.intensity}</div>
      <div class="card-actions">
        <button type="button" data-favorite-action="use" data-id="${item.id}">Usar</button>
        <button type="button" data-favorite-action="delete" data-id="${item.id}">Excluir</button>
      </div>
    </div>
  `).join("") : '<p class="empty-state">Salve favoritos a partir do formulario de treino.</p>';

  $("#templateList").innerHTML = state.templates.map((item) => `
    <div class="template-card">
      <strong>${item.name}</strong>
      <div class="card-meta">${presetLabel(item.type)} - ${item.detail}</div>
      <div class="card-actions"><button type="button" data-template-action="use" data-id="${item.id}">Usar como treino</button></div>
    </div>
  `).join("");
}

function renderPreview() {
  if (!pendingImport.length) {
    $("#importPreview").innerHTML = "";
    return;
  }
  const stats = importMergeStats(pendingImport);
  $("#importPreview").innerHTML = `
    <div class="preview-row">
      <div>
        <strong>${pendingImport.length} treino(s) prontos para importar</strong>
        <div class="card-meta">Preview: ${pendingImport.slice(0, 3).map((item) => item.name).join(", ")}</div>
        <div class="card-meta">Mesclagem: ${stats.added} novo(s), ${stats.skippedExisting} ja existente(s), ${stats.skippedInternal} duplicado(s) no arquivo.</div>
        ${pendingImportErrors.length ? `<div class="card-meta">${pendingImportErrors.slice(0, 5).join(" | ")}</div>` : ""}
      </div>
      <div class="preview-actions">
        <button type="button" id="confirmMergeButton">Mesclar</button>
        <button type="button" id="confirmReplaceButton">Substituir</button>
        <button type="button" id="cancelImportButton">Cancelar</button>
      </div>
    </div>
  `;
}

function renderBackupStatus() {
  const backups = loadAutoBackups();
  const latest = backups.at(-1);
  $("#backupHint").textContent = latest
    ? `Auto-backup local: ${new Date(latest.createdAt).toLocaleString("pt-BR")} (${backups.length}/7 snapshots guardados).`
    : "Auto-backup local ainda nao criado. Um snapshot sera criado automaticamente.";
}

function renderDataHealth() {
  const target = $("#dataHealthGrid");
  if (!target) return;
  const kb = Math.round((dataHealth.storageBytes / 1024) * 10) / 10;
  target.innerHTML = `
    <div><span>Persistencia</span><strong>${dataHealth.driver}</strong><small>${dataHealth.indexedDb}</small></div>
    <div><span>Ultimo save</span><strong>${dataHealth.lastSavedAt ? new Date(dataHealth.lastSavedAt).toLocaleTimeString("pt-BR") : "--"}</strong><small>${dataHealth.migrated ? "migrado" : "local"}</small></div>
    <div><span>Tamanho</span><strong>${kb}kb</strong><small>${dataHealth.error || "dados saudaveis"}</small></div>
  `;
}

function renderUserPanel() {
  applyAppearance();
  const workoutCount = $("#userWorkoutCount");
  const backupCount = $("#userBackupCount");
  if (workoutCount) workoutCount.textContent = state.workouts.length;
  if (backupCount) backupCount.textContent = loadAutoBackups().length;
}

function render() {
  saveState();
  renderActivityFocus();
  renderPresets();
  renderQuickStart();
  renderDailyCheck();
  renderMetrics();
  renderWeeklyCoach();
  renderWorkoutList();
  renderWeek();
  renderPlan();
  renderHistory();
  renderProgress();
  renderNutrition();
  renderBody();
  renderLibrary();
  renderPreview();
  renderBackupStatus();
  renderDataHealth();
  renderUserPanel();
  renderXpDashboard();
  renderTimer();
}

function upsertWorkout(workout) {
  const index = state.workouts.findIndex((item) => item.id === workout.id);
  if (index >= 0) state.workouts[index] = workout;
  else state.workouts.push(workout);
}

function mergeWorkouts(items) {
  const existingKeys = new Set(state.workouts.map(workoutKey));
  const incomingKeys = new Set();
  const stats = { added: 0, skippedExisting: 0, skippedInternal: 0 };
  items.forEach((item) => {
    const key = workoutKey(item);
    if (existingKeys.has(key)) {
      stats.skippedExisting += 1;
      return;
    }
    if (incomingKeys.has(key)) {
      stats.skippedInternal += 1;
      return;
    }
    incomingKeys.add(key);
    existingKeys.add(key);
    state.workouts.push(item);
    stats.added += 1;
  });
  return stats;
}

function importMergeStats(items) {
  const existingKeys = new Set(state.workouts.map(workoutKey));
  const incomingKeys = new Set();
  const stats = { added: 0, skippedExisting: 0, skippedInternal: 0 };
  items.forEach((item) => {
    const key = workoutKey(item);
    if (existingKeys.has(key)) {
      stats.skippedExisting += 1;
      return;
    }
    if (incomingKeys.has(key)) {
      stats.skippedInternal += 1;
      return;
    }
    incomingKeys.add(key);
    stats.added += 1;
  });
  return stats;
}

function workoutKey(item) {
  return [item.date, item.type, item.name, item.duration, item.intensity].join("|").toLowerCase();
}

function duplicateGroups() {
  const groups = new Map();
  state.workouts.forEach((workout) => {
    const key = workoutKey(workout);
    const items = groups.get(key) || [];
    items.push(workout);
    groups.set(key, items);
  });
  return [...groups.values()].filter((items) => items.length > 1);
}

function renderDuplicateAudit() {
  const groups = duplicateGroups();
  $("#duplicateAudit").innerHTML = groups.length ? groups.map((items, index) => `
    <div class="duplicate-card">
      <strong>Duplicado ${index + 1}: ${items[0].name}</strong>
      <small>${items.length} registros em ${formatDate(items[0].date)} - ${presetLabel(items[0].type)}</small>
      <div class="card-actions">
        <button type="button" data-duplicate-action="keep-first" data-key="${encodeURIComponent(workoutKey(items[0]))}">Manter primeiro</button>
      </div>
    </div>
  `).join("") : '<p class="empty-state">Nenhum duplicado exato encontrado.</p>';
}

function removeDuplicateGroup(key) {
  const seen = new Set();
  state.workouts = state.workouts.filter((workout) => {
    const current = workoutKey(workout);
    if (current !== key) return true;
    if (seen.has(current)) return false;
    seen.add(current);
    return true;
  });
}

function parseQuickText(text) {
  const lower = text.toLowerCase();
  const type = presets.find((preset) => lower.includes(preset.type) || lower.includes(preset.label.toLowerCase()))?.type || "outro";
  const minutes = Number(lower.match(/(\d+)\s*(min|m)/)?.[1] || presets.find((preset) => preset.type === type)?.duration || 45);
  const intensity = ["maximo", "forte", "moderado", "leve"].find((item) => lower.includes(item)) || "moderado";
  const date = lower.includes("ontem") ? offsetDate(-1) : todayIso();
  const clean = text.replace(/(\d+)\s*(min|m)/i, "").replace(/hoje|ontem|leve|moderado|forte|maximo/gi, "").trim();
  const name = clean || presets.find((preset) => preset.type === type)?.defaultName || "Treino livre";
  return normalizeWorkout({ type, name, date, duration: minutes, intensity, note: text });
}

function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function toCsv(items) {
  const headers = ["date", "type", "name", "duration", "intensity", "status", "rpe", "energy", "pain", "distance", "volume", "focus", "location", "note", "details"];
  const rows = items.map((item) => headers.map((key) => csvCell(item[key])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function csvCell(value) {
  const text = String(value ?? "").replace(/\r?\n/g, " / ");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).filter(Boolean).map(splitCsvLine);
  const headers = rows.shift()?.map(normalizeCsvHeader) || [];
  const errors = [];
  const items = rows.map((row, index) => {
    const raw = Object.fromEntries(headers.map((header, colIndex) => [header, row[colIndex] || ""]));
    raw.details ||= buildCsvDetails(raw);
    const item = normalizeWorkout(raw);
    if (!raw.date && !raw.data) errors.push(`Linha ${index + 2}: sem data, usei hoje.`);
    if (!raw.duration && !raw.duracao && !raw.tempo) errors.push(`Linha ${index + 2}: sem duracao, usei 30min.`);
    if (!raw.type && !raw.tipo && !raw.modalidade) errors.push(`Linha ${index + 2}: sem modalidade, usei outro.`);
    return item;
  });
  return { items, errors };
}

function normalizeCsvHeader(header) {
  const key = String(header || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const aliases = {
    data: "date",
    dia: "date",
    modalidade: "type",
    tipo: "type",
    esporte: "type",
    nome: "name",
    treino: "name",
    titulo: "name",
    tempo: "duration",
    duracao: "duration",
    minutos: "duration",
    intensidade: "intensity",
    esforco: "intensity",
    estado: "status",
    energia: "energy",
    dor: "pain",
    distancia: "distance",
    km: "distance",
    carga: "volume",
    metragem: "volume",
    volume_total: "volume",
    foco: "focus",
    local: "location",
    observacao: "note",
    observacoes: "note",
    nota: "note",
    notas: "note",
    detalhes: "details",
    blocos: "details",
    exercicio: "exercise",
    exercicios: "exercise",
    series: "sets",
    sets: "sets",
    repeticoes: "reps",
    reps: "reps",
    repeticao: "reps",
    peso: "weight",
    descanso: "rest",
    estilo: "style",
    ritmo: "pace",
    dupla: "partner",
    parceiro: "partner",
    resultado: "result"
  };
  return aliases[key] || key;
}

function buildCsvDetails(raw) {
  const parts = [];
  if (raw.exercise || raw.sets || raw.reps || raw.weight || raw.rest) {
    const exercise = raw.exercise || "Exercicio";
    const scheme = [raw.sets && `${raw.sets} series`, raw.reps && `${raw.reps} reps`, raw.weight && `${raw.weight}kg`, raw.rest && `${raw.rest} descanso`].filter(Boolean).join(" - ");
    parts.push([exercise, scheme].filter(Boolean).join(": "));
  }
  if (raw.style || raw.pace) {
    parts.push([raw.style && `estilo ${raw.style}`, raw.pace && `ritmo ${raw.pace}`].filter(Boolean).join(" - "));
  }
  if (raw.partner || raw.result) {
    parts.push([raw.partner && `dupla ${raw.partner}`, raw.result && `resultado ${raw.result}`].filter(Boolean).join(" - "));
  }
  return parts.join("\n");
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseGpx(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const points = [...doc.querySelectorAll("trkpt")];
  const times = points.map((point) => point.querySelector("time")?.textContent).filter(Boolean);
  const route = routeFromGpxPoints(points);
  const distance = gpxDistance(points);
  const start = times[0] ? new Date(times[0]) : new Date();
  const end = times.at(-1) ? new Date(times.at(-1)) : start;
  const minutes = Math.max(1, Math.round((end - start) / 60000) || 45);
  return [normalizeWorkout({
    type: "corrida",
    name: "Atividade GPX",
    date: start.toISOString().slice(0, 10),
    duration: minutes,
    distance,
    intensity: "moderado",
    note: "Importado de GPX",
    details: route.splits.length ? `splits: ${route.splits.slice(0, 8).map((split) => `km${split.km} ${formatPace(split.pace)}`).join(" | ")}\nelevacao +${Math.round(route.elevationGain)}m` : "Importado de GPX",
    route
  })];
}

function parseTcx(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const activity = doc.querySelector("Activity");
  const sport = String(activity?.getAttribute("Sport") || "corrida").toLowerCase();
  const points = [...doc.querySelectorAll("Trackpoint")];
  const times = points.map((point) => point.querySelector("Time")?.textContent).filter(Boolean);
  const distances = points.map((point) => Number(point.querySelector("DistanceMeters")?.textContent || 0)).filter(Boolean);
  const route = routeFromTcxPoints(points);
  const start = times[0] ? new Date(times[0]) : new Date();
  const end = times.at(-1) ? new Date(times.at(-1)) : start;
  const meters = Math.max(...distances, 0);
  const minutes = Math.max(1, Math.round((end - start) / 60000) || 45);
  const type = sport.includes("biking") || sport.includes("running") ? "corrida" : "outro";
  return [normalizeWorkout({
    type,
    name: `Atividade TCX${sport ? ` - ${sport}` : ""}`,
    date: start.toISOString().slice(0, 10),
    duration: minutes,
    distance: Math.round((meters / 1000) * 10) / 10,
    intensity: "moderado",
    note: "Importado de TCX",
    details: route.splits.length ? `splits: ${route.splits.slice(0, 8).map((split) => `km${split.km} ${formatPace(split.pace)}`).join(" | ")}\nelevacao +${Math.round(route.elevationGain)}m` : "Importado de TCX",
    route
  })];
}

function routeFromGpxPoints(points) {
  const clean = points.map((point) => ({
    lat: Number(point.getAttribute("lat")),
    lon: Number(point.getAttribute("lon")),
    ele: Number(point.querySelector("ele")?.textContent || 0),
    time: point.querySelector("time")?.textContent ? new Date(point.querySelector("time").textContent).getTime() : 0
  })).filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));
  return routeFromTimedPoints(clean, "gpx");
}

function routeFromTcxPoints(points) {
  const clean = points.map((point) => {
    const position = point.querySelector("Position");
    return {
      lat: Number(position?.querySelector("LatitudeDegrees")?.textContent),
      lon: Number(position?.querySelector("LongitudeDegrees")?.textContent),
      ele: Number(point.querySelector("AltitudeMeters")?.textContent || 0),
      time: point.querySelector("Time")?.textContent ? new Date(point.querySelector("Time").textContent).getTime() : 0,
      distanceMeters: Number(point.querySelector("DistanceMeters")?.textContent || 0)
    };
  }).filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));
  return routeFromTimedPoints(clean, "tcx");
}

function routeFromTimedPoints(points, source) {
  let total = 0;
  let elevationGain = 0;
  let nextSplit = 1000;
  let splitStartTime = points[0]?.time || 0;
  const splits = [];
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const segment = current.distanceMeters && previous.distanceMeters
      ? Math.max(0, current.distanceMeters - previous.distanceMeters)
      : haversine(previous.lat, previous.lon, current.lat, current.lon);
    total += segment;
    const elevationDelta = current.ele - previous.ele;
    if (elevationDelta > 0) elevationGain += elevationDelta;
    if (total >= nextSplit && current.time && splitStartTime) {
      const duration = Math.max(0.1, (current.time - splitStartTime) / 60000);
      splits.push({ km: splits.length + 1, pace: duration, duration });
      splitStartTime = current.time;
      nextSplit += 1000;
    }
  }
  const step = Math.max(1, Math.ceil(points.length / 80));
  return {
    source,
    elevationGain: Math.round(elevationGain),
    splits,
    points: points.filter((_, index) => index % step === 0).map((point) => ({ lat: point.lat, lon: point.lon }))
  };
}

function gpxDistance(points) {
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    total += haversine(Number(a.getAttribute("lat")), Number(a.getAttribute("lon")), Number(b.getAttribute("lat")), Number(b.getAttribute("lon")));
  }
  return Math.round((total / 1000) * 10) / 10;
}

function haversine(lat1, lon1, lat2, lon2) {
  const radius = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function readFileAsText(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(String(reader.result || "")));
  reader.readAsText(file);
}

function progressReport() {
  const records = buildRecords().map((item) => `- ${item.label}: ${item.value} (${item.detail})`).join("\n") || "- Sem recordes ainda";
  const insights = buildInsights().map(([title, text]) => `- ${title}: ${text}`).join("\n");
  const sports = buildSportBreakdown().map((item) => `- ${item.label}: ${item.sessions} sessoes, ${item.minutes}min, carga ${item.load}`).join("\n") || "- Sem treinos";
  const run = runningSummary();
  const running = run.all.length
    ? `- 28 dias: ${Math.round(run.distance28 * 10) / 10}km\n- Pace medio: ${formatPace(run.avgPace)}/km\n- Carga aguda/base: ${run.acuteLoad}/${run.chronicLoad || 0}`
    : "- Sem corridas com distancia";
  return [
    "# Finfit - Relatorio local",
    "",
    `Gerado em ${new Date().toLocaleString("pt-BR")}`,
    "",
    "## Modalidades",
    sports,
    "",
    "## Recordes",
    records,
    "",
    "## Corrida",
    running,
    "",
    "## Alertas",
    insights
  ].join("\n");
}

function monthlyReport() {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const items = state.workouts.filter((workout) => workout.date.startsWith(month));
  const body = state.bodyLogs.filter((log) => log.date.startsWith(month));
  const bySport = presets.map((preset) => {
    const sportItems = items.filter((item) => item.type === preset.type);
    return {
      label: preset.label,
      count: sportItems.length,
      minutes: sportItems.reduce((sum, item) => sum + Number(item.duration || 0), 0),
      load: loadSum(sportItems),
      distance: sportItems.reduce((sum, item) => sum + Number(item.distance || item.volume || 0), 0)
    };
  }).filter((item) => item.count);
  const best = buildRecords().slice(0, 6).map((item) => `- ${item.label}: ${item.value} (${item.detail})`).join("\n") || "- Sem recordes";
  const avgEnergy = body.length ? Math.round((body.reduce((sum, item) => sum + Number(item.energy || 0), 0) / body.length) * 10) / 10 : "--";
  const avgPain = body.length ? Math.round((body.reduce((sum, item) => sum + Number(item.pain || 0), 0) / body.length) * 10) / 10 : "--";
  return [
    `# Finfit - Relatorio mensal ${month}`,
    "",
    `Gerado em ${new Date().toLocaleString("pt-BR")}`,
    "",
    "## Resumo",
    `- Treinos: ${items.length}`,
    `- Minutos: ${items.reduce((sum, item) => sum + Number(item.duration || 0), 0)}`,
    `- Carga: ${loadSum(items)}`,
    `- Energia media: ${avgEnergy}`,
    `- Dor media: ${avgPain}`,
    "",
    "## Modalidades",
    bySport.map((item) => `- ${item.label}: ${item.count} sessoes, ${item.minutes}min, carga ${item.load}${item.distance ? `, volume/dist ${Math.round(item.distance * 10) / 10}` : ""}`).join("\n") || "- Sem dados",
    "",
    "## Melhores marcas",
    best,
    "",
    "## Coach",
    buildWeeklyCoachActions().map((item) => `- ${item.tag}: ${item.title} - ${item.text}`).join("\n")
  ].join("\n");
}

function cleanData() {
  const before = state.workouts.length;
  const seen = new Set();
  state.workouts = state.workouts.map(normalizeWorkout).filter((workout) => {
    const key = workoutKey(workout);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  state.bodyLogs = state.bodyLogs.map(normalizeBodyLog);
  state.seasons = state.seasons.map(normalizeSeason);
  const removed = before - state.workouts.length;
  createAutoBackup("limpeza");
  $("#dataHint").textContent = `Limpeza concluida: ${removed} duplicado(s) removido(s), dados normalizados e snapshot criado.`;
  render();
}

function handleImport(items, source, errors = []) {
  pendingImport = items.map(normalizeWorkout);
  pendingImportErrors = errors;
  $("#dataHint").textContent = `${pendingImport.length} treino(s) lidos de ${source}. Confirme abaixo para importar.`;
  renderPreview();
}

function resetBodyForm() {
  Object.values(bodyFields).forEach((input) => {
    input.value = "";
  });
  bodyFields.date.value = todayIso();
}

function resetSeasonForm() {
  seasonFields.id.value = "";
  seasonFields.name.value = "";
  seasonFields.objective.value = "condicionamento";
  seasonFields.start.value = todayIso();
  seasonFields.end.value = offsetDate(42);
  seasonFields.sessionsPerWeek.value = 5;
  seasonFields.note.value = "";
}

function seasonFromForm() {
  return normalizeSeason(Object.fromEntries(Object.entries(seasonFields).map(([key, input]) => [key, input.value])));
}

function fillSeasonForm(season) {
  Object.entries(seasonFields).forEach(([key, input]) => {
    input.value = season[key] ?? "";
  });
}

$$("[data-page-target]").forEach((button) => button.addEventListener("click", () => setPage(button.dataset.pageTarget)));

$("#activityFocusGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-sport-focus]");
  if (button) setSportFilter(button.dataset.sportFocus);
});

$("#activityHub").addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-activity-category]");
  if (categoryButton) {
    activeActivityCategory = categoryButton.dataset.activityCategory;
    renderActivityHub();
    return;
  }
  const planButton = event.target.closest("[data-category-plan]");
  if (planButton) {
    const plan = JSON.parse(decodeURIComponent(planButton.dataset.categoryPlan));
    const distanceMatch = plan.detail.match(/(\d+(?:[.,]\d+)?)\s*km/i);
    fillWorkoutForm(normalizeWorkout({
      id: uid("workout"),
      type: plan.type,
      name: plan.title,
      date: todayIso(),
      duration: presets.find((preset) => preset.type === plan.type)?.duration || 45,
      intensity: plan.type === "corrida" && /tiro|ritmo/i.test(plan.title) ? "forte" : "moderado",
      status: "planejado",
      focus: plan.focus === "todos" ? "" : plan.focus,
      distance: distanceMatch ? Number(distanceMatch[1].replace(",", ".")) : "",
      details: plan.detail,
      note: "Recomendado pelo contexto Finfit"
    }));
    $("#quickAdd").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const button = event.target.closest("[data-activity-action]");
  if (!button) return;
  if (button.dataset.activityAction === "new") {
    if (activeSportFilter !== "todos") setPreset(activeSportFilter);
    $("#addWorkoutButton").click();
  }
  if (button.dataset.activityAction === "history") setPage("history");
  if (button.dataset.activityAction === "progress") setPage("progress");
});

$("#coachActionList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-coach-action]");
  if (!button) return;
  const action = button.dataset.coachAction;
  if (action === "new") $("#addWorkoutButton").click();
  if (action === "new-mobility") {
    setPreset("mobilidade");
    $("#addWorkoutButton").click();
  }
  if (action === "today") setPage("today");
  if (action === "progress") setPage("progress");
  if (action === "body") setPage("body");
});

$("#copyCoachButton").addEventListener("click", () => {
  const text = buildWeeklyCoachActions().map((item) => `- ${item.tag}: ${item.title} — ${item.text}`).join("\n");
  navigator.clipboard?.writeText(text);
  $("#copyCoachButton").textContent = "Copiado";
  setTimeout(() => { $("#copyCoachButton").textContent = "Copiar"; }, 1200);
});

$("#themeToggleButton").addEventListener("click", () => {
  const current = loadAppearance();
  const next = current.theme === "dark" ? "black" : current.theme === "black" ? "light" : "dark";
  saveAppearance({ theme: next });
});

$("#themeSelect").addEventListener("change", (event) => saveAppearance({ theme: event.target.value }));
$("#accentSelect").addEventListener("change", (event) => saveAppearance({ accent: event.target.value }));

$(".swatch-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-accent-choice]");
  if (button) saveAppearance({ accent: button.dataset.accentChoice });
});

$("#resetAppearanceButton").addEventListener("click", () => saveAppearance({ theme: "light", accent: "purple" }));

$("#sidebarSearchInput").addEventListener("input", (event) => {
  setPage("history");
  $("#searchInput").value = event.target.value;
  renderHistory();
});

$("#sidebarQuickAdd").addEventListener("click", () => $("#addWorkoutButton").click());
$("#sidebarNewWorkout").addEventListener("click", () => $("#addWorkoutButton").click());
$("#sidebarLiveWorkout").addEventListener("click", () => {
  setPage("today");
  $("#workMode").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#dashboardQuickWorkout").addEventListener("click", () => $("#addWorkoutButton").click());
$("#dashboardQuickLive").addEventListener("click", () => $("#sidebarLiveWorkout").click());

$("#dailyCheckGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-daily-check]");
  if (button) toggleDailyCheck(button.dataset.dailyCheck);
});

$("#dailyUndoButton").addEventListener("click", undoLastTodayWorkout);

$("#dailyCheckPanel").addEventListener("click", (event) => {
  const nextButton = event.target.closest("[data-next-action]");
  if (nextButton) {
    const action = nextButton.dataset.nextAction;
    if (action === "train") {
      setPreset("academia");
      $("#quickAdd").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (action === "recover") addDailyBody("cansado");
    if (action === "body") addDailyBody("ok");
    if (action === "food") addDailyFood("banana");
    if (action === "progress") setPage("progress");
    return;
  }
  const favoriteButton = event.target.closest("[data-daily-favorite]");
  if (favoriteButton) {
    applyTodayFavorite(favoriteButton.dataset.dailyFavorite);
    return;
  }
  const removeWorkout = event.target.closest("[data-daily-remove-workout]");
  if (removeWorkout) {
    event.preventDefault();
    event.stopPropagation();
    removeDailyItem("workout", removeWorkout.dataset.dailyRemoveWorkout);
    return;
  }
  const removeFood = event.target.closest("[data-daily-remove-food]");
  if (removeFood) {
    event.preventDefault();
    event.stopPropagation();
    removeDailyItem("food", removeFood.dataset.dailyRemoveFood);
    return;
  }
  const removeBody = event.target.closest("[data-daily-remove-body]");
  if (removeBody) {
    event.preventDefault();
    event.stopPropagation();
    removeDailyItem("body", removeBody.dataset.dailyRemoveBody);
    return;
  }
  const editWorkout = event.target.closest("[data-daily-edit-workout]");
  if (editWorkout) {
    event.preventDefault();
    event.stopPropagation();
    selectedDailyWorkoutId = editWorkout.dataset.dailyEditWorkout;
    renderDailyCheck();
    return;
  }
  const foodButton = event.target.closest("[data-daily-food]");
  if (foodButton) {
    addDailyFood(foodButton.dataset.dailyFood);
    return;
  }
  const bodyButton = event.target.closest("[data-daily-body]");
  if (bodyButton) {
    addDailyBody(bodyButton.dataset.dailyBody);
    return;
  }
  const focusButton = event.target.closest("[data-daily-focus]");
  if (focusButton) {
    selectedDailyWorkoutId = focusButton.dataset.dailyFocus;
    renderDailyCheck();
    return;
  }
  const fullButton = event.target.closest("[data-daily-select]");
  if (fullButton) {
    const workout = state.workouts.find((item) => item.id === fullButton.dataset.dailySelect);
    if (workout) fillWorkoutForm(workout);
    return;
  }
  if (event.target.closest("#dailyEditSaveButton")) {
    const workout = state.workouts.find((item) => item.id === selectedDailyWorkoutId) || todayWorkouts().at(-1);
    if (!workout) return;
    workout.duration = numberOrBlank($("#dailyEditDuration").value) || workout.duration;
    workout.intensity = $("#dailyEditIntensity").value;
    workout.rpe = numberOrBlank($("#dailyEditRpe").value);
    workout.note = $("#dailyEditNote").value.trim();
    upsertWorkout(normalizeWorkout(workout));
    selectedDailyWorkoutId = workout.id;
    render();
  }
});

$("#sportPresetGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-type]");
  if (button) setPreset(button.dataset.type);
});

$("#detailHelper").addEventListener("click", (event) => {
  const button = event.target.closest("[data-detail-template]");
  if (!button) return;
  const text = decodeURIComponent(button.dataset.detailTemplate);
  fields.details.value = fields.details.value ? `${fields.details.value}\n${text}` : text;
  fields.details.focus();
});

$("#quickStartGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-quick-start]");
  if (button) startSession(button.dataset.quickStart);
});

$("#startPauseButton").addEventListener("click", toggleSessionTimer);
$("#nextSetButton").addEventListener("click", nextSet);
$("#startRestButton").addEventListener("click", startRest);
$("#resetTimerButton").addEventListener("click", resetSession);
$("#finishActiveWorkoutButton").addEventListener("click", finishActiveSession);

$("#workoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  upsertWorkout(workoutFromForm());
  resetForm();
  render();
});

$("#quickTextForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const parsed = parseQuickText($("#quickTextInput").value);
  upsertWorkout(parsed);
  $("#quickTextInput").value = "";
  render();
});

$("#addWorkoutButton").addEventListener("click", () => {
  setPage("today");
  $("#quickAdd").scrollIntoView({ behavior: "smooth", block: "start" });
  fields.name.focus();
});

$("#clearFormButton").addEventListener("click", resetForm);
$("#seedButton").addEventListener("click", () => {
  state = withDefaults(seedState);
  render();
});

$("#workoutList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  if (button.dataset.action === "delete") state.workouts = state.workouts.filter((item) => item.id !== id);
  render();
});

$("#timeline").addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const workout = state.workouts.find((item) => item.id === button.dataset.id);
  if (!workout) return;
  if (button.dataset.action === "edit") fillWorkoutForm(workout);
  if (button.dataset.action === "duplicate") {
    fillWorkoutForm({ ...workout, id: uid("workout"), date: todayIso(), name: `${workout.name} copia` });
  }
  if (button.dataset.action === "delete") {
    state.workouts = state.workouts.filter((item) => item.id !== workout.id);
    render();
  }
});

$("#saveFavoriteButton").addEventListener("click", () => {
  const workout = workoutFromForm();
  state.favorites.push({ ...workout, id: uid("favorite") });
  render();
});

$("#favoriteGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-action]");
  if (!button) return;
  const item = state.favorites.find((favorite) => favorite.id === button.dataset.id);
  if (button.dataset.favoriteAction === "delete") state.favorites = state.favorites.filter((favorite) => favorite.id !== button.dataset.id);
  if (button.dataset.favoriteAction === "use" && item) fillWorkoutForm({ ...item, id: uid("workout"), date: todayIso() });
  render();
});

$("#templateList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-template-action]");
  if (!button) return;
  const template = state.templates.find((item) => item.id === button.dataset.id);
  if (!template) return;
  const preset = presets.find((item) => item.type === template.type) || presets[0];
  fillWorkoutForm(normalizeWorkout({ id: uid("workout"), type: template.type, name: template.name, date: todayIso(), duration: preset.duration, note: template.detail }));
});

$("#addTemplateButton").addEventListener("click", () => {
  const workout = workoutFromForm();
  state.templates.push({ id: uid("template"), type: workout.type, name: workout.name, detail: workout.note || `${workout.duration}min - ${workout.intensity}` });
  render();
});

$("#clearFavoritesButton").addEventListener("click", () => {
  state.favorites = [];
  render();
});

["#searchInput", "#typeFilter", "#statusFilter", "#fromFilter", "#toFilter"].forEach((selector) => {
  $(selector).addEventListener("input", () => {
    if (selector === "#typeFilter") $("#typeFilter").dataset.value = $("#typeFilter").value;
    renderHistory();
  });
});

$("#clearFiltersButton").addEventListener("click", () => {
  $("#searchInput").value = "";
  $("#typeFilter").dataset.value = "";
  $("#statusFilter").value = "";
  $("#fromFilter").value = "";
  $("#toFilter").value = "";
  renderHistory();
});

$("#seasonForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const season = seasonFromForm();
  const index = state.seasons.findIndex((item) => item.id === season.id);
  if (index >= 0) state.seasons[index] = season;
  else state.seasons.push(season);
  resetSeasonForm();
  render();
});

$("#seasonList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-season-action]");
  if (!button) return;
  const season = state.seasons.find((item) => item.id === button.dataset.id);
  if (button.dataset.seasonAction === "delete") state.seasons = state.seasons.filter((item) => item.id !== button.dataset.id);
  if (button.dataset.seasonAction === "edit" && season) fillSeasonForm(season);
  render();
});

$("#clearSeasonFormButton").addEventListener("click", resetSeasonForm);

$("#refreshProgressButton").addEventListener("click", renderProgress);

$("#exportReportButton").addEventListener("click", () => {
  downloadFile(`finfit-relatorio-${todayIso()}.md`, progressReport(), "text/markdown");
});

$("#seedProgressButton").addEventListener("click", () => {
  state.workouts = seedState.workouts.map(normalizeWorkout);
  render();
});

$("#seedRunButton").addEventListener("click", () => {
  const runs = [
    { name: "Corrida base Z2", date: offsetDate(-18), duration: 36, distance: 5.2, rpe: 5, note: "leve, conversa ok", route: { source: "sample", elevationGain: 22, points: sampleRoutePoints(0), splits: [{ km: 1, pace: 6.55 }, { km: 2, pace: 6.48 }, { km: 3, pace: 6.52 }, { km: 4, pace: 6.44 }, { km: 5, pace: 6.38 }] } },
    { name: "Corrida progressiva", date: offsetDate(-9), duration: 42, distance: 6.4, rpe: 7, note: "final mais forte", route: { source: "sample", elevationGain: 35, points: sampleRoutePoints(0.0004), splits: [{ km: 1, pace: 6.5 }, { km: 2, pace: 6.35 }, { km: 3, pace: 6.28 }, { km: 4, pace: 6.12 }, { km: 5, pace: 5.58 }, { km: 6, pace: 5.45 }] } },
    { name: "Longo curto", date: offsetDate(-3), duration: 58, distance: 8.7, rpe: 6, note: "boa base, sem forcar", route: { source: "sample", elevationGain: 48, points: sampleRoutePoints(0.0008), splits: [{ km: 1, pace: 6.48 }, { km: 2, pace: 6.42 }, { km: 3, pace: 6.39 }, { km: 4, pace: 6.35 }, { km: 5, pace: 6.4 }, { km: 6, pace: 6.36 }, { km: 7, pace: 6.31 }, { km: 8, pace: 6.24 }] } }
  ].map((run) => normalizeWorkout({ id: uid("workout"), type: "corrida", intensity: "moderado", status: "feito", focus: "base aerobica", location: "rua", details: "amostra running engine", ...run }));
  mergeWorkouts(runs);
  render();
});

$("#seedStrengthButton").addEventListener("click", () => {
  const samples = [
    { name: "Academia - upper força", date: offsetDate(-8), duration: 65, intensity: "forte", rpe: 8, volume: 8800, details: "supino 4x8 72kg\nremada 4x10 62kg\ndesenvolvimento 3x8 34kg" },
    { name: "Academia - lower", date: offsetDate(-5), duration: 70, intensity: "forte", rpe: 8, volume: 10400, details: "agachamento 4x6 90kg\nstiff 3x8 80kg\nleg press 4x10 140kg" },
    { name: "Academia - upper volume", date: offsetDate(-2), duration: 60, intensity: "moderado", rpe: 7, volume: 7600, details: "supino 3x10 68kg\npuxada 4x10 65kg\nrosca 3x12 16kg" }
  ].map((item) => normalizeWorkout({ id: uid("workout"), type: "academia", status: "feito", focus: "forca", location: "academia", note: "amostra strength engine", ...item }));
  mergeWorkouts(samples);
  render();
});

$("#seedSwimButton").addEventListener("click", () => {
  const samples = [
    { name: "Natação técnica", date: offsetDate(-10), duration: 45, volume: 1500, distance: 1500, focus: "tecnica crawl", details: "400m solto\n8x50m tecnica\n300m moderado" },
    { name: "Natação resistência", date: offsetDate(-4), duration: 55, volume: 1900, distance: 1900, focus: "crawl endurance", details: "600m solto\n6x100m crawl\n400m solto" }
  ].map((item) => normalizeWorkout({ id: uid("workout"), type: "natacao", status: "feito", intensity: "moderado", location: "piscina", note: "amostra swim engine", ...item }));
  mergeWorkouts(samples);
  render();
});

$("#seedBeachButton").addEventListener("click", () => {
  const samples = [
    { name: "Futevôlei - jogo praia", date: offsetDate(-7), duration: 90, intensity: "forte", location: "praia", details: "dupla Rafa\n3 jogos\nresultado 2x1" },
    { name: "Futevôlei - treino técnico", date: offsetDate(-1), duration: 75, intensity: "moderado", location: "arena", details: "dupla João\nsaque e recepção\nresultado treino" }
  ].map((item) => normalizeWorkout({ id: uid("workout"), type: "futevolei", status: "feito", focus: "jogo", note: "amostra beach engine", ...item }));
  mergeWorkouts(samples);
  render();
});

$("#runPrescriptionList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-run-prescription]");
  if (!button) return;
  const item = JSON.parse(decodeURIComponent(button.dataset.runPrescription));
  const duration = Number(item.detail.match(/(\d+)\s*-\s*(\d+)min/)?.[1] || item.detail.match(/(\d+)min/)?.[1] || 40);
  fillWorkoutForm(normalizeWorkout({
    id: uid("workout"),
    type: "corrida",
    name: `Corrida - ${item.title}`,
    date: todayIso(),
    duration,
    intensity: item.type === "Progressivo" ? "forte" : "leve",
    status: "planejado",
    focus: item.type.toLowerCase(),
    note: `${item.detail}. ${item.reason}`,
    details: `Sugestao Finfit\n${item.type}\n${item.detail}\nMotivo: ${item.reason}`
  }));
  setPage("today");
  $("#quickAdd").scrollIntoView({ behavior: "smooth", block: "start" });
});

function sampleRoutePoints(offset = 0) {
  const baseLat = -23.5614 + offset;
  const baseLon = -46.6558 + offset;
  return [
    [0, 0],
    [0.002, 0.001],
    [0.003, 0.004],
    [0.001, 0.006],
    [-0.002, 0.005],
    [-0.003, 0.002],
    [-0.001, -0.001],
    [0.001, -0.002],
    [0, 0]
  ].map(([lat, lon]) => ({ lat: baseLat + lat, lon: baseLon + lon }));
}

$("#clearProgressButton").addEventListener("click", () => {
  $("#exerciseGrid").innerHTML = '<p class="empty-state">Use detalhes como "supino 4x8 70kg" para detectar exercicios.</p>';
});

$("#bodyForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const log = normalizeBodyLog(Object.fromEntries(Object.entries(bodyFields).map(([key, input]) => [key, input.value])));
  const index = state.bodyLogs.findIndex((item) => item.id === log.id);
  if (index >= 0) state.bodyLogs[index] = log;
  else state.bodyLogs.push(log);
  resetBodyForm();
  render();
});

$("#bodyList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-body-action]");
  if (!button) return;
  const item = state.bodyLogs.find((log) => log.id === button.dataset.id);
  if (button.dataset.bodyAction === "delete") state.bodyLogs = state.bodyLogs.filter((log) => log.id !== button.dataset.id);
  if (button.dataset.bodyAction === "edit" && item) {
    Object.entries(bodyFields).forEach(([key, input]) => { input.value = item[key] ?? ""; });
  }
  render();
});

$("#clearBodyFormButton").addEventListener("click", resetBodyForm);
$("#seedBodyButton").addEventListener("click", () => {
  state.bodyLogs = seedState.bodyLogs;
  render();
});

$("#foodCatalogSelect").addEventListener("change", (event) => fillFoodFromCatalog(event.target.value));
$("#foodDate").addEventListener("change", renderNutrition);
$("#clearFoodFormButton").addEventListener("click", resetFoodForm);
$("#foodForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const item = foodFromForm();
  const index = state.foodLogs.findIndex((food) => food.id === item.id);
  if (index >= 0) state.foodLogs[index] = item;
  else state.foodLogs.push(item);
  resetFoodForm();
  render();
});

$("#saveNutritionGoalsButton").addEventListener("click", () => {
  state.nutritionGoals = normalizeNutritionGoals({
    calories: $("#goalCalories").value,
    protein: $("#goalProtein").value,
    water: $("#goalWater").value
  });
  render();
});

$("#foodList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-food-action]");
  if (!button) return;
  if (button.dataset.foodAction === "delete") state.foodLogs = state.foodLogs.filter((item) => item.id !== button.dataset.id);
  render();
});

$("#foodCatalogGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-food-pick]");
  if (!button) return;
  fillFoodFromCatalog(button.dataset.foodPick);
  $("#foodForm").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#seedNutritionButton").addEventListener("click", () => {
  state.foodLogs = seedState.foodLogs.map(normalizeFoodLog);
  render();
});

$("#createWeekPlanButton").addEventListener("click", () => {
  const season = activeSeason();
  const objective = season?.objective || "condicionamento";
  const baseByObjective = {
    forca: [["academia", "Academia - forca", 70, 1], ["natacao", "Natacao leve", 35, 3], ["academia", "Academia - lower", 65, 4], ["mobilidade", "Mobilidade", 25, 6]],
    hipertrofia: [["academia", "Academia - push", 65, 1], ["academia", "Academia - pull", 65, 3], ["academia", "Academia - legs", 65, 5], ["mobilidade", "Mobilidade", 25, 6]],
    tecnica: [["natacao", "Natacao tecnica", 45, 1], ["futevolei", "Futevolei fundamentos", 75, 3], ["academia", "Academia base", 50, 5], ["mobilidade", "Mobilidade", 25, 0]],
    recuperacao: [["mobilidade", "Mobilidade", 25, 1], ["natacao", "Natacao leve", 35, 3], ["academia", "Academia leve", 45, 5]],
    condicionamento: [["academia", "Academia - upper", 60, 1], ["natacao", "Natacao tecnica", 45, 3], ["futevolei", "Futevolei", 90, 5], ["mobilidade", "Mobilidade recuperativa", 25, 0]]
  };
  const base = baseByObjective[objective] || baseByObjective.condicionamento;
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay() || 7;
  monday.setDate(monday.getDate() - day + 1);
  base.forEach(([type, name, duration, offset]) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + offset);
    state.workouts.push(normalizeWorkout({ type, name, duration, date: date.toISOString().slice(0, 10), status: "planejado", intensity: "moderado" }));
  });
  render();
});

$("#copyWeekButton").addEventListener("click", () => {
  const copies = currentWeekWorkouts().map((item) => {
    const date = new Date(`${item.date}T12:00:00`);
    date.setDate(date.getDate() + 7);
    return { ...item, id: uid("workout"), date: date.toISOString().slice(0, 10), status: "planejado" };
  });
  state.workouts.push(...copies);
  render();
});

$("#exportJsonButton").addEventListener("click", () => {
  downloadFile(`finfit-backup-${todayIso()}.json`, JSON.stringify({ app: "finfit", version: 2, exportedAt: new Date().toISOString(), ...state }, null, 2), "application/json");
});

$("#createAutoBackupButton").addEventListener("click", () => {
  createAutoBackup("manual");
  renderBackupStatus();
});

$("#restoreIndexedDbButton").addEventListener("click", restoreStateFromIndexedDb);

$("#downloadAutoBackupButton").addEventListener("click", () => {
  const backup = latestAutoBackup();
  if (!backup) {
    $("#backupHint").textContent = "Nenhum auto-backup local encontrado ainda.";
    return;
  }
  downloadFile(`finfit-auto-backup-${todayIso()}.json`, JSON.stringify({ app: "finfit", version: 2, exportedAt: backup.createdAt, ...backup.state }, null, 2), "application/json");
});

$("#exportCsvButton").addEventListener("click", () => {
  downloadFile(`finfit-treinos-${todayIso()}.csv`, toCsv(state.workouts), "text/csv");
});

$("#exportMonthlyReportButton").addEventListener("click", () => {
  downloadFile(`finfit-relatorio-mensal-${todayIso().slice(0, 7)}.md`, monthlyReport(), "text/markdown");
});

$("#cleanDataButton").addEventListener("click", cleanData);

$("#downloadTemplateButton").addEventListener("click", () => {
  downloadFile("finfit-modelo-importacao.csv", toCsv(seedState.workouts), "text/csv");
});

$("#replaceWithPreviewButton").addEventListener("click", () => {
  state.importMode = "replace";
  $("#dataHint").textContent = "Proxima importacao pode substituir os treinos se voce confirmar em preview.";
  render();
});

$("#importJsonInput").addEventListener("change", (event) => {
  readFileAsText(event.target.files[0], (text) => {
    try {
      const parsed = JSON.parse(text);
      handleImport(Array.isArray(parsed) ? parsed : parsed.workouts || [], "JSON");
    } catch {
      $("#dataHint").textContent = "Nao consegui importar esse JSON.";
    } finally {
      event.target.value = "";
    }
  });
});

$("#importCsvInput").addEventListener("change", (event) => {
  readFileAsText(event.target.files[0], (text) => {
    try {
      const parsed = parseCsv(text);
      handleImport(parsed.items, "CSV", parsed.errors);
    } catch {
      $("#dataHint").textContent = "Nao consegui importar esse CSV.";
    } finally {
      event.target.value = "";
    }
  });
});

$("#importGpxInput").addEventListener("change", (event) => {
  readFileAsText(event.target.files[0], (text) => {
    try {
      handleImport(parseGpx(text), "GPX");
    } catch {
      $("#dataHint").textContent = "Nao consegui importar esse GPX.";
    } finally {
      event.target.value = "";
    }
  });
});

$("#importTcxInput").addEventListener("change", (event) => {
  readFileAsText(event.target.files[0], (text) => {
    try {
      handleImport(parseTcx(text), "TCX");
    } catch {
      $("#dataHint").textContent = "Nao consegui importar esse TCX.";
    } finally {
      event.target.value = "";
    }
  });
});

$("#auditDuplicatesButton").addEventListener("click", renderDuplicateAudit);

$("#duplicateAudit").addEventListener("click", (event) => {
  const button = event.target.closest("[data-duplicate-action]");
  if (!button) return;
  if (button.dataset.duplicateAction === "keep-first") {
    removeDuplicateGroup(decodeURIComponent(button.dataset.key));
    render();
    renderDuplicateAudit();
  }
});

$("#importPreview").addEventListener("click", (event) => {
  if (event.target.id === "cancelImportButton") {
    pendingImport = [];
    pendingImportErrors = [];
  }
  if (event.target.id === "confirmMergeButton") {
    const stats = mergeWorkouts(pendingImport);
    pendingImport = [];
    pendingImportErrors = [];
    $("#dataHint").textContent = `Importacao mesclada: ${stats.added} novo(s), ${stats.skippedExisting + stats.skippedInternal} duplicado(s) ignorado(s).`;
  }
  if (event.target.id === "confirmReplaceButton") {
    state.workouts = pendingImport;
    pendingImport = [];
    pendingImportErrors = [];
    $("#dataHint").textContent = "Treinos substituidos com sucesso.";
  }
  render();
});

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  navigator.serviceWorker.register("./sw.js").then((registration) => {
    $("#pwaStatus").textContent = "Offline ativo. Dados ficam neste navegador.";
    registration.update();
    if (registration.waiting) registration.waiting.postMessage("SKIP_WAITING");
    registration.addEventListener("updatefound", () => {
      $("#pwaStatus").textContent = "Atualizacao disponivel.";
      $("#pwaBanner").classList.add("attention");
      const worker = registration.installing;
      if (worker) {
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            worker.postMessage("SKIP_WAITING");
          }
        });
      }
    });
  }).catch(() => {
    $("#pwaStatus").textContent = "Offline indisponivel neste contexto.";
    // PWA registration is best-effort in local/dev contexts.
  });
}

$("#reloadAppButton").addEventListener("click", () => window.location.reload());

applyAppearance();
resetForm();
resetBodyForm();
resetFoodForm();
resetSeasonForm();
registerServiceWorker();
render();
bootstrapDurableState();
timerInterval = window.setInterval(renderTimer, 1000);
