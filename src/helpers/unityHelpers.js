export const getFormatedHeight = (cameraHeightMeters) => {
  const heightUnity = cameraHeightMeters > 1000 ? "km" : "m";
  const heightValue =
    cameraHeightMeters > 1000 ? cameraHeightMeters / 1000 : cameraHeightMeters;
  const decimalPlaces =
    cameraHeightMeters < 100_000 && cameraHeightMeters >= 1000 ? 2 : 0;

  return `${heightValue.toFixed(decimalPlaces)} ${heightUnity}`;
};
