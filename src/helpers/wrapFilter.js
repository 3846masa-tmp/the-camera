/** @param {(canvas: HTMLCanvasElement, imageBitmap: ImageBitmap) => any} */
const wrapFilter = (filterFn) => {
  /** @param {Blob} blob */
  const wrapped = async (blob) => {
    const imageBitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');

    Object.assign(canvas, {
      width: imageBitmap.width,
      height: imageBitmap.height,
    });

    await filterFn(canvas, imageBitmap);

    const filtered = new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
    return filtered;
  };

  return wrapped;
};

export default wrapFilter;
