window.CESIUM_BASE_URL = process.env.CESIUM_BASE_URL;

import {
  Cartesian3,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
  Color,
  createGooglePhotorealistic3DTileset,
  HeadingPitchRange,
  Transforms,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

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
  // globe: false,
  terrain: Terrain.fromWorldTerrain(),
});

viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 100_000_000;
// viewer.scene.skyAtmosphere.show = true;
viewer.camera.percentageChanged = 0.001;

//  Photorealistic 3D Tiles
// try {
//   const tileset = await createGooglePhotorealistic3DTileset();
//   viewer.scene.primitives.add(tileset);
// } catch (error) {
//   console.log(`Error loading Photorealistic 3D Tiles tileset.
//   ${error}`);
// }

export const goHome = (duration = 0) => {
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(24.7536, 59.437, 100_000),
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-90.0),
    },
    duration,
  });
};

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

const initialTimer = Date.now();

let runOneTime = false;
let counter = 2;
viewer.clock.onTick.addEventListener(function (clock) {
  const initialX = 24.7536;
  const initialY = 59.437;
  const distance = (Date.now() - initialTimer) / 100000 ;

  dot.position = Cartesian3.fromDegrees(initialX + distance, initialY, 1_000);

  dot2.position = Cartesian3.fromDegrees(initialX, initialY - distance, 1_000);
  
  if (runOneTime) {
    viewer.camera.lookAtTransform(viewer.camera.transform, new HeadingPitchRange(Math.PI/2, -Math.PI/12, 1000));
    counter--;

    if (counter <= 0) { // Hack due to race condition on Ticker and camera.lookAtTransform
      counter = 2;
      runOneTime = false;
    }
  }
});
  




// Addding trailing line


// const orangeOutlined = viewer.entities.add({
//   name:
//     "Orange line with black outline at height and following the surface",
//   polyline: {
//     positions: Cartesian3.fromDegreesArrayHeights([
//       -75,
//       39,
//       250000,
//       -125,
//       39,
//       250000,
//     ]),
//     width: 25,
//     material: new PolylineOutlineMaterialProperty({
//       color: Color.ORANGE,
//       outlineWidth: 10,
//       outlineColor: Color.BLACK,
//     }),
//   },
// });

// viewer.zoomTo(orangeOutlined);