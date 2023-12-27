import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'node_modules/cesium/Build/Cesium/Workers', dest: 'static/Cesium/Workers' },
        { src: 'node_modules/cesium/Build/Cesium/ThirdParty', dest: 'static/Cesium/ThirdParty' },
        { src: 'node_modules/cesium/Build/Cesium/Assets', dest: 'static/Cesium/Assets' },
        { src: 'node_modules/cesium/Build/Cesium/Widgets', dest: 'static/Cesium/Widgets' }
      ]
    })
  ],
  define: {
    'process.env.CESIUM_BASE_URL': JSON.stringify('/static/Cesium/')
  }
});
