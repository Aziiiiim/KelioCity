import { apiFetch } from "./apiFetch.js";

let timer = null;
let lastVersion = null;

export function startChangesWatcher(onChange, { intervalMs = 2000 } = {}) {
  stopChangesWatcher(); // évite plusieurs watchers en même temps

  const tick = async () => {
    try {
      // récupère la version actuelle des changements côté serveur
      const res = await apiFetch("/api/changes/version");
      if (!res.ok) return;

      const v = Number(await res.text());

      if (Number.isFinite(v)) {
        if (lastVersion === null) {
          lastVersion = v; // première valeur connue
        } else if (v !== lastVersion) {
          lastVersion = v;
          onChange?.(v); // déclenche callback si changement détecté
        }
      }
    } catch {
      // ignore les erreurs réseau
    }
  };

  tick(); // lance un premier check immédiat
  timer = setInterval(tick, intervalMs); // puis check régulier
}

export function stopChangesWatcher() {
  if (timer) clearInterval(timer); // stop le watcher
  timer = null;
}