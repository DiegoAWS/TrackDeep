import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'node_modules/cesium/Build/Cesium/Workers', dest: 'static/Cesium' },
        { src: 'node_modules/cesium/Build/Cesium/ThirdParty', dest: 'static/Cesium' },
        { src: 'node_modules/cesium/Build/Cesium/Assets', dest: 'static/Cesium' },
        { src: 'node_modules/cesium/Build/Cesium/Widgets', dest: 'static/Cesium' }
      ]
    })
  ],
  define: {
    'process.env.CESIUM_BASE_URL': JSON.stringify('/static/Cesium/')
  },
   build: {
    target: 'esnext'
  }
});
