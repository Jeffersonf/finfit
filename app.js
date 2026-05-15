const STORAGE_KEY = "finfit.state.v2";
const LEGACY_WORKOUTS_KEY = "finfit.workouts.v1";
const AUTO_BACKUP_KEY = "finfit.autoBackups.v1";
const ACTIVE_SESSION_KEY = "finfit.activeSession.v1";

const presets = [
  { type: "academia", label: "Academia", defaultName: "Academia - forca", duration: 60 },
  { type: "natacao", label: "Natacao", defaultName: "Natacao", duration: 45 },
  { type: "futevolei", label: "Futevolei", defaultName: "Futevolei", duration: 90 },
  { type: "corrida", label: "Corrida", defaultName: "Corrida", duration: 40 },
  { type: "mobilidade", label: "Mobilidade", defaultName: "Mobilidade", duration: 25 },
  { type: "outro", label: "Outro", defaultName: "Treino livre", duration: 50 }
];

const weekDays = [
  { key: 1, label: "Seg" },
  { key: 2, label: "Ter" },
  { key: 3, label: "Qua" },
  { key: 4, label: "Qui" },
  { key: 5, label: "Sex" },
  { key: 6, label: "Sab" },
  { key: 0, label: "Dom" }
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

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

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
    favorites: value.favorites || [],
    templates: value.templates?.length ? value.templates : baseTemplates,
    seasons: (value.seasons || []).map(normalizeSeason),
    importMode: value.importMode || "merge"
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  maybeCreateAutoBackup();
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
    details: String(item.details || item.detalhes || item.series || item.blocos || "").trim()
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
  $$(".page").forEach((item) => item.classList.toggle("active", item.id === `page-${page}`));
  $$("[data-page-target]").forEach((button) => button.classList.toggle("active", button.dataset.pageTarget === page));
  const titles = { today: "Treinos da semana", plan: "Plano semanal", history: "Historico", progress: "Progresso", body: "Corpo e recuperacao", library: "Biblioteca", data: "Dados" };
  $("#pageTitle").textContent = titles[page] || "Finfit";
}

function setPreset(type) {
  selectedPreset = presets.find((preset) => preset.type === type) || presets[0];
  fields.name.value = selectedPreset.defaultName;
  fields.duration.value = selectedPreset.duration;
  $("#modalityHint").textContent = modalityHint(selectedPreset.type);
  renderPresets();
}

function modalityHint(type) {
  const hints = {
    academia: "Uma linha por exercicio: supino 4x8 70kg. Isso alimenta recordes por exercicio.",
    natacao: "Use blocos com metragem: 8x50m tecnica, 400m solto. O volume entra no progresso.",
    futevolei: "Registre parceiro, quantidade de jogos, resultado e sensacao do corpo.",
    corrida: "Distancia, pace, zona ou terreno ajudam a comparar progresso.",
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

function renderMetrics() {
  const week = currentWeekWorkouts();
  const minutes = week.reduce((total, workout) => total + Number(workout.duration || 0), 0);
  const sports = new Set(week.map((workout) => workout.type));
  const load = week.reduce((sum, item) => sum + workoutLoad(item), 0);
  const score = readiness();
  const [title, text] = recommendation();

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

function renderWorkoutList() {
  const ordered = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  $("#workoutList").innerHTML = ordered.length ? ordered.map((item, index) => workoutListItem(item, index)).join("") : '<p class="empty-state">Nenhum treino registrado ainda.</p>';
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
  const week = currentWeekWorkouts();
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

  return [...state.workouts]
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
  $("#importPreview").innerHTML = `
    <div class="preview-row">
      <div>
        <strong>${pendingImport.length} treino(s) prontos para importar</strong>
        <div class="card-meta">Preview: ${pendingImport.slice(0, 3).map((item) => item.name).join(", ")}</div>
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

function render() {
  saveState();
  renderPresets();
  renderQuickStart();
  renderMetrics();
  renderWorkoutList();
  renderWeek();
  renderPlan();
  renderHistory();
  renderProgress();
  renderBody();
  renderLibrary();
  renderPreview();
  renderBackupStatus();
  renderTimer();
}

function upsertWorkout(workout) {
  const index = state.workouts.findIndex((item) => item.id === workout.id);
  if (index >= 0) state.workouts[index] = workout;
  else state.workouts.push(workout);
}

function mergeWorkouts(items) {
  const existingKeys = new Set(state.workouts.map(workoutKey));
  items.forEach((item) => {
    const key = workoutKey(item);
    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      state.workouts.push(item);
    }
  });
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
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) || [];
  const errors = [];
  const items = rows.map((row, index) => {
    const raw = Object.fromEntries(headers.map((header, colIndex) => [header, row[colIndex] || ""]));
    const item = normalizeWorkout(raw);
    if (!raw.date && !raw.data) errors.push(`Linha ${index + 2}: sem data, usei hoje.`);
    if (!raw.duration && !raw.duracao && !raw.tempo) errors.push(`Linha ${index + 2}: sem duracao, usei 30min.`);
    if (!raw.type && !raw.tipo && !raw.modalidade) errors.push(`Linha ${index + 2}: sem modalidade, usei outro.`);
    return item;
  });
  return { items, errors };
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
  const distance = gpxDistance(points);
  const start = times[0] ? new Date(times[0]) : new Date();
  const end = times.at(-1) ? new Date(times.at(-1)) : start;
  const minutes = Math.max(1, Math.round((end - start) / 60000) || 45);
  return [normalizeWorkout({ type: "corrida", name: "Atividade GPX", date: start.toISOString().slice(0, 10), duration: minutes, distance, intensity: "moderado", note: "Importado de GPX" })];
}

function parseTcx(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const activity = doc.querySelector("Activity");
  const sport = String(activity?.getAttribute("Sport") || "corrida").toLowerCase();
  const points = [...doc.querySelectorAll("Trackpoint")];
  const times = points.map((point) => point.querySelector("Time")?.textContent).filter(Boolean);
  const distances = points.map((point) => Number(point.querySelector("DistanceMeters")?.textContent || 0)).filter(Boolean);
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
    note: "Importado de TCX"
  })];
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
    "## Alertas",
    insights
  ].join("\n");
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

$("#sportPresetGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-type]");
  if (button) setPreset(button.dataset.type);
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
    mergeWorkouts(pendingImport);
    pendingImport = [];
    pendingImportErrors = [];
    $("#dataHint").textContent = "Importacao mesclada com sucesso.";
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
  navigator.serviceWorker.register("./sw.js").catch(() => {
    // PWA registration is best-effort in local/dev contexts.
  });
}

resetForm();
resetBodyForm();
resetSeasonForm();
registerServiceWorker();
render();
timerInterval = window.setInterval(renderTimer, 1000);
