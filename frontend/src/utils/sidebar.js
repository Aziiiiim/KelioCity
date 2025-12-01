const sidebar = document.getElementById("sidebar");

export function openSidebar(tempInfo = "Personnage sélectionné") {
  sidebar.innerHTML = `
    <h2>Informations</h2>
    <p>${tempInfo}</p>
  `;
  sidebar.classList.remove("hidden");
  sidebar.classList.add("visible");
}

export function closeSidebar() {
  sidebar.classList.remove("visible");
  sidebar.classList.add("hidden");
}
