import { Cartesian3 } from "cesium";
import { goHome, viewer } from "../mapLayer";
import "./controlsLayer.scss";

const MINIMUM_CAMERA_HEIGHT = 100;
const MAXIMUM_CAMERA_HEIGHT = 100_000_000;
const MOVEMENT_SPEED_RADIANS_PER_METERS = 0.000_000_005;

const heightIndicatorElement = document.querySelector("#height-indicator");
const zoomInElement = document.querySelector("#zoom-in");
const zoomOutElement = document.querySelector("#zoom-out");

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

const computeCameraHeight = () => {
  const cameraHeightMeters = viewer.camera.positionCartographic.height;
  const heightUnity = cameraHeightMeters > 1000 ? "km" : "m";
  const heightValue =
    cameraHeightMeters > 1000 ? cameraHeightMeters / 1000 : cameraHeightMeters;
  const decimalPlaces =
    cameraHeightMeters < 100_000 && cameraHeightMeters >= 1000 ? 2 : 0;

  heightIndicatorElement.innerText = `${heightValue.toFixed(
    decimalPlaces
  )} ${heightUnity}`;

  return cameraHeightMeters;
};

computeCameraHeight();

viewer.camera.changed.addEventListener(() => {
  const cameraHeightMeters = computeCameraHeight();

  const heightUnity = cameraHeightMeters > 1000 ? "km" : "m";
  const heightValue =
    cameraHeightMeters > 1000 ? cameraHeightMeters / 1000 : cameraHeightMeters;
  const decimalPlaces =
    cameraHeightMeters < 100_000 && cameraHeightMeters >= 1000 ? 2 : 0;

  heightIndicatorElement.innerText = `${heightValue.toFixed(
    decimalPlaces
  )} ${heightUnity}`;

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

const isTooFar = () => {
  const cameraHeightMeters = viewer.camera.positionCartographic.height;
  return cameraHeightMeters >= MAXIMUM_CAMERA_HEIGHT;
};

const isTooClose = () => {
  const cameraHeightMeters = viewer.camera.positionCartographic.height;
  return cameraHeightMeters <= MINIMUM_CAMERA_HEIGHT;
};

let interval;

const stopMovement = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const startMovement = (fn, value) => {
  stopMovement();
  interval = setInterval(fn, 10, value);
};

const rotateCamera = (direction) => {
  const rotateValue = 0.01;
  switch (direction) {
    case "rotate-left":
      viewer.camera.setView({
        orientation: {
          heading: viewer.camera.heading + rotateValue,
          pitch: viewer.camera.pitch,
          roll: viewer.camera.roll,
        }
      })
      break;
    case "rotate-right":
      viewer.camera.setView({
        orientation: {
          heading: viewer.camera.heading - rotateValue,
          pitch: viewer.camera.pitch,
          roll: viewer.camera.roll,
        }
      })
      break;
  }
};

const moveCameraInDirection = (direction) => {
  const cameraHeightMeters = viewer.camera.positionCartographic.height;
  const degreesMovement =
    cameraHeightMeters * MOVEMENT_SPEED_RADIANS_PER_METERS;

  const cameraPosition = viewer.camera.positionCartographic;

  let degreesMovementLong = 0;
  let degreesMovementLat = 0;

  switch (direction) {
    case "left":
      degreesMovementLong = -degreesMovement;
      break;
    case "right":
      degreesMovementLong = degreesMovement;
      break;
    case "up":
      degreesMovementLat = degreesMovement / 2;
      break;
    case "down":
      degreesMovementLat = -degreesMovement / 2;
      break;
  }

  viewer.camera.flyTo({
    destination: Cartesian3.fromRadians(
      cameraPosition.longitude + degreesMovementLong,
      cameraPosition.latitude + degreesMovementLat,
      cameraPosition.height
    ),
    duration: 0,
  });
};

const zoomCamera = (value) => {
  const height = viewer.camera.positionCartographic.height;
  const zoomValue = 0.02 * height;

  switch (value) {
    case "zoom-in":
      if (!isTooClose()) viewer.camera.zoomIn(zoomValue);
      break;

    case "zoom-out":
      if (!isTooFar()) viewer.camera.zoomOut(zoomValue);
      break;
  }
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
        goHome(2);
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
