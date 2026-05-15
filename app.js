const STORAGE_KEY = "finfit.workouts.v1";

const presets = [
  {
    type: "academia",
    label: "Academia",
    defaultName: "Academia - forca",
    duration: 60
  },
  {
    type: "natacao",
    label: "Natacao",
    defaultName: "Natacao",
    duration: 45
  },
  {
    type: "futevolei",
    label: "Futevolei",
    defaultName: "Futevolei",
    duration: 90
  },
  {
    type: "corrida",
    label: "Corrida",
    defaultName: "Corrida",
    duration: 40
  },
  {
    type: "mobilidade",
    label: "Mobilidade",
    defaultName: "Mobilidade",
    duration: 25
  },
  {
    type: "outro",
    label: "Outro",
    defaultName: "Treino livre",
    duration: 50
  }
];

const seedWorkouts = [
  {
    id: "seed-1",
    type: "academia",
    name: "Academia - peito e costas",
    date: "2026-05-11",
    duration: 70,
    intensity: "forte",
    note: "boa carga, sem dor"
  },
  {
    id: "seed-2",
    type: "natacao",
    name: "Natacao tecnica",
    date: "2026-05-13",
    duration: 45,
    intensity: "moderado",
    note: "respiracao melhorou"
  },
  {
    id: "seed-3",
    type: "futevolei",
    name: "Futevolei",
    date: "2026-05-15",
    duration: 90,
    intensity: "forte",
    note: "jogo intenso"
  }
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

let selectedPreset = presets[0];
let workouts = loadWorkouts();

const addWorkoutButton = document.querySelector("#addWorkoutButton");
const clearFormButton = document.querySelector("#clearFormButton");
const form = document.querySelector("#workoutForm");
const nameInput = document.querySelector("#workoutName");
const dateInput = document.querySelector("#workoutDate");
const durationInput = document.querySelector("#workoutDuration");
const intensityInput = document.querySelector("#workoutIntensity");
const noteInput = document.querySelector("#workoutNote");
const presetGrid = document.querySelector("#sportPresetGrid");
const workoutList = document.querySelector("#workoutList");
const weekGrid = document.querySelector("#weekGrid");
const seedButton = document.querySelector("#seedButton");
const exportJsonButton = document.querySelector("#exportJsonButton");
const importJsonInput = document.querySelector("#importJsonInput");
const importCsvInput = document.querySelector("#importCsvInput");
const downloadTemplateButton = document.querySelector("#downloadTemplateButton");
const dataHint = document.querySelector("#dataHint");

function loadWorkouts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function normalizeWorkout(item) {
  const type = String(item.type || "outro").trim().toLowerCase();
  const validType = presets.some((preset) => preset.type === type) ? type : "outro";
  const duration = Number(item.duration || item.minutes || 0);

  return {
    id: item.id || crypto.randomUUID(),
    type: validType,
    name: String(item.name || presetLabel(validType)).trim(),
    date: String(item.date || todayIso()).slice(0, 10),
    duration: Number.isFinite(duration) && duration > 0 ? duration : 30,
    intensity: String(item.intensity || "moderado").trim().toLowerCase(),
    note: String(item.note || item.notes || "").trim()
  };
}

function importWorkouts(items, source) {
  const incoming = items.map(normalizeWorkout);
  const existingKeys = new Set(workouts.map(workoutKey));
  const merged = [...workouts];

  incoming.forEach((item) => {
    const key = workoutKey(item);
    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      merged.push(item);
    }
  });

  workouts = merged;
  saveWorkouts();
  render();
  dataHint.textContent = `${incoming.length} treino(s) lidos de ${source}. Total atual: ${workouts.length}.`;
}

function workoutKey(item) {
  return [item.date, item.type, item.name, item.duration, item.intensity].join("|").toLowerCase();
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

function parseCsv(text) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map(splitCsvLine);
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) || [];

  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
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

function readFileAsText(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(String(reader.result || "")));
  reader.readAsText(file);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
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

  return workouts.filter((workout) => {
    const date = new Date(`${workout.date}T12:00:00`);
    return date >= start && date < end;
  });
}

function setPreset(type) {
  selectedPreset = presets.find((preset) => preset.type === type) || presets[0];
  nameInput.value = selectedPreset.defaultName;
  durationInput.value = selectedPreset.duration;
  renderPresets();
}

function resetForm() {
  dateInput.value = todayIso();
  intensityInput.value = "moderado";
  noteInput.value = "";
  setPreset(selectedPreset.type);
}

function renderPresets() {
  presetGrid.innerHTML = presets
    .map((preset) => `
      <button class="sport-preset ${preset.type === selectedPreset.type ? "active" : ""}" type="button" data-type="${preset.type}">
        <strong>${preset.label}</strong>
        <small>${preset.duration} min sugeridos</small>
      </button>
    `)
    .join("");
}

function renderMetrics() {
  const week = currentWeekWorkouts();
  const minutes = week.reduce((total, workout) => total + Number(workout.duration || 0), 0);
  const sports = new Set(week.map((workout) => workout.type));
  const latest = [...workouts].sort((a, b) => b.date.localeCompare(a.date))[0];

  document.querySelector("#weekScore").textContent = week.length;
  document.querySelector("#weekScoreLabel").textContent = week.length === 1 ? "treino registrado" : "treinos registrados";
  document.querySelector("#sessionMetric").textContent = week.length;
  document.querySelector("#timeMetric").textContent = `${minutes}min`;
  document.querySelector("#sportMetric").textContent = sports.size;
  document.querySelector("#latestMetric").textContent = latest ? presetLabel(latest.type) : "-";
}

function presetLabel(type) {
  return presets.find((preset) => preset.type === type)?.label || "Treino";
}

function renderWorkoutList() {
  const ordered = [...workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  if (!ordered.length) {
    workoutList.innerHTML = '<p class="empty-state">Nenhum treino registrado ainda. Escolha uma modalidade acima e salve o primeiro.</p>';
    return;
  }

  workoutList.innerHTML = ordered
    .map((item, index) => `
      <li>
        <span class="step">${String(index + 1).padStart(2, "0")}</span>
        <span class="exercise">
          <strong>${item.name}</strong>
          <small>${formatDate(item.date)} - ${item.duration}min - ${item.intensity}${item.note ? ` - ${item.note}` : ""}</small>
        </span>
        <span class="tag">${presetLabel(item.type)}</span>
        <button class="delete-workout" type="button" data-delete="${item.id}" aria-label="Remover ${item.name}">x</button>
      </li>
    `)
    .join("");
}

function renderWeek() {
  const week = currentWeekWorkouts();

  weekGrid.innerHTML = weekDays
    .map((day) => {
      const dayWorkouts = week.filter((workout) => new Date(`${workout.date}T12:00:00`).getDay() === day.key);
      const title = dayWorkouts.length
        ? dayWorkouts.map((workout) => presetLabel(workout.type)).join(" + ")
        : "Livre";
      const state = dayWorkouts.length ? "done" : "";

      return `
        <div class="day">
          <strong>${day.label}</strong>
          <span>${title}</span>
          <i class="status ${state}" aria-hidden="true"></i>
        </div>
      `;
    })
    .join("");
}

function render() {
  renderPresets();
  renderMetrics();
  renderWorkoutList();
  renderWeek();
}

presetGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-type]");
  if (!button) return;
  setPreset(button.dataset.type);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  workouts.push({
    id: crypto.randomUUID(),
    type: selectedPreset.type,
    name: nameInput.value.trim(),
    date: dateInput.value,
    duration: Number(durationInput.value),
    intensity: intensityInput.value,
    note: noteInput.value.trim()
  });
  saveWorkouts();
  noteInput.value = "";
  render();
});

workoutList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  workouts = workouts.filter((workout) => workout.id !== button.dataset.delete);
  saveWorkouts();
  render();
});

addWorkoutButton.addEventListener("click", () => {
  document.querySelector("#quickAdd").scrollIntoView({ behavior: "smooth", block: "start" });
  nameInput.focus();
});

clearFormButton.addEventListener("click", resetForm);

seedButton.addEventListener("click", () => {
  workouts = [...seedWorkouts];
  saveWorkouts();
  render();
});

exportJsonButton.addEventListener("click", () => {
  const payload = {
    app: "finfit",
    version: 1,
    exportedAt: new Date().toISOString(),
    workouts
  };
  downloadFile(`finfit-backup-${todayIso()}.json`, JSON.stringify(payload, null, 2), "application/json");
});

downloadTemplateButton.addEventListener("click", () => {
  const template = [
    "date,type,name,duration,intensity,note",
    "2026-05-15,futevolei,Futevolei,90,forte,jogo intenso",
    "2026-05-16,natacao,Natacao tecnica,45,moderado,respiracao melhorou"
  ].join("\n");
  downloadFile("finfit-modelo-importacao.csv", template, "text/csv");
});

importJsonInput.addEventListener("change", (event) => {
  readFileAsText(event.target.files[0], (text) => {
    try {
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed) ? parsed : parsed.workouts || [];
      importWorkouts(items, "JSON");
    } catch {
      dataHint.textContent = "Nao consegui importar esse JSON. Confira se o arquivo e um backup valido do Finfit.";
    } finally {
      importJsonInput.value = "";
    }
  });
});

importCsvInput.addEventListener("change", (event) => {
  readFileAsText(event.target.files[0], (text) => {
    try {
      importWorkouts(parseCsv(text), "CSV");
    } catch {
      dataHint.textContent = "Nao consegui importar esse CSV. Use o modelo com date,type,name,duration,intensity,note.";
    } finally {
      importCsvInput.value = "";
    }
  });
});

resetForm();
render();
