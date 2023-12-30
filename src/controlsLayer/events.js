import { Cartesian3 } from "cesium";
import { viewer } from "../mapLayer/index";
import {
  computeCameraHeight,
  getCameraHeight,
  goHome,
  isTooClose,
  isTooFar,
  moveCameraInDirection,
  rotateCamera,
  zoomCamera,
} from "../helpers/cameraHelpers";
import {
  heightIndicatorElement,
  zoomInElement,
  zoomOutElement,
} from "../constants/domElements";

import { getFormatedHeight } from "../helpers/unityHelpers";

let interval;

const controlsId = [
  "home",
  zoomInElement,
  zoomOutElement,
  "left",
  "right",
  "up",
  "down",
  "rotate-left",
  "rotate-right",
];

computeCameraHeight();

viewer.camera.changed.addEventListener(() => {
  const heightInMeters = getCameraHeight();

  heightIndicatorElement.innerText = getFormatedHeight(heightInMeters);

  if (isTooClose()) {
    zoomInElement.disabled = true;
  } else {
    zoomInElement.disabled = false;
  }

  if (isTooFar()) {
    zoomOutElement.disabled = true;
  } else {
    zoomOutElement.disabled = false;
  }
});

const stopMovement = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const startMovement = (fn, value) => {
  stopMovement(); // Stop previous movement if any
  interval = setInterval(fn, 10, value);
};

controlsId.forEach((id) => {
  const button = id instanceof Element ? id : document.getElementById(id);
  if (!button) {
    console.error(`Button with id ${id} not found`);
    return;
  }
  const eventHandler = (event) => {
    const id = event.currentTarget.id;
    switch (id) {
      case "home":
        goHome();
        break;
      case "rotate-left":
      case "rotate-right":
        startMovement(rotateCamera, id);
        break;

      case "zoom-in":
      case "zoom-out":
        startMovement(zoomCamera, id);
        break;

      case "left":
      case "right":
      case "up":
      case "down":
        startMovement(moveCameraInDirection, id);
    }
  };

  button.addEventListener("mousedown", eventHandler);
  button.addEventListener("touchstart", eventHandler);

  button.addEventListener("mouseup", stopMovement);
  button.addEventListener("touchend", stopMovement);
  button.addEventListener("mouseleave", stopMovement);
});
