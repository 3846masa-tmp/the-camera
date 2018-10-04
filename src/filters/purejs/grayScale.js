/**
 * @param {HTMLCanvasElement} canvas
 * @param {ImageBitmap} imageBitmap
 */
function grayScale(canvas, imageBitmap) {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = imageData.data;

  for (let idx = 0; idx < buffer.length; idx += 4) {
    const [red, green, blue] = buffer.slice(idx, idx + 3);
    const arg = Math.floor(0.2126 * red + 0.7152 * green + 0.0722 * blue);
    buffer.set([arg, arg, arg], idx);
  }

  ctx.putImageData(imageData, 0, 0);
}

export default grayScale;
