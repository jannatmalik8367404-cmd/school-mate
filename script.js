const form = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("studymateTasks") || "[]");
let currentFilter = "all";

document.getElementById("today").textContent =
  new Date().toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric" });

form.addEventListener("submit", function(event) {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  tasks.unshift({ id: Date.now(), title, subject: subjectInput.value, completed: false });
  saveAndRender();
  form.reset();
  taskInput.focus();
});

filters.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filters.forEach(item => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

function saveAndRender() {
  localStorage.setItem("studymateTasks", JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task complete");
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveAndRender();
    });

    const info = document.createElement("div");
    info.className = "task-info";
    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.title;
    const subject = document.createElement("span");
    subject.className = "task-subject";
    subject.textContent = task.subject;
    info.append(name, subject);

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveAndRender();
    });

    li.append(checkbox, info, remove);
    taskList.appendChild(li);
  });

  const completed = tasks.filter(task => task.completed).length;
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("doneCount").textContent = completed;
  document.getElementById("remainingCount").textContent = tasks.length - completed;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  document.getElementById("progressText").textContent = percent + "%";
  document.getElementById("progressBar").style.width = percent + "%";
  emptyMessage.hidden = visibleTasks.length > 0;
}

renderTasks();
