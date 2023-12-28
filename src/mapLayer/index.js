window.CESIUM_BASE_URL = process.env.CESIUM_BASE_URL;

import { Cartesian3, Ion, Viewer, createGooglePhotorealistic3DTileset, Color, JulianDate } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { goHome } from "../helpers/cameraHelpers";
import { TALLINN_POSITION } from "../constants/values";

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
  globe: false,
  // terrain: Terrain.fromWorldTerrain(),
});

viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 100_000_000;
viewer.camera.percentageChanged = 0.001;

viewer.scene.skyAtmosphere.show = true;
//  Photorealistic 3D Tiles
try {
  const tileset = await createGooglePhotorealistic3DTileset();
  viewer.scene.primitives.add(tileset);
} catch (error) {
  console.log(`Error loading Photorealistic 3D Tiles tileset.
  ${error}`);
}

goHome();




const dot = viewer.entities.add({
  position: Cartesian3.fromDegrees(24.7536, 59.437, 1_000),
  point: {
    pixelSize: 20,
    color: Color.RED,
  },
});

const dot2 = viewer.entities.add({
  position: Cartesian3.fromDegrees(24.7536, 59.437, 1_000),
  point: {
    pixelSize: 20,
    color: Color.CORNFLOWERBLUE,
  },
});

const trackEntity = (entity) => {
  viewer.trackedEntity = entity;
};

viewer.selectedEntityChanged.addEventListener((entity) => {
  if (!entity) {
    return;
  }
  trackEntity(entity);
  runOneTime = true;
});




let runOneTime = false;
let counter = 2;
viewer.clock.onTick.addEventListener(function (clock) {
  const secondsElapsed = JulianDate.secondsDifference(
    JulianDate.now(),
    clock.startTime
  );
  const distance = secondsElapsed / 10;

  dot.position = Cartesian3.fromDegrees(
    TALLINN_POSITION.longitude + distance,
    TALLINN_POSITION.latitude,
    TALLINN_POSITION.height
  );

  dot2.position = Cartesian3.fromDegrees(
    TALLINN_POSITION.longitude,
    TALLINN_POSITION.latitude - distance / 2,
    TALLINN_POSITION.height + 1000
  );

  if (runOneTime) {
    viewer.camera.lookAtTransform(
      viewer.camera.transform,
      new HeadingPitchRange(Math.PI / 2, -Math.PI / 12, 1000)
    );
    counter--;

    if (counter <= 0) {
      // Hack due to race condition on Ticker and camera.lookAtTransform
      counter = 2;
      runOneTime = false;
    }
  }
});
