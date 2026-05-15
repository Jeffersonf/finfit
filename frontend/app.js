const workout = [
  {
    name: "Supino reto",
    detail: "4 series x 6-8 reps, RPE 8",
    tag: "forca"
  },
  {
    name: "Remada curvada",
    detail: "4 series x 8 reps, controle total",
    tag: "costas"
  },
  {
    name: "Desenvolvimento",
    detail: "3 series x 8-10 reps",
    tag: "ombro"
  },
  {
    name: "Zona 2",
    detail: "18 minutos, respiracao nasal se possivel",
    tag: "cardio"
  }
];

const week = [
  { day: "Seg", title: "Lower strength", state: "done" },
  { day: "Ter", title: "Zona 2 + mobilidade", state: "done" },
  { day: "Qua", title: "Push volume", state: "done" },
  { day: "Qui", title: "Descanso ativo", state: "rest" },
  { day: "Sex", title: "Upper strength", state: "today" },
  { day: "Sab", title: "Corrida leve", state: "" },
  { day: "Dom", title: "Mobilidade", state: "" }
];

const workoutList = document.querySelector("#workoutList");
const weekGrid = document.querySelector("#weekGrid");
const finishButton = document.querySelector("#finishWorkout");

workoutList.innerHTML = workout
  .map((item, index) => `
    <li>
      <span class="step">${String(index + 1).padStart(2, "0")}</span>
      <span class="exercise">
        <strong>${item.name}</strong>
        <small>${item.detail}</small>
      </span>
      <span class="tag">${item.tag}</span>
    </li>
  `)
  .join("");

weekGrid.innerHTML = week
  .map((item) => `
    <div class="day">
      <strong>${item.day}</strong>
      <span>${item.title}</span>
      <i class="status ${item.state}" aria-hidden="true"></i>
    </div>
  `)
  .join("");

finishButton.addEventListener("click", () => {
  finishButton.textContent = "Treino registrado";
  finishButton.disabled = true;
});

