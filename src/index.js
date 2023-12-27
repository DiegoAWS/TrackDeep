window.CESIUM_BASE_URL = process.env.CESIUM_BASE_URL;

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

// Initialize the Cesium Viewer in the HTML element with the `app` ID.
const viewer = new Viewer('app', {
  terrain: Terrain.fromWorldTerrain(),
});    


viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees( 24.7536,59.4370, 100_000),
  orientation: {
    heading: CesiumMath.toRadians(0.0),
    pitch: CesiumMath.toRadians(-90.0),
  }
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = await createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);   