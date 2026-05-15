const STORAGE_KEY = "finfit.state.v2";
const LEGACY_WORKOUTS_KEY = "finfit.workouts.v1";

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
    { id: "seed-1", type: "academia", name: "Academia - peito e costas", date: "2026-05-11", duration: 70, intensity: "forte", status: "feito", rpe: 8, energy: 8, pain: 1, distance: "", volume: 9200, focus: "peito costas", location: "academia", note: "boa carga, sem dor" },
    { id: "seed-2", type: "natacao", name: "Natacao tecnica", date: "2026-05-13", duration: 45, intensity: "moderado", status: "feito", rpe: 6, energy: 7, pain: 0, distance: 1500, volume: 1500, focus: "respiracao", location: "piscina", note: "respiracao melhorou" },
    { id: "seed-3", type: "futevolei", name: "Futevolei", date: "2026-05-15", duration: 90, intensity: "forte", status: "feito", rpe: 8, energy: 8, pain: 2, distance: "", volume: "", focus: "jogo", location: "praia", note: "jogo intenso" }
  ],
  bodyLogs: [
    { id: "body-1", date: "2026-05-14", weight: 82.4, sleep: 7, energy: 8, pain: 1, note: "recuperacao boa" },
    { id: "body-2", date: "2026-05-15", weight: 82.1, sleep: 6.5, energy: 7, pain: 2, note: "ombro ok, perna pesada" }
  ],
  favorites: [],
  templates: baseTemplates,
  importMode: "merge"
};

let state = loadState();
let selectedPreset = presets[0];
let pendingImport = [];

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
  note: $("#workoutNote")
};

const bodyFields = {
  id: $("#bodyId"),
  date: $("#bodyDate"),
  weight: $("#bodyWeight"),
  sleep: $("#bodySleep"),
  energy: $("#bodyEnergy"),
  pain: $("#bodyPain"),
  note: $("#bodyNote")
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
    importMode: value.importMode || "merge"
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  const aliases = {
    musculacao: "academia",
    musculação: "academia",
    gym: "academia",
    swim: "natacao",
    natação: "natacao",
    futebol: "futevolei",
    futevôlei: "futevolei",
    run: "corrida",
    running: "corrida",
    mobilidade: "mobilidade"
  };
  const type = aliases[raw] || raw;
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
    note: String(item.note || item.notes || item.observacao || item.observação || item.nota || "").trim()
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
  const loadPenalty = Math.min(22, Math.round(weekLoad / 180));
  const score = Math.max(25, Math.min(98, 58 + energy * 4 + sleep * 2 - pain * 5 - loadPenalty));
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
  const titles = { today: "Treinos da semana", plan: "Plano semanal", history: "Historico", body: "Corpo e recuperacao", library: "Biblioteca", data: "Dados" };
  $("#pageTitle").textContent = titles[page] || "Finfit";
}

function setPreset(type) {
  selectedPreset = presets.find((preset) => preset.type === type) || presets[0];
  fields.name.value = selectedPreset.defaultName;
  fields.duration.value = selectedPreset.duration;
  renderPresets();
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
    note: fields.note.value
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
      </div>
      <div class="timeline-actions">
        <button type="button" data-action="edit" data-id="${item.id}">Editar</button>
        <button type="button" data-action="duplicate" data-id="${item.id}">Duplicar</button>
        <button type="button" data-action="delete" data-id="${item.id}">Excluir</button>
      </div>
    </div>
  `).join("") : '<p class="empty-state">Nada encontrado com os filtros atuais.</p>';
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
}

function renderBody() {
  const ordered = [...state.bodyLogs].sort((a, b) => b.date.localeCompare(a.date));
  $("#bodyList").innerHTML = ordered.length ? ordered.map((item) => `
    <div class="body-item">
      <strong>${formatDate(item.date)}</strong>
      <div class="card-meta">peso ${item.weight || "-"}kg - sono ${item.sleep || "-"}h - energia ${item.energy || "-"} - dor ${item.pain || "0"}</div>
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
      <div><strong>${pendingImport.length} treino(s) prontos para importar</strong><div class="card-meta">Preview: ${pendingImport.slice(0, 3).map((item) => item.name).join(", ")}</div></div>
      <div class="preview-actions">
        <button type="button" id="confirmMergeButton">Mesclar</button>
        <button type="button" id="confirmReplaceButton">Substituir</button>
        <button type="button" id="cancelImportButton">Cancelar</button>
      </div>
    </div>
  `;
}

function render() {
  saveState();
  renderPresets();
  renderMetrics();
  renderWorkoutList();
  renderWeek();
  renderPlan();
  renderHistory();
  renderBody();
  renderLibrary();
  renderPreview();
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
  const headers = ["date", "type", "name", "duration", "intensity", "status", "rpe", "energy", "pain", "distance", "volume", "focus", "location", "note"];
  const rows = items.map((item) => headers.map((key) => csvCell(item[key])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).filter(Boolean).map(splitCsvLine);
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) || [];
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]))).map(normalizeWorkout);
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

function handleImport(items, source) {
  pendingImport = items.map(normalizeWorkout);
  $("#dataHint").textContent = `${pendingImport.length} treino(s) lidos de ${source}. Confirme abaixo para importar.`;
  renderPreview();
}

function resetBodyForm() {
  bodyFields.id.value = "";
  bodyFields.date.value = todayIso();
  bodyFields.weight.value = "";
  bodyFields.sleep.value = "";
  bodyFields.energy.value = "";
  bodyFields.pain.value = "";
  bodyFields.note.value = "";
}

$$("[data-page-target]").forEach((button) => button.addEventListener("click", () => setPage(button.dataset.pageTarget)));

$("#sportPresetGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-type]");
  if (button) setPreset(button.dataset.type);
});

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
  const base = [
    ["academia", "Academia - upper", 60, 1],
    ["natacao", "Natacao tecnica", 45, 3],
    ["futevolei", "Futevolei", 90, 5],
    ["mobilidade", "Mobilidade recuperativa", 25, 0]
  ];
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
      handleImport(parseCsv(text), "CSV");
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

$("#importPreview").addEventListener("click", (event) => {
  if (event.target.id === "cancelImportButton") pendingImport = [];
  if (event.target.id === "confirmMergeButton") {
    mergeWorkouts(pendingImport);
    pendingImport = [];
    $("#dataHint").textContent = "Importacao mesclada com sucesso.";
  }
  if (event.target.id === "confirmReplaceButton") {
    state.workouts = pendingImport;
    pendingImport = [];
    $("#dataHint").textContent = "Treinos substituidos com sucesso.";
  }
  render();
});

resetForm();
resetBodyForm();
render();
