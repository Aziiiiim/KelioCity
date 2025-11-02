import * as THREE from 'three';

const LEFT_MOUSE_BUTTON = 0;
const MIDDLE_MOUSE_BUTTON = 1;
const RIGHT_MOUSE_BUTTON = 2;

const MIN_CAMERA_RADIUS = 2 ;
const MAX_CAMERA_RADIUS = 10 ;

const Y_AXIS = new THREE.Vector3(0,1,0);

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.cameraOrigin = new THREE.Vector3(0,0,0);
  camera.cameraRadius = 4 ;
  camera.cameraAzimuth = 0 ;
  camera.cameraElevation = 0 ;
  camera.isLeftMouseDown = false ;
  camera.isMiddleMouseDown = false ;
  camera.isRightMouseDown = false ;
  camera.prevMouseX = 0 ;
  camera.prevMouseY = 0 ;

  updateCameraPosition(camera);

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  }

  return { camera, resize };
}

function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function normalizeDeg(a){ a %= 360; return a < -180 ? a+360 : (a>180 ? a-360 : a); }

export function updateCameraPosition(camera){
  const r  = camera.cameraRadius;
  const az = toRadian( normalizeDeg(camera.cameraAzimuth) );
  const el = toRadian( clamp(camera.cameraElevation, -89, 89) );

  const rho = r * Math.cos(el);
  const x = rho * Math.sin(az);
  const y = r   * Math.sin(el);
  const z = rho * Math.cos(az);

  const pos = new THREE.Vector3(x, y, z).add(camera.cameraOrigin);
  camera.position.copy(pos);
  camera.lookAt(camera.cameraOrigin);
  camera.updateProjectionMatrix();
}


export function onMouseDown(event,camera){
  if(event.button == LEFT_MOUSE_BUTTON){
    camera.isRightMouseDown = false;
    camera.isMiddleMouseDown = false;
    camera.isLeftMouseDown = true;
  }
  else if(event.button == RIGHT_MOUSE_BUTTON){
    camera.isLeftMouseDown = false;
    camera.isMiddleMouseDown = false;
    camera.isRightMouseDown = true;
  }
  else if(event.button == MIDDLE_MOUSE_BUTTON){
    camera.isLeftMouseDown = false;
    camera.isRightMouseDown = false;
    camera.isMiddleMouseDown = true;
  }
  camera.prevMouseX = event.clientX;
  camera.prevMouseY = event.clientY;
  
}

export function onMouseUp(event,camera){
  if(event.button == LEFT_MOUSE_BUTTON){
    camera.isLeftMouseDown = false;
  }
  if(event.button == RIGHT_MOUSE_BUTTON){
    camera.isRightMouseDown = false;
  }
  if(event.button == MIDDLE_MOUSE_BUTTON){
    camera.isMiddleMouseDown = false;
  }
}

export function onMouseMove(event,camera){
  const deltaX = event.clientX - camera.prevMouseX ;
  const deltaY = event.clientY - camera.prevMouseY;
  if(camera.isLeftMouseDown){
    camera.cameraAzimuth += -(deltaX * 0.5);
    camera.cameraElevation += deltaY * 0.5;
    camera.cameraElevation = Math.min(180,Math.max(0,camera.cameraElevation));
    updateCameraPosition(camera);
  }

  if(camera.isMiddleMouseDown){
    const az  = toRadian(camera.cameraAzimuth);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, az);
    const up    = Y_AXIS.clone();
    const panSpeed = 0.002 * camera.cameraRadius;

    camera.cameraOrigin.addScaledVector(right, -deltaX * panSpeed);
    camera.cameraOrigin.addScaledVector(up,     +deltaY * panSpeed);

    updateCameraPosition(camera);
  }

  if(camera.isRightMouseDown){
    camera.cameraRadius += deltaY*0.02;
    camera.cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, camera.cameraRadius));
    updateCameraPosition(camera);
  }
  camera.prevMouseX = event.clientX ;
  camera.prevMouseY = event.clientY ;
}

export function toRadian(d){
  return d*Math.PI /180;
}