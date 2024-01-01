import { Cartesian3, Math as CesiumMath } from "cesium";
import { viewer } from "../mapLayer/index";
import { heightIndicatorElement } from "../constants/domElements";
import {
  DEFAULT_CAMERA_HEIGHT,
  MAXIMUM_CAMERA_HEIGHT,
  MINIMUM_CAMERA_HEIGHT,
  MOVEMENT_SPEED_RADIANS_PER_METERS,
  ROTATION_STEP_RADIANS,
  TALLINN_POSITION,
  ZOOM_SPEED_BASED_HEIGHT,
} from "../constants/values";

export const getCameraHeight = () => {
  return viewer.camera.positionCartographic.height;
};

export const isTooFar = () => {
  const cameraHeightMeters = getCameraHeight();
  return cameraHeightMeters >= MAXIMUM_CAMERA_HEIGHT;
};

export const isTooClose = () => {
  const cameraHeightMeters = getCameraHeight();
  return cameraHeightMeters <= MINIMUM_CAMERA_HEIGHT;
};

export const computeCameraHeight = () => {
  const cameraHeightMeters = getCameraHeight();
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


export const goHome = (duration = 0) => {
  viewer.trackedEntity = undefined;

  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(
      TALLINN_POSITION.longitude,
      TALLINN_POSITION.latitude,
      DEFAULT_CAMERA_HEIGHT
    ),
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-90.0),
    },
    duration,
  });
};

export const rotateCamera = (direction) => {
  switch (direction) {
    case "rotate-left":
      viewer.camera.setView({
        orientation: {
          heading: viewer.camera.heading + ROTATION_STEP_RADIANS,
          pitch: viewer.camera.pitch,
          roll: viewer.camera.roll,
        },
      });
      break;
    case "rotate-right":
      viewer.camera.setView({
        orientation: {
          heading: viewer.camera.heading - ROTATION_STEP_RADIANS,
          pitch: viewer.camera.pitch,
          roll: viewer.camera.roll,
        },
      });
      break;
  }
};

export const moveCameraInDirection = (direction) => {
  const cameraHeightMeters = getCameraHeight();
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

export const zoomCamera = (value) => {
  const height = getCameraHeight();
  const zoomValue = height * ZOOM_SPEED_BASED_HEIGHT;

  switch (value) {
    case "zoom-in":
      if (!isTooClose()) viewer.camera.zoomIn(zoomValue);
      break;

    case "zoom-out":
      if (!isTooFar()) viewer.camera.zoomOut(zoomValue);
      break;
  }
};
