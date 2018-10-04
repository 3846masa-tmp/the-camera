import { funny } from '~/filters/filters';

const worker = new Worker('./worker.js');
worker.addEventListener('error', console.error);

/** @param {string} filterName */
/** @param {Blob} blob */
const filter = async (filterName, blob) => {
  const imageBitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');

  Object.assign(canvas, {
    width: imageBitmap.width,
    height: imageBitmap.height,
  });

  if (filterName === 'funny') {
    const fxCanvas = await funny(canvas, imageBitmap);
    const filtered = new Promise((resolve) => fxCanvas.toBlob(resolve, 'image/jpeg'));
    return filtered;
  }

  const offscreen = canvas.transferControlToOffscreen();
  const waitPromise = new Promise((resolve) =>
    worker.addEventListener('message', (ev) => resolve(ev.data), { once: true }),
  );
  worker.postMessage({ filterName, imageBitmap, canvas: offscreen }, [offscreen]);

  const { status, error } = await waitPromise;
  if (error) {
    throw new Error(err);
  }
  if (status === 'not_found') {
    return blob;
  }

  const filtered = new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
  return filtered;
};

export default filter;
