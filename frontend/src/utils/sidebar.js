const sidebar = document.getElementById("sidebar");
let currentScheduleDate = new Date();
let currentEmployeeId = null;
let currentRoomId = null;
let currentOfficeRoomId = null;
let ignoreNextOutsideClick = false;

function onKeyDown(e) {
  if (e.key === "Escape")closeSidebar();
}

function onOutsideClick(e) {
  if (ignoreNextOutsideClick) {
    ignoreNextOutsideClick = false;
    return;
  }
  if (!sidebar.contains(e.target)) closeSidebar();
}

function bindCommonSidebarListeners() {
  sidebar.querySelector(".close-btn")?.addEventListener("click", closeSidebar);

  sidebar.addEventListener("click", (e) => e.stopPropagation());

  sidebar.querySelector("#prev-day")?.addEventListener("click", () => changeDay(-1));
  sidebar.querySelector("#next-day")?.addEventListener("click", () => changeDay(1));

  ignoreNextOutsideClick = true;
  document.addEventListener("click", onOutsideClick);
  document.addEventListener("keydown", onKeyDown);
}

export function openSidebar(employee) {
  currentEmployeeId = employee.id;
  currentRoomId = null;
  currentOfficeRoomId  = null;
  currentScheduleDate = new Date();

  sidebar.classList.remove("hidden");
  sidebar.classList.add("visible");
  sidebar.innerHTML = `<button class="close-btn">&times;</button><div>Chargement...</div>`;

  requestAnimationFrame(() => {
    sidebar.innerHTML = `
      <button class="close-btn">&times;</button>

      <div class="sidebar-header animate">
        <div class="sidebar-avatar">
          <span class="status-dot ${employee.status?.toLowerCase() || "online"}"></span>
        </div>

        <div>
          <h2>${employee.firstName} ${employee.lastName}</h2>
          <div class="sidebar-status sidebar-not-available" id="sidebar-status">
            ${employee.status}
          </div>
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
          <div class="info-value">${employee.desk?.room?.roomName ?? "Aucun"}</div>

          <div class="info-label">Présence</div>
          <div class="info-value">${employee.inOffice === "OFFICE" ? "Office" : "Télétravail"}</div>
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

    bindCommonSidebarListeners();
    loadSchedule();

    fetch(`/api/employees/${employee.id}/global_status`)
      .then(res => res.text())
      .then(globalStatus => {
        if (String(currentEmployeeId) !== String(employee.id)) return;

        const badge = sidebar.querySelector("#sidebar-status");
        if (!badge) return;

        badge.textContent = globalStatus;
        badge.className = "sidebar-status " + (
          globalStatus === "AVAILABLE" ? "sidebar-available" :
          globalStatus === "REMOTE" ? "sidebar-remote" :
          globalStatus === "OCCUPIED" ? "sidebar-occupied" :
          "sidebar-not-available"
        );
      })
      .catch(() => {});
  });
}


export function openMeetingRoomSidebar(room) {
  currentRoomId = room.userData.roomId ;
  currentEmployeeId = null;
  currentOfficeRoomId  = null;
  currentScheduleDate = new Date();

  sidebar.classList.remove("hidden");
  sidebar.classList.add("visible");
  sidebar.innerHTML = `<button class="close-btn">&times;</button><div>Chargement...</div>`;

  requestAnimationFrame(() => {
    sidebar.innerHTML = `
      <button class="close-btn">&times;</button>

      <div class="sidebar-header animate">
        <div></div>
        <div>
          <h2>${room.userData.roomName ?? "Salle X"}</h2>
          <div class="sidebar-status" id="room-subtitle">
            ${"Available"}
          </div>
        </div>
      </div>

      <div class="sidebar-section card animate">
        <h3>Informations</h3>
        <div class="info-grid">
          <div class="info-label">ID</div>
          <div class="info-value">${currentRoomId}</div>

          <div class="info-label">Open-space</div>
          <div class="info-value">${room.openspaceNumber ?? "—"}</div>

          <div class="info-label">Type</div>
          <div class="info-value">${ room.userData.roomType ?? "—"}</div>
        </div>
      </div>

      <div class="sidebar-section card animate">
        <div class="actions-row">
          <h3 style="margin:0;">Réunions</h3>
          <button class="primary-btn" id="btn-add-meeting">+ Ajouter</button>
        </div>

        <div id="meeting-form-container" class="hidden"></div>
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

    bindCommonSidebarListeners();
    bindMeetingRoomActions();   
    loadRoomSchedule();
  });
}


export function closeSidebar() {
  currentOfficeRoomId = null;
  currentEmployeeId = null;
  currentRoomId = null
  sidebar.classList.remove("visible");
  sidebar.classList.add("hidden");

  document.removeEventListener("click", onOutsideClick);
  document.removeEventListener("keydown", onKeyDown);
}

function changeDay(delta) {
  currentScheduleDate.setDate(currentScheduleDate.getDate() + delta);
  if (currentEmployeeId) loadSchedule();
  else if (currentRoomId) loadRoomSchedule();
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
    const end = item.endTime.slice(0,5);
    const cssClass = item.remote ? "focus" : "meeting";
    
    list.innerHTML += `
      <div class="schedule-item ${cssClass}">
        <span class="time">${start}-${end}</span>
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

  try {
    const res = await fetch(
      `/api/employees/${currentEmployeeId}/schedule?date=${dateStr}`
    );
    const items = await res.json();
      items.sort((a, b) => {
      const [ah, am] = a.startTime.split(":").map(Number);
      const [bh, bm] = b.startTime.split(":").map(Number);
      return (ah * 60 + am) - (bh * 60 + bm);
    });
    renderSchedule(items);
  } catch (e) {
    list.innerHTML = "<em>Erreur de chargement</em>";
  }
}

async function loadRoomSchedule() {
  if (!currentRoomId) return;

  const list = sidebar.querySelector(".schedule-list");
  const title = sidebar.querySelector("#schedule-date");

  title.innerText = getDayLabel(currentScheduleDate);
  list.innerHTML = "<em>Chargement...</em>";

  const start = new Date(currentScheduleDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(currentScheduleDate);
  end.setDate(end.getDate() + 1);
  end.setHours(0, 0, 0, 0);

  const startStr = toLocalISOString(start);
  const endStr = toLocalISOString(end);

  try {
    const res = await fetch(`/api/meetings/room/${currentRoomId}/between?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}`);
    const meetings = await res.json();
    const items = (meetings || []).map(m => ({
      startTime: String(m.startingHour).slice(11, 16),
      endTime: String(m.endHour).slice(11,16),
      title: m.title,
      remote: false
    }));
    items.sort((a, b) => {
      const [ah, am] = a.startTime.split(":").map(Number);
      const [bh, bm] = b.startTime.split(":").map(Number);
      return (ah * 60 + am) - (bh * 60 + bm);
    });
    renderSchedule(items);
  } catch (e) {
    list.innerHTML = "<em>Erreur de chargement</em>";
  }
}

function toLocalISOString(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function openOfficeSidebar(room) {
  currentOfficeRoomId = room.userData.roomId;
  currentEmployeeId = null;
  currentRoomId = null;

  sidebar.classList.remove("hidden");
  sidebar.classList.add("visible");
  sidebar.innerHTML = `<button class="close-btn">&times;</button><div>Chargement...</div>`;

  requestAnimationFrame(() => {
    sidebar.innerHTML = `
      <button class="close-btn">&times;</button>

      <div class="sidebar-header animate">
        <div></div>
        <div>
          <h2>${room.userData.roomName ?? "Bureau"}</h2>
          <div class="sidebar-status" id="office-subtitle">Office</div>
        </div>
      </div>

      <div class="sidebar-section card animate">
        <h3>Informations</h3>
        <div class="info-grid">
          <div class="info-label">ID</div>
          <div class="info-value">${currentOfficeRoomId}</div>

          <div class="info-label">Type</div>
          <div class="info-value">${room.userData.roomType ?? "—"}</div>

          <div class="info-label">Capacité</div>
          <div class="info-value" id="office-capacity"><em>…</em></div>
        </div>
      </div>

      <div class="sidebar-section card animate">
        <h3>Occupants</h3>
        <div class="schedule-list" id="office-occupants">
          <em>Chargement...</em>
        </div>
      </div>
    `;

    bindCommonSidebarListeners();
    loadOfficeOccupants(room.userData.roomType);
  });
}

function capacityFromRoomType(roomType) {
  if (roomType === "Office1Desk") return 1;
  if (roomType === "Office2Desks") return 2;
  if (roomType === "Office4Desks") return 4;
  if (roomType === "Office6Desks") return 6;
  return 0;
}

async function loadOfficeOccupants(roomType) {
  const cap = capacityFromRoomType(roomType);
  const capEl = sidebar.querySelector("#office-capacity");
  if (capEl) capEl.textContent = cap ? String(cap) : "—";

  const list = sidebar.querySelector("#office-occupants");
  if (!list) return;
  list.innerHTML = "<em>Chargement...</em>";

  try {
    const res = await fetch("/api/employees");
    const employees = await res.json();

    const occupants = (employees || []).filter(e =>
      Number(e?.desk?.room?.id) === Number(currentOfficeRoomId)
    );

    if (occupants.length === 0) {
      list.innerHTML = "<em>Aucun occupant</em>";
      return;
    }
    occupants.sort((a, b) =>
      `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, "fr")
    );

    list.innerHTML = occupants.map(e => `
      <div class="schedule-item meeting">
        <span class="title">${e.firstName} ${e.lastName}</span>
      </div>
    `).join("");
  } catch (e) {
    list.innerHTML = "<em>Erreur de chargement</em>";
  }
}


let meetingFormState = {
  open: false,
  selectedParticipants: [], // {id, firstName, lastName}
  searchTimer: null,
};

function bindMeetingRoomActions() {
  const btn = sidebar.querySelector("#btn-add-meeting");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const container = sidebar.querySelector("#meeting-form-container");
    if (!container) return;

    meetingFormState.open = !meetingFormState.open;
    container.classList.toggle("hidden", !meetingFormState.open);

    if (meetingFormState.open) {
      renderMeetingForm(container);
      bindMeetingForm(container);
    } else {
      container.innerHTML = "";
    }
  });
}

function renderMeetingForm(container) {
  const dateStr = currentScheduleDate.toISOString().split("T")[0];

  container.innerHTML = `
    <form id="meeting-form" class="meeting-form">
      <div class="form-row">
        <label>Titre</label>
        <input type="text" id="meeting-title" placeholder="Ex: Point hebdo" required />
      </div>

      <div class="form-row">
        <label>Date</label>
        <input type="date" id="meeting-date" value="${dateStr}" required />
      </div>

      <div class="form-grid-2">
        <div class="form-row">
          <label>Début</label>
          <input type="time" id="meeting-start" required />
        </div>

        <div class="form-row">
          <label>Fin</label>
          <input type="time" id="meeting-end" required />
        </div>
      </div>

      <div class="form-row">
        <label>Participants</label>

        <div class="participant-search">
          <input type="text" id="participant-q" placeholder="Rechercher un employé..." autocomplete="off" />
          <div class="participant-dropdown hidden" id="participant-dropdown"></div>
        </div>

        <div class="participant-chips" id="participant-chips"></div>
      </div>

      <div class="form-actions">
        <button type="button" class="secondary-btn" id="meeting-cancel">Annuler</button>
        <button type="submit" class="primary-btn">Créer la réunion</button>
      </div>

      <div class="form-hint" id="meeting-hint"></div>
    </form>
  `;

  meetingFormState.selectedParticipants = [];
  renderParticipantChips();
}

function bindMeetingForm(container) {
  const form = container.querySelector("#meeting-form");
  const cancelBtn = container.querySelector("#meeting-cancel");
  const qInput = container.querySelector("#participant-q");
  const dropdown = container.querySelector("#participant-dropdown");

  cancelBtn?.addEventListener("click", () => {
    meetingFormState.open = false;
    container.classList.add("hidden");
    container.innerHTML = "";
  });

  // Recherche participants (debounce léger)
  qInput?.addEventListener("input", () => {
    const q = qInput.value.trim();
    clearTimeout(meetingFormState.searchTimer);

    if (!q) {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      return;
    }

    meetingFormState.searchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/employees/search/${encodeURIComponent(q)}`);
        const results = await res.json();
        renderParticipantDropdown(results || [], dropdown, qInput);
      } catch {
        dropdown.classList.add("hidden");
        dropdown.innerHTML = "";
      }
    }, 200);
  });

  // Fermer dropdown si blur (avec petit délai pour laisser le click passer)
  qInput?.addEventListener("blur", () => {
    setTimeout(() => dropdown.classList.add("hidden"), 150);
  });

  qInput?.addEventListener("focus", () => {
    if (dropdown.innerHTML.trim() !== "") dropdown.classList.remove("hidden");
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await submitMeetingForm(container);
  });
}

function renderParticipantDropdown(results, dropdown, qInput) {
  dropdown.innerHTML = "";
  dropdown.classList.remove("hidden");

  // Filtrer ceux déjà sélectionnés
  const selectedIds = new Set(meetingFormState.selectedParticipants.map(p => Number(p.id)));
  const filtered = (results || []).filter(r => !selectedIds.has(Number(r.id)));

  if (filtered.length === 0) {
    dropdown.innerHTML = `<div class="participant-item muted">Aucun résultat</div>`;
    return;
  }

  filtered.slice(0, 10).forEach(emp => {
    const item = document.createElement("div");
    item.className = "participant-item";
    item.textContent = `${emp.firstName} ${emp.lastName}`;
    item.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      meetingFormState.selectedParticipants.push({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
      });
      qInput.value = "";
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      renderParticipantChips();
    });
    dropdown.appendChild(item);
  });
}

function renderParticipantChips() {
  const chips = sidebar.querySelector("#participant-chips");
  if (!chips) return;

  if (meetingFormState.selectedParticipants.length === 0) {
    chips.innerHTML = `<span class="muted">Aucun participant ajouté</span>`;
    return;
  }

  chips.innerHTML = meetingFormState.selectedParticipants.map(p => `
    <span class="chip">
      ${p.firstName} ${p.lastName}
      <button type="button" class="chip-x" data-id="${p.id}" aria-label="remove">×</button>
    </span>
  `).join("");

  chips.querySelectorAll(".chip-x").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      meetingFormState.selectedParticipants = meetingFormState.selectedParticipants.filter(p => Number(p.id) !== id);
      renderParticipantChips();
    });
  });
}

async function submitMeetingForm(container) {
  const hint = container.querySelector("#meeting-hint");
  const title = container.querySelector("#meeting-title")?.value?.trim();
  const date = container.querySelector("#meeting-date")?.value;
  const start = container.querySelector("#meeting-start")?.value;
  const end = container.querySelector("#meeting-end")?.value;

  const setHint = (msg, ok=false) => {
    if (!hint) return;
    hint.textContent = msg || "";
    hint.classList.toggle("ok", !!ok);
    hint.classList.toggle("err", !ok);
  };

  if (!currentRoomId) return setHint("Aucune salle sélectionnée.");
  if (!title) return setHint("Le titre est obligatoire.");
  if (!date || !start || !end) return setHint("Date / heures obligatoires.");

  if (start >= end) return setHint("L'heure de fin doit être après l'heure de début.");

  const startDT = `${date}T${start}:00`;
  const endDT = `${date}T${end}:00`;

  setHint("Création en cours...", true);

  try {
    const meetingRes = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        startingHour: startDT,
        endHour: endDT,
        description: "",
        room: { id: Number(currentRoomId) },
        desk: null,
      }),
    });

    if (!meetingRes.ok) {
      setHint("Erreur lors de la création de la réunion.");
      return;
    }

    const meeting = await meetingRes.json();
    const meetingId = meeting?.id;
    if (!meetingId) {
      setHint("Réunion créée, mais ID manquant.");
      return;
    }

    const participants = meetingFormState.selectedParticipants || [];
    for (const p of participants) {
      await fetch("/api/meeting-participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting: { id: Number(meetingId) },
          employee: { id: Number(p.id) },
          present: true,
          remote: false,
        }),
      });
    }

    setHint("Réunion créée", true);

    await loadRoomSchedule();

    setTimeout(() => {
      meetingFormState.open = false;
      container.classList.add("hidden");
      container.innerHTML = "";
    }, 600);

  } catch (e) {
    setHint("Erreur réseau.");
  }
}
