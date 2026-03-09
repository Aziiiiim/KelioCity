import { apiFetch } from "./apiFetch.js";

let timer = null;
let lastVersion = null;

export function startChangesWatcher(onChange, { intervalMs = 2000 } = {}) {
  stopChangesWatcher();

  const tick = async () => {
    try {
      const res = await apiFetch("/api/changes/version");
      if (!res.ok) return;
      const v = Number(await res.text());

      if (Number.isFinite(v)) {
        if (lastVersion === null) lastVersion = v;
        else if (v !== lastVersion) {
          lastVersion = v;
          onChange?.(v);
        }
      }
    } catch {
    }
  };

  tick();
  timer = setInterval(tick, intervalMs);
}

export function stopChangesWatcher() {
  if (timer) clearInterval(timer);
  timer = null;
}