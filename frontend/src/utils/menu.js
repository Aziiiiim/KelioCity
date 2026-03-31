import { getMyEmployeeId } from "../core/scene.jsx";
import { apiFetch } from "./apiFetch.js";
import { mountAvatar3D } from "./avatar3D.js"; 

const menu = document.getElementById("menu");
let ignoreNextOutsideClick = false;

let profileCache = null;      // cache du profil utilisateur
let profileEditing = false;   // indique si on est en mode édition

let avatar3dHandle = null;    // référence vers le rendu 3D de l’avatar

function onKeyDown(e){
    // ferme le menu avec Échap
    if (e.key === "Escape") closeMenu();
}

function onOutsideClick(e){
    // ferme si clic en dehors du menu
    if (ignoreNextOutsideClick) {
        ignoreNextOutsideClick = false;
        return;
    }
    if (!menu.contains(e.target) && !e.target.closest("#menu-btn")) closeMenu();
}

export function openMenu(){
    // ouvre le menu principal (profil / notifications)
    if (!menu) return;

    menu.classList.remove("hidden");
    menu.classList.add("visible");

    requestAnimationFrame(() => {
        menu.innerHTML = `
            <button class="close-btn" id="menu-close">&times;</button>

            <div class="menu-header">
                <h2 class="menu-title">Menu</h2>
                <div></div>
            </div>

            <div class="menu-tabs">
                <button class="menu-tab active" data-tab="profile">Profil</button>
                <button class="menu-tab" data-tab="notifications">Notifications</button>
            </div>

            <div id="menu-content">
                <div class="card"><em>Chargement...</em></div>
            </div>
        `;

        menu.querySelector("#menu-close")?.addEventListener("click", closeMenu);

        menu.querySelectorAll(".menu-tab").forEach(btn => {
            btn.addEventListener("click", () => {
                menu.querySelectorAll(".menu-tab").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderTab(btn.dataset.tab);
            });
        });

        menu.addEventListener("click", (e) => e.stopPropagation());
        ignoreNextOutsideClick = true;
        document.addEventListener("click", onOutsideClick);
        document.addEventListener("keydown", onKeyDown);

        renderTab("profile");
    });
}

async function renderTab(tab){
    const content = menu.querySelector("#menu-content");
    if (!content) return;

    if (tab === "profile"){
        await renderProfileTab();
        return;
    } else {
        content.innerHTML = `
            <div class="card">
                <h3>Notifications</h3>
                <p>À faire : liste des notifications</p>
            </div>
        `;
    }
}

export function closeMenu(){
    // ferme le menu et nettoie le rendu 3D
    if (!menu) return;

    menu.classList.remove("visible");

    setTimeout(() => {
        menu.classList.add("hidden");
        menu.innerHTML = "";
    }, 350);

    document.removeEventListener("click", onOutsideClick);
    document.removeEventListener("keydown", onKeyDown);

    avatar3dHandle?.dispose?.();
    avatar3dHandle = null;
}

async function renderProfileTab() {
    const content = menu?.querySelector("#menu-content");
    if (!menu || !content) return;

    // charge le profil une seule fois puis le garde en cache
    if (!profileCache) {
        content.innerHTML = `<div class="card"><em>Chargement du profil...</em></div>`;
        try {
            const res = await apiFetch("/api/employees/" + getMyEmployeeId());
            if (!res.ok) throw new Error("HTTP " + res.status);
            profileCache = await res.json();
        } catch {
            content.innerHTML = `<div class="card"><em>Erreur de chargement du profil</em></div>`;
            return;
        }
    }

    if (!profileEditing) {
        renderProfileView(profileCache);
    } else {
        renderProfileEdit(profileCache);
    }
}

function renderProfileView(me) {
    // affichage du profil en lecture seule
    const content = menu?.querySelector("#menu-content");
    if (!menu || !content) return;

    const fullName = `${me?.firstName ?? ""} ${me?.lastName ?? ""}`.trim() || "Mon profil";

    content.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar"></div>
            <div>
                <h3 class="profile-name">${escapeHtml(fullName)}</h3>
            </div>
            <div></div>
            <button class="pencil-btn" id="profile-edit" title="Modifier">
                <img src="/assets/icons/edit.png" alt="Modifier">
            </button>
        </div>

        <div class="card">
            <h3>Informations</h3>
            <div class="profile-grid">
                <div class="profile-label">Prénom</div>
                <div class="profile-value">${escapeHtml(me?.firstName ?? "—")}</div>

                <div class="profile-label">Nom</div>
                <div class="profile-value">${escapeHtml(me?.lastName ?? "—")}</div>

                <div class="profile-label">Email</div>
                <div class="profile-value">${escapeHtml(me?.email ?? "—")}</div>

                <div class="profile-label">Téléphone</div>
                <div class="profile-value">${escapeHtml(me?.phoneNumber ?? "—")}</div>
            </div>
        </div>

        <div class="profile-avatar-block">
            <div class="avatar3d-wrap">
                <canvas id="me-avatar-canvas"></canvas>
            </div>
        </div>

        <div class="menu-bottom-spacer"></div>
    `;

    // monte l’avatar 3D du profil
    const canvas = content.querySelector("#me-avatar-canvas");
    if (canvas) {
        avatar3dHandle?.dispose?.();
        avatar3dHandle = mountAvatar3D(canvas, normalizeSpriteForGlb(me?.sprite));
    }

    content.querySelector("#profile-edit")?.addEventListener("click", () => {
        profileEditing = true;
        renderProfileEdit(profileCache);
    });
}

function renderProfileEdit(me) {
    // affichage du formulaire d’édition
    const content = menu?.querySelector("#menu-content");
    if (!menu || !content) return;

    content.innerHTML = `
        <div class="menu-header">
            <h3 class="menu-title" style="font-size:22px;margin:0;">Modifier mon profil</h3>
            <div></div>
        </div>

        <div class="card">
            <h3>Coordonnées</h3>
            <div class="profile-grid">
                <div class="profile-label">Prénom</div>
                <div><input class="profile-input" id="me-firstName" value="${attr(me?.firstName ?? "")}" /></div>

                <div class="profile-label">Nom</div>
                <div><input class="profile-input" id="me-lastName" value="${attr(me?.lastName ?? "")}" /></div>

                <div class="profile-label">Email</div>
                <div>
                    <input class="profile-input" value="${attr(me?.email ?? "")}" disabled title="Email non modifiable" />
                </div>

                <div class="profile-label">Téléphone</div>
                <div><input class="profile-input" id="me-phone" value="${attr(me?.phoneNumber ?? "")}" /></div>
            </div>
        </div>

        <div class="card">
            <h3>Avatar</h3>
            <div class="sprite-picker" id="sprite-picker">
                <div class="sprite-card" data-sprite="S1"><canvas></canvas></div>
                <div class="sprite-card" data-sprite="S2"><canvas></canvas></div>
                <div class="sprite-card" data-sprite="S3"><canvas></canvas></div>
                <div class="sprite-card" data-sprite="S4"><canvas></canvas></div>
            </div>
        </div>

        <div class="profile-actions">
            <button class="menu-secondary-btn" id="me-cancel" type="button">Annuler</button>
            <button class="menu-primary-btn" id="me-save" type="button">Enregistrer</button>
        </div>

        <div class="menu-hint" id="me-hint"></div>
        <div class="menu-bottom-spacer"></div>
    `;

    const options = spritesFor(me); 
    let selectedSprite = normalizeSpriteForGlb(me?.sprite); 
    const cards = [...content.querySelectorAll(".sprite-card")];
    const pickerHandles = [];

    // initialise les 4 avatars sélectionnables
    cards.forEach((card, i) => {
        const spriteName = options[i];
        card.dataset.sprite = spriteName;

        if (spriteName === selectedSprite) card.classList.add("selected");

        const canvas = card.querySelector("canvas");
        if (canvas) {
            pickerHandles.push(mountAvatar3D(canvas, spriteName));
        }

        card.addEventListener("click", () => {
            selectedSprite = spriteName;
            cards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
        });
    });

    const hintEl = content.querySelector("#me-hint");
    const setHint = (msg, ok = false) => {
        if (!hintEl) return;
        hintEl.textContent = msg || "";
        hintEl.classList.toggle("ok", !!ok);
        hintEl.classList.toggle("err", !ok);
    };

    content.querySelector("#me-cancel")?.addEventListener("click", () => {
        profileEditing = false;
        renderProfileView(profileCache);
    });

    content.querySelector("#me-reset")?.addEventListener("click", () => {
        const fn = content.querySelector("#me-firstName");
        const ln = content.querySelector("#me-lastName");
        const ph = content.querySelector("#me-phone");
        sp = normalizeSpriteForDb(selectedSprite); 

        if (fn) fn.value = me?.firstName ?? "";
        if (ln) ln.value = me?.lastName ?? "";
        if (ph) ph.value = me?.phoneNumber ?? "";
        if (sp) sp = me?.sprite ?? "";

        setHint("");
    });

    function disposePicker(){
        // nettoie les petits aperçus 3D
        for (const h of pickerHandles) h?.dispose?.();
    }

    content.querySelector("#me-save")?.addEventListener("click", async () => {
        const firstName = content.querySelector("#me-firstName")?.value?.trim() ?? "";
        const lastName  = content.querySelector("#me-lastName")?.value?.trim() ?? "";
        const phoneNumber = content.querySelector("#me-phone")?.value?.trim() ?? "";
        const sprite = normalizeSpriteForDb(selectedSprite); 

        if (!firstName || !lastName) {
            setHint("Prénom et nom sont obligatoires.");
            return;
        }

        setHint("Enregistrement...", true);

        const me = profileCache;
        const payload = {
            id: me.id,
            firstName,
            lastName,
            phoneNumber,
            email: me.email,
            workingHours: me.workingHours,
            inOffice: me.inOffice,
            status: me.status,
            sprite,
            desk: me.desk?.id ? { id: me.desk.id } : null,
        };

        try {
            const res = await apiFetch("/api/employees/" + getMyEmployeeId(), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                setHint("Erreur lors de l'enregistrement.");
                return;
            }

            // met à jour le cache local après sauvegarde
            profileCache = { ...profileCache, firstName, lastName, phoneNumber, sprite };
            disposePicker();

            setHint("Enregistré", true);
            profileEditing = false;

            setTimeout(() => renderProfileView(profileCache), 250);

        } catch {
            setHint("Erreur réseau.");
        }
    });
}

/* Helpers anti XSS / attributs sûrs */
function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function attr(str) {
    return escapeHtml(str).replaceAll("\n", " ");
}

function spritesFor(me){
    // renvoie la bonne famille de sprites selon l’avatar actuel
    const s = String(me?.sprite || "").toUpperCase();
    const isMan = s.startsWith("MAN");
    return isMan ? ["Man1","Man2","Man3","Man4"] : ["Woman1","Woman2","Woman3","Woman4"];
}

function normalizeSpriteForGlb(spriteDb){
    // convertit format DB -> format nom de fichier glb
    const s = String(spriteDb || "").toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalizeSpriteForDb(spriteGlb){
    // convertit format affichage -> format DB
    return String(spriteGlb || "").toUpperCase();
}