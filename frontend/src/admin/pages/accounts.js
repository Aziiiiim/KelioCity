import { apiFetch } from "../../utils/apiFetch.js";

const logoutBtn = document.getElementById("logout-btn");
const backBtn = document.getElementById("back-btn");
const rolePill = document.getElementById("role-pill");

const tbody = document.getElementById("tbody");
const search = document.getElementById("search");
const refreshBtn = document.getElementById("refresh");

let allEmployees = [];

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  window.location.href = "/src/auth/html/welcome.html";
});
backBtn.addEventListener("click", () => window.location.href = "/");
refreshBtn.addEventListener("click", loadEmployees);
search.addEventListener("input", render);

async function loadMe() {
  try {
    const res = await apiFetch("/api/me", { method: "GET" });
    if (!res.ok) return;
    const me = await res.json();
    rolePill.textContent = me.role ?? "—";
  } catch {}
}

async function loadEmployees() {
  tbody.innerHTML = `<tr><td colspan="7">Chargement…</td></tr>`;
  try {
    const res = await apiFetch("/api/employees", { method: "GET" });
    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="7">Erreur chargement</td></tr>`;
      return;
    }
    allEmployees = await res.json();
    render();
  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="7">Erreur réseau</td></tr>`;
  }
}

function render() {
  const q = (search.value || "").trim().toLowerCase();
  const rows = allEmployees.filter(emp => {
    const full = `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.toLowerCase();
    return !q || full.includes(q);
  });

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7">Aucun résultat</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(emp => {
    const name = `${escapeHtml(emp.firstName ?? "")} ${escapeHtml(emp.lastName ?? "")}`.trim();
    const desk = emp.desk?.id ? `#${emp.desk.id}` : "—";
    return `
      <tr>
        <td>${emp.id}</td>
        <td>${name}</td>
        <td>${escapeHtml(emp.email ?? "")}</td>
        <td>${escapeHtml(emp.status ?? "")}</td>
        <td>${escapeHtml(emp.inOffice ?? "")}</td>
        <td>${desk}</td>
        <td>
          <button class="btn btn-danger" data-del="${emp.id}">Supprimer</button>
        </td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.getAttribute("data-del"));
      const emp = allEmployees.find(e => e.id === id);
      const label = emp ? `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim() : `#${id}`;

      const ok = confirm(`Supprimer ${label} (employee id=${id}) ?`);
      if (!ok) return;

      await deleteEmployee(id);
    });
  });
}

async function deleteEmployee(id) {
  try {
    const res = await apiFetch(`/api/employees/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const msg = await safeText(res);
      alert(`Erreur: ${res.status}\n${msg}`);
      return;
    }
    // refresh list
    allEmployees = allEmployees.filter(e => e.id !== id);
    render();
  } catch (e) {
    console.error(e);
    alert("Erreur réseau");
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}
async function safeText(res) {
  try { return await res.text(); } catch { return ""; }
}

loadMe();
loadEmployees();