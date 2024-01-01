window.CESIUM_BASE_URL = process.env.CESIUM_BASE_URL;

import { Cartesian3, Ion, Viewer, Color, JulianDate, Terrain } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { goHome } from "../helpers/cameraHelpers";
import {
  MAXIMUM_CAMERA_HEIGHT,
  MINIMUM_CAMERA_HEIGHT,
  TALLINN_POSITION,
} from "../constants/values";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

// Initialize the Cesium Viewer in the HTML element with the `app` ID.
export const viewer = new Viewer("app", {
  infoBox: false,
  selectionIndicator: false,
  sceneModePicker: false,
  timeline: false,
  animation: false,
  baseLayerPicker: false,
  navigationInstructionsInitiallyVisible: true,
  homeButton: false,
  geocoder: false,
  fullscreenButton: false,
  scene3DOnly: true,
  
  terrain: Terrain.fromWorldTerrain(),
});

viewer.scene.screenSpaceCameraController.minimumZoomDistance =
  MINIMUM_CAMERA_HEIGHT;
viewer.scene.screenSpaceCameraController.maximumZoomDistance =
  MAXIMUM_CAMERA_HEIGHT;
viewer.camera.percentageChanged = 0.001;


// on the first load, go to Tallinn 
goHome();

