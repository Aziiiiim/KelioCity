import { createHighlighter } from "./highlighterCore.js";
import { openSidebar, closeSidebar } from "./sidebar.js";
import { cameraOn } from "../core/camera.jsx";

function employeeColor(employee, inMeeting) {
  if (employee.status === "AVAILABLE" && employee.inOffice === "OFFICE" && !inMeeting) return 0x00ff00;
  if (employee.inOffice === "REMOTE" && employee.status === "AVAILABLE" && !inMeeting) return 0xeeff00;
  if (employee.status === "OCCUPIED" || (inMeeting && employee.status !== "ABSENT")) return 0xdf8423;
  if (employee.status === "ABSENT") return 0xff0000;
  return 0xffffff;
}

export function createEmployeeHighlighter({ camera, controls, renderer, charactersGroup }) {
  const domElement = renderer.domElement;

  return createHighlighter({
    camera,
    domElement,
    targets: charactersGroup,

    getRoot: (obj, hit, targets) => {
      const group = charactersGroup;
      let cur = obj;
      while (cur.parent && cur.parent !== group) cur = cur.parent;
      return cur;
    },

    canHighlight: (root) => !!root?.userData?.employee,

    getStyle: async (root) => {
      const employee = root.userData.employee;
      const res = await fetch(`/api/employees/${employee.id}/in-meeting`);
      const inMeeting = (await res.text()) === "true";

      const color = employeeColor(employee, inMeeting);
      return { color, emissive: 0x003300 };
    },

    onClick: (root) => {
      const employee = root.userData.employee;
      openSidebar(employee);
      cameraOn(camera, controls, root);
    },
  });
}
