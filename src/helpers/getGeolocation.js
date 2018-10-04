/** @returns {Promise<Partial<Position>>} */
async function getGeolocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
    });
  }).catch((err) => {
    // Fallback
    return { coords: {} };
  });
}

export default getGeolocation;
