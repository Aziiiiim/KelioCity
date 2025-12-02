const sidebar = document.getElementById("sidebar");

const dummyEmployee = {
  firstName: "Azim",
  lastName: "Barhoumi",
  email: "azim.barhoumi@imt-atlantique.net",
  phoneNumber: "+33 6 01 02 03 04",
  desk: { id: 27 },
  workingHours: "09:00 - 17:00",
  inOffice: "OFFICE",
  status: "AVAILABLE",
  sprite: "Man3"
};



export function openSidebar(employee = dummyEmployee) {
  sidebar.innerHTML = `
    <button class="close-btn">&times;</button>

  <div class="sidebar-header">
    <div class="sidebar-avatar"></div>
    <div>
      <h2>${employee.firstName} ${employee.lastName}</h2>
      <div class="sidebar-status">${employee.status}</div>
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
      <div class="info-value">${employee.desk?.id ?? "Aucun"}</div>
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
