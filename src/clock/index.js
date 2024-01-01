import { Cartesian3, Color, JulianDate } from "cesium";
import { viewer } from "../mapLayer";
import { TALLINN_POSITION } from "../constants/values";


// const dot = viewer.entities.add({
//     position: Cartesian3.fromDegrees(
//         24.7536, 59.437, 1_000
//         ),
//     point: {
//       pixelSize: 20,
//       color: Color.RED,
//     },
//   });
  
//   const dot2 = viewer.entities.add({
//     position: Cartesian3.fromDegrees(24.7536, 59.437, 1_000),
//     point: {
//       pixelSize: 20,
//       color: Color.CORNFLOWERBLUE,
//     },
//   });


let runOneTime = false;
let counter = 2;



// Clicking on an entity
viewer.selectedEntityChanged.addEventListener((entity) => {
    if (!entity) {
      return;
    }
    viewer.trackedEntity = entity;
    runOneTime = true;
  });
  
  

viewer.clock.onTick.addEventListener(function (clock) {
    const secondsElapsed = JulianDate.secondsDifference(
      JulianDate.now(),
      clock.startTime
    );
    const distance = secondsElapsed / 10;
  
    // dot.position = Cartesian3.fromDegrees(
    //   TALLINN_POSITION.longitude + distance,
    //   TALLINN_POSITION.latitude,
    //   1000
    // );
  
    // dot2.position = Cartesian3.fromDegrees(
    //   TALLINN_POSITION.longitude,
    //   TALLINN_POSITION.latitude - distance / 2,
    //    2000
    // );
  
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
  