import * as filters from './filters.js';

self.addEventListener('message', async ({ data: { filterName, canvas, imageBitmap } }) => {
  try {
    await filters[filterName](canvas, imageBitmap);
  } catch (err) {
    console.error(err);
    return self.postMessage({ error: err.message });
  }
  return self.postMessage({ success: true });
});
