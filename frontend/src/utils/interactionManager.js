import { openSidebar, closeSidebar } from "./sidebar.js";
import { cameraOn } from "../core/camera.jsx";

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
  const res = await fetch(`/api/employees/${id}/global_status`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const value = await res.text();
  globalStatusCache.set(id, { value, ts: performance.now() });
  return value;
}


export function createInteractionManager({ camera, renderer, targets }) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const domElement = renderer.domElement;

  const originalMaterials = new Map();
  let hoveredRoot = null;

  const plugins = [];

  function addPlugin(plugin) {
    plugins.push(plugin);
    plugins.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  function storeOriginal(root) {
    if (originalMaterials.has(root)) return;
    const store = {};
    root.traverse((n) => {
      if (n.isMesh) store[n.uuid] = n.material;
    });
    originalMaterials.set(root, store);
  }

  function restore(root) {
    const mats = originalMaterials.get(root);
    if (!mats) return;
    root.traverse((n) => {
      if (n.isMesh && mats[n.uuid]) n.material = mats[n.uuid];
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
      if (hit && p.match(hit.object, hit)) {
        selected = p;
        selectedHit = hit;
        break;
      }
    }

    const newRoot = selected ? selected.getRoot(selectedHit.object, selectedHit) : null;

    if (hoveredRoot && hoveredRoot !== newRoot) restore(hoveredRoot);
    hoveredRoot = newRoot;

    if (!selected || !newRoot) return;

    const v = ++styleVersion;
    const style = await selected.getStyle?.(newRoot, selectedHit);

    if (v !== styleVersion) return;
    if (hoveredRoot !== newRoot) return;

    applyStyle(newRoot, style);
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

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("click", click);

  function dispose() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("click", click);
  }
  function refresh() {
    if (pendingEvent) hover(pendingEvent);
  }

  return { addPlugin, dispose, refresh };
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

export function roomPlugin({ onlyTypes = null } = {}) {
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
    onClick: () => {},
  };
}
