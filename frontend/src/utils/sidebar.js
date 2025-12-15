const sidebar = document.getElementById("sidebar");


export function openSidebar(employee) {
  sidebar.innerHTML = `
    <button class="close-btn">&times;</button>

  <div class="sidebar-header">
    <div class="sidebar-avatar"></div>
    <div>
      <h2>${employee.firstName} ${employee.lastName}</h2>
      <div class="sidebar-status ${employee.status === "AVAILABLE" ? "sidebar-available" : (employee.status === "OCCUPIED" ? "sidebar-occupied" : "sidebar-not-available")}">${employee.status}</div>
    </div>
  </div>

  <div class="sidebar-section">
    <h3>Coordonnées</h3>
    <div class="info-row">
      <div class="info-label">Email</div>
      <div class="info-value">${employee.email}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Téléphone</div>
      <div class="info-value">${employee.phoneNumber}</div>
    </div>
  </div>

  <div class="sidebar-section">
    <h3>Position</h3>
    <div class="info-row">
      <div class="info-label">Bureau</div>
      <div class="info-value">${employee.desk?.room?.roomName ?? "Aucun"}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Présence</div>
      <div class="info-value">${employee.inOffice}</div>
    </div>
  </div>

  <div class="sidebar-section">
    <h3>Horaires</h3>
    <div class="info-row">
      <div class="info-value">${employee.workingHours}</div>
    </div>
  </div>
  `;

  sidebar.classList.remove("hidden");
  sidebar.classList.add("visible");

  // gestion du bouton de fermeture
  sidebar.querySelector(".close-btn").addEventListener("click", closeSidebar);
}

export function closeSidebar() {
  sidebar.classList.remove("visible");
  sidebar.classList.add("hidden");
}
