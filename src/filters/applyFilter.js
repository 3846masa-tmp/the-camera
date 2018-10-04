import * as filters from './filters';

/** @param {string} filterName */
/** @param {Blob} blob */
const filter = async (filterName, blob) => {
  if (!filters[filterName]) {
    return blob;
  }

  const imageBitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');

  Object.assign(canvas, {
    width: imageBitmap.width,
    height: imageBitmap.height,
  });
  await filters[filterName](canvas, imageBitmap);

  const filtered = new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
  return filtered;
};

export default filter;
