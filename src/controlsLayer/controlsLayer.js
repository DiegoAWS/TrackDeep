import "./controlsLayer.scss";
import { viewer } from "../mapLayer";

const MINIMUM_CAMERA_HEIGHT = 100;
const MAXIMUM_CAMERA_HEIGHT = 100_000_000;
const zoomInElement = document.querySelector("#zoom-in");
const zoomOutElement = document.querySelector("#zoom-out");
const heightIndicatorElement = document.querySelector("#height-indicator");

const isTooFar = () => {
  const cameraHeightMeters = viewer.camera.positionCartographic.height;
  return cameraHeightMeters >= MAXIMUM_CAMERA_HEIGHT;
};

const isTooClose = () => {
  const cameraHeightMeters = viewer.camera.positionCartographic.height;
  return cameraHeightMeters <= MINIMUM_CAMERA_HEIGHT;
};

const onCameraChanged = () => {
  const cameraHeightMeters = viewer.camera.positionCartographic.height;

  heightIndicatorElement.innerText =
    (cameraHeightMeters / 1000).toFixed(2) + " km";

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
};

onCameraChanged();
viewer.camera.changed.addEventListener(onCameraChanged);

// zoomInElement.addEventListener("click", () => {
//   zoomAction(true);
// });

// zoomOutElement.addEventListener("click", () => {
//   zoomAction(false);
// });

let zoomInterval;
let isHolding = false;

const zoomAction = (zoomIn) => {
  const height = viewer.camera.positionCartographic.height;
  const zoomValue = 0.2 * height;
  if (zoomIn) {
    if (!isTooClose()) {
      viewer.camera.zoomIn(zoomValue);
    }
  } else if (!isTooFar()) {
    viewer.camera.zoomOut(zoomValue);
  }
};

const startZoom = (zoomIn) => {
  if (zoomInterval) clearInterval(zoomInterval);
  zoomInterval = setInterval(() => {
    zoomAction(zoomIn);
  }, 100); // Adjust the interval for smoother or faster zoom
};

const stopZoom = () => {
  isHolding = false;
  clearInterval(zoomInterval);
  zoomInterval = null;
};

const handleZoom = (zoomIn) => {
  zoomAction(zoomIn);

  setTimeout(() => {
    if (isHolding) {
      startZoom(zoomIn);
    }
  }, 500);
};

zoomInElement.addEventListener("mousedown", () => {
  isHolding = true;
  handleZoom(true);
});

zoomInElement.addEventListener(
  "touchstart",
  () => {
    isHolding = true;
    handleZoom(true);
  },
  { passive: true }
);

zoomOutElement.addEventListener("mousedown", () => {
  isHolding = true;
  handleZoom(false);
});

zoomOutElement.addEventListener(
  "touchstart",
  () => {
    isHolding = true;
    handleZoom(false);
  },
  { passive: true }
);

zoomInElement.addEventListener("mouseup", stopZoom);
zoomInElement.addEventListener("mouseleave", stopZoom);
zoomInElement.addEventListener("touchend", stopZoom);

zoomOutElement.addEventListener("mouseup", stopZoom);
zoomOutElement.addEventListener("mouseleave", stopZoom);
zoomOutElement.addEventListener("touchend", stopZoom);
