window.CESIUM_BASE_URL = process.env.CESIUM_BASE_URL;

import {
  Cartesian3,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
  HeadingPitchRange,
  Transforms,
  JulianDate,
  Color,
  PolylineOutlineMaterialProperty,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

// Initialize the Cesium Viewer in the HTML element with the `app` ID.
export const viewer = new Viewer("app", {
  terrain: Terrain.fromWorldTerrain(),
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
});

viewer.camera.percentageChanged = 0.001;

viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(24.7536, 59.437, 100_000),
  orientation: {
    heading: CesiumMath.toRadians(0.0),
    pitch: CesiumMath.toRadians(-90.0),
  },
  duration: 0,
});


const dot = viewer.entities.add({
  position: Cartesian3.fromDegrees(24.7536, 59.437, 1_000),
  point: {
    pixelSize: 20,
    color: Color.RED,
  },
});


const orangeOutlined = viewer.entities.add({
  name:
    "Orange line with black outline at height and following the surface",
  polyline: {
    positions: Cartesian3.fromDegreesArrayHeights([
      -75,
      39,
      250000,
      -125,
      39,
      250000,
    ]),
    width: 25,
    material: new PolylineOutlineMaterialProperty({
      color: Color.ORANGE,
      outlineWidth: 10,
      outlineColor: Color.BLACK,
    }),
  },
});

viewer.zoomTo(orangeOutlined);



viewer.selectedEntityChanged.addEventListener((entity) => {
  console.log(entity);
  viewer.trackedEntity = entity;
  if(!entity) {
    
    viewer.entities.remove(orangeOutlined);
    return;}
  viewer.flyTo(entity);


});





const followPath = async () => {
  //   for (let i = 0; i < 1000; i++) {
  //     console.log(
  //       viewer.camera.position,
  //       viewer.camera.heading,
  //       viewer.camera.pitch,
  //       viewer.camera.roll
  //     );
  //     viewer.camera.flyTo({
  //       destination: Cartesian3.fromDegrees(
  //         24.7536 + i * 0.0001,
  //         59.437 + i * 0.0001,
  //         1_000
  //       ),
  //       orientation: {
  //         heading: CesiumMath.toRadians(45),
  //         pitch: CesiumMath.toRadians(-30.0 + i * 0.01),
  //       },
  //       duration: 0,
  //     });
  //     await new Promise((resolve) => setTimeout(resolve, 10));
  //   }
};

// // // Lock camera to a point
// const center = Cartesian3.fromDegrees(24.7536, 59.437, 1_000);
// const transform = Transforms.eastNorthUpToFixedFrame(center);
// viewer.scene.camera.lookAtTransform(
//   transform,
//   new HeadingPitchRange(0, -Math.PI / 8, 2900)
// );

// const initialTimer = Date.now();

// viewer.clock.onTick.addEventListener(function (clock) {

//   const initialX = 24.7536;
//   const currentX = (Date.now() - initialTimer) / 100000  + initialX;
  
//   dot.position = Cartesian3.fromDegrees(currentX, 59.437, 1_000);
// });
  