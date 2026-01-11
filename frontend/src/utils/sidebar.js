const sidebar = document.getElementById("sidebar");

let currentScheduleDate = new Date();
let currentEmployeeId = null;

export function openSidebar(employee) {
  currentEmployeeId = employee.id;
  currentScheduleDate = new Date();

  sidebar.innerHTML = `
    <button class="close-btn">&times;</button>

    <div class="sidebar-header animate">
      <div class="sidebar-avatar">
        <span class="status-dot ${employee.status?.toLowerCase() || "online"}"></span>
      </div>

      <div>
        <h2>${employee.firstName} ${employee.lastName}</h2>
       <div class="sidebar-status ${employee.status === "AVAILABLE" ? "sidebar-available" : (employee.status === "OCCUPIED" ? "sidebar-occupied" : "sidebar-not-available")}">${employee.status}</div>
      </div>
    </div>

      <div>
        <h2>${employee.firstName} ${employee.lastName}</h2>
        <div class="sidebar-status">${employee.status || "Disponible"}</div>
      </div>
    </div>

    <div class="sidebar-section card animate">
      <h3>Coordonnées</h3>
      <div class="info-grid">
        <div class="info-label">Email</div>
        <div class="info-value">${employee.email}</div>

        <div class="info-label">Téléphone</div>
        <div class="info-value">${employee.phoneNumber}</div>
      </div>
    </div>

    <div class="sidebar-section card animate">
      <h3>Position</h3>
      <div class="info-grid">
        <div class="info-label">Bureau</div>
        <div class="info-value">
          ${employee.desk?.room?.roomName ?? "Aucun"}
        </div>

        <div class="info-label">Présence</div>
        <div class="info-value">
          ${employee.inOffice ? "Office" : "Télétravail"}
        </div>
      </div>
    </div>

    <div class="sidebar-section card animate">
      <div class="schedule-header">
        <button class="nav-btn" id="prev-day">←</button>
        <h3 id="schedule-date"></h3>
        <button class="nav-btn" id="next-day">→</button>
      </div>

      <div class="schedule-list">
        <em>Chargement...</em>
      </div>
    </div>
  `;

  sidebar.classList.remove("hidden");
  sidebar.classList.add("visible");

  sidebar.querySelector(".close-btn")
    .addEventListener("click", closeSidebar);

  sidebar.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  sidebar.querySelector("#prev-day")
    .addEventListener("click", () => changeDay(-1));

  sidebar.querySelector("#next-day")
    .addEventListener("click", () => changeDay(1));

  loadSchedule();
}

export function closeSidebar() {
  sidebar.classList.remove("visible");
  sidebar.classList.add("hidden");
}

function changeDay(delta) {
  currentScheduleDate.setDate(currentScheduleDate.getDate() + delta);
  loadSchedule();
}

function getDayLabel(date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return "Aujourd’hui";
  if (isSameDay(date, tomorrow)) return "Demain";

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit"
  });
}

function renderSchedule(items) {
  const list = sidebar.querySelector(".schedule-list");
  list.innerHTML = "";

  if (!items || items.length === 0) {
    list.innerHTML = "<em>Aucune activité</em>";
    return;
  }

  items.forEach(item => {
    const start = item.startTime.slice(0, 5);
    const cssClass = item.remote ? "focus" : "meeting";

    list.innerHTML += `
      <div class="schedule-item ${cssClass}">
        <span class="time">${start}</span>
        <span class="title">${item.title}</span>
      </div>
    `;
  });
}

async function loadSchedule() {
  if (!currentEmployeeId) return;

  const dateStr = currentScheduleDate.toISOString().split("T")[0];
  const list = sidebar.querySelector(".schedule-list");
  const title = sidebar.querySelector("#schedule-date");

  title.innerText = getDayLabel(currentScheduleDate);
  list.innerHTML = "<em>Chargement...</em>";

  console.log("Employee ID:", currentEmployeeId);
  console.log("Date:", dateStr);

  try {
    const res = await fetch(
      `/api/employees/${currentEmployeeId}/schedule?date=${dateStr}`
    );
    const items = await res.json();
    renderSchedule(items);
  } catch (e) {
    list.innerHTML = "<em>Erreur de chargement</em>";
  }
}



