import { openSidebar, openMeetingRoomSidebar, openOfficeSidebar, closeSidebar } from "./sidebar.js";
import { cameraOn } from "../core/camera.jsx";
import { apiFetch } from "./apiFetch.js";
import {updateFloorByStairs} from "./selectFloor.js"
import * as THREE from "three";

const globalStatusCache = new Map(); // id -> { value, ts }
const GLOBAL_TTL = 5000;

function colorFromGlobalStatus(gs) {
  if (gs === "AVAILABLE") return 0x00ff00;
  if (gs === "REMOTE") return 0xeeff00;
  if (gs === "OCCUPIED") return 0xdf8423;
  if (gs === "ABSENT") return 0xff0000;
  return 0xffffff;
}

function getGlobalStatusCached(id) {
  const now = performance.now();
  const cached = globalStatusCache.get(id);
  if (cached && now - cached.ts < GLOBAL_TTL) return cached.value;
  return null;
}

async function fetchGlobalStatus(id) {
  const res = await apiFetch(`/api/employees/${id}/global_status`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const value = await res.text();
  globalStatusCache.set(id, { value, ts: performance.now() });
  return value;
}


export function createInteractionManager({ camera, renderer, targets }) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const domElement = renderer.domElement;

  const originalMaterials = new WeakMap();
  const persistentStyles = new WeakMap();
  let hoveredRoot = null;

  const plugins = [];

  function addPlugin(plugin) {
    plugins.push(plugin);
    plugins.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  function clearPlugins() {
    plugins.length = 0;
  }

  function storeOriginal(root) {
    let store = originalMaterials.get(root);
    if (!store) {
      store = {};
      originalMaterials.set(root, store);
    }
    root.traverse((n) => {
      if (!n.isMesh) return;
      if (!store[n.uuid]) {
        store[n.uuid] = n.material;
      }
    });
  }

  function restore(root) {
    const mats = originalMaterials.get(root);
    if (!mats) return;
    root.traverse((n) => {
      if (n.isMesh && mats[n.uuid]){
        if (n.material !== mats[n.uuid]) {
          n.material.dispose();
        }
        n.material = mats[n.uuid];
      } 
    });
  }

  function applyStyle(root, style) {
    if (!style) return;
    storeOriginal(root);
    root.traverse((n) => {
      if (!n.isMesh) return;
      n.material = n.material.clone();
      if (style.color != null && n.material.color) n.material.color.set(style.color);
      if (style.emissive != null && n.material.emissive) n.material.emissive.set(style.emissive);
      if (style.multiplyScalar != null && n.material.color) n.material.color.multiplyScalar(style.multiplyScalar);
    });
  }

  function getMouseHits(e, targetsOverride) {
    const bounds = domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const list = (targetsOverride ?? targets);
    const targetList = Array.isArray(list) ? list : [list];
    const allHits = [];
    for (const t of targetList) {
      allHits.push(...raycaster.intersectObject(t, true));
    }
    allHits.sort((a, b) => a.distance - b.distance);
    return allHits;
  }

  let styleVersion = 0;

  async function hover(e) {
    if (e.target.closest("#sidebar")) return;
    

    let selected = null;
    let selectedHit = null;
    for (const p of plugins) {
      const hits = getMouseHits(e, p.targets); 
      const hit = hits.find(h => p.match(h.object, h));
      if (hit) {
        selected = p;
        selectedHit = hit;
        break;
      }
    }
    const newRoot = selected ? selected.getRoot(selectedHit.object, selectedHit) : null;

    if (hoveredRoot && hoveredRoot !== newRoot) restoreButKeepPersistent(hoveredRoot);
    hoveredRoot = newRoot;

    if (!selected || !newRoot) return;

    const v = ++styleVersion;
    const style = await selected.getStyle?.(newRoot, selectedHit);

    if (v !== styleVersion) return;
    if (hoveredRoot !== newRoot) return;

    applyStyle(newRoot, style);
  }

  function applyPersistentIfAny(root) {
    const st = persistentStyles.get(root);
    if (st) applyStyle(root, st);
  }

  function restoreButKeepPersistent(root) {
    restore(root);
    applyPersistentIfAny(root);
  }

  function setPersistentStyle(root, style) {
    if (!root) return;
    persistentStyles.set(root, style);
    restore(root);
    applyStyle(root, style);
  }

  function clearPersistentStyle(root) {
    if (!root) return;
    persistentStyles.delete(root);
    restore(root);
  }

  function click(e) {
    if (e.target.closest("#sidebar")) return;
    for (const p of plugins) {
      const hits = getMouseHits(e, p.targets);
      const hit = hits.find(h => p.match(h.object, h));
      if (hit) {
        const root = p.getRoot(hit.object, hit);
        if (root) p.onClick?.(root, hit);
        return;
      }
    }
  }

  let pendingEvent = null;
  let rafId = null;

  function onMouseMove(e) {
    pendingEvent = e;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (pendingEvent) hover(pendingEvent);
    });
  }

  domElement.addEventListener("pointermove", onMouseMove);
  domElement.addEventListener("pointerdown", click);

  function dispose() {
    domElement.removeEventListener("pointermove", onMouseMove);
    domElement.removeEventListener("pointerdown", click);
  }
  function refresh() {
    if (pendingEvent) hover(pendingEvent);
  }

    return { addPlugin, clearPlugins, dispose, refresh, setPersistentStyle, clearPersistentStyle };
}


export function doorPlugin() {
  return {
    name: "door",
    priority: 100,
    match: (obj) => {
      let cur = obj;
      while (cur) {
        if (cur.userData?.kind === "door") return true;
        cur = cur.parent;
      }
      return false;
    },
    getRoot: (obj) => {
      let cur = obj;
      while (cur && cur.userData?.kind !== "door") cur = cur.parent;
      return cur;
    },
    getStyle: () => ({
      color: 0x777777,
    }),
    onClick: (doorRoot) => {
      doorRoot.userData.toggleDoor?.();
    },
  };
}

export function employeePlugin({ camera, controls, charactersGroup, refresh }) {
  return {
    name: "employee",
    priority: 50,
    targets: [charactersGroup],
    match: (obj) => {
      let cur = obj;
      while (cur) {
        if (cur.userData?.employee) return true;
        cur = cur.parent;
      }
      return false;
    },
    getRoot: (obj) => {
      let cur = obj;
      while (cur && !cur.userData?.employee) cur = cur.parent;
      return cur;
    },
    getStyle: async (root) => {
      const employee = root.userData.employee;
      const cached = getGlobalStatusCached(employee.id);
      if (cached !== null) {
        const color = colorFromGlobalStatus(cached);
        return { color, emissive: 0x003300 };
      }

      fetchGlobalStatus(employee.id)
      .then(() => refresh?.())
      .catch((e) => console.error("global_status fetch failed", employee.id, e));
      return null;
    },
    onClick: (root) => {
      const employee = root.userData.employee;
      openSidebar(employee);
      cameraOn(camera, controls, root);
    },
  };
}

export function roomPlugin({camera, controls, onlyTypes = null } = {}) {
  return {
    name: "room",
    priority: 10,

    match: (obj) => {
      let cur = obj;
      while (cur) {
        if (cur.userData?.kind === "room") {
          if (!onlyTypes) return true;
          return onlyTypes.includes(cur.userData.roomType);
        }
        cur = cur.parent;
      }
      return false;
    },

    getRoot: (obj) => {
      let cur = obj;
      while (cur && cur.userData?.kind !== "room") cur = cur.parent;
      return cur;
    },

    getStyle: () => ({ color: 0x6666ff, emissive: 0x000022 }),
    onClick: (root) => {
      if(root.userData.roomType == "MeetingRoom") openMeetingRoomSidebar(root);
      if(root.userData.roomType.toLowerCase().includes("desk") || root.userData.roomType.toLowerCase().includes("amphi") ) openOfficeSidebar(root);
      if(root.userData.roomType == "Stairs") {
        if (root.userData.nextFloor) {
          updateFloorByStairs(root.userData.nextFloor.id);
        }
      } else {
        cameraOn(camera, controls, root);
      }
    },
  };
}

export function filtersPlugin(charactersGroup) {
  const availableHighlighted = new Set();
  const occupiedHighlighted = new Set();

  let availableOn = false;
  let occupiedOn = false;

  function getEmployeeRoots() {
    const roots = [];
    charactersGroup.traverse((n) => {
      if (n.userData?.employee) roots.push(n);
    });
    return roots;
  }

  async function highlightByStatus({ interactionManager, wantedStatuses, style, storeSet }) {
    const roots = getEmployeeRoots();

    const jobs = roots.map(async (root) => {
      const employee = root.userData.employee;
      if (!employee?.id) return null;

      let gs = getGlobalStatusCached(employee.id);
      if (gs === null) {
        try {
          gs = await fetchGlobalStatus(employee.id);
        } catch {
          return null;
        }
      }

      if (wantedStatuses.includes(gs)) return { root, gs };
      return null;
    });

    const results = await Promise.all(jobs);

    for (const r of results) {
      if (!r) continue;
      const color = colorFromGlobalStatus(r.gs);
      interactionManager.setPersistentStyle(r.root, { color, emissive: 0x003300 });
      storeSet.add(r.root);
    }
  }

  function clearHighlights({ interactionManager, storeSet }) {
    for (const root of storeSet) {
      interactionManager.clearPersistentStyle(root);
    }
    storeSet.clear();
  }

  return {
    toggleAvailable: async (interactionManager) => {
      availableOn = !availableOn;
      if (!availableOn) {
        clearHighlights({ interactionManager, storeSet: availableHighlighted });
        return;
      }
      await highlightByStatus({
        interactionManager,
        wantedStatuses: ["AVAILABLE", "REMOTE"],
        storeSet: availableHighlighted,
      });
    },

    toggleOccupied: async (interactionManager) => {
      occupiedOn = !occupiedOn;
      if (!occupiedOn) {
        clearHighlights({ interactionManager, storeSet: occupiedHighlighted });
        return;
      }
      await highlightByStatus({
        interactionManager,
        wantedStatuses: ["OCCUPIED", "ABSENT"],
        storeSet: occupiedHighlighted,
      });
    },
  };
}

export function deskSelectionPlugin({ charactersGroup, onDeskSelected }) {
  function isDeskOccupied(deskId) {
    let found = false;
    charactersGroup.traverse(n => {
      if (n.userData?.employee?.desk?.id === deskId) found = true;
    });
    return found;
  }
  return {
    name: "deskSelection",
    priority: 200,

    match: (obj) => {
      let cur = obj;
      while (cur) {
        if (cur.userData?.kind === "desk") return true;
        cur = cur.parent;
      }
      return false;
    },

    getRoot: (obj) => {
      let cur = obj;
      while (cur && cur.userData?.kind !== "desk") cur = cur.parent;
      return cur;
    },

    getStyle: (root) => {
      const deskId = root.userData?.deskId;
      if (!deskId) {
        console.log("[deskSelection] hover desk WITHOUT deskId", root);
        return { color: 0xff00ff, emissive: 0x220022 }; // violet debug
      }

      const isOccupied = (() => {
        let found = false;
        charactersGroup.traverse(n => {
          if (n.userData?.employee?.desk?.id === deskId) {
            found = true;
          }
        });
        return found;
      })();

      if (isOccupied) {
        return { color: 0xff0000, emissive: 0x330000 };
      }

      return { color: 0x00ff00, emissive: 0x003300 };
    },

    onClick: (root) => {
      const deskId = root.userData?.deskId;
      if (!deskId) return;

      if (isDeskOccupied(deskId)) {
        console.log("Desk occupied:", deskId);
        return;
      }

      onDeskSelected?.(deskId, root);
    },
  };
}

