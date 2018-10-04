import wasm from './lib.rs';

function posterize(canvas, imageBitmap) {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const length = imageData.data.length;

  let pointer, error;
  try {
    pointer = wasm.alloc(length);
    const buffer = new Uint8ClampedArray(wasm.memory.buffer, pointer, length);
    buffer.set(imageData.data);
    wasm.posterize(pointer, buffer.length);
    imageData.data.set(buffer);
    ctx.putImageData(imageData, 0, 0);
  } catch (err) {
    error = err;
  } finally {
    wasm.dealloc(pointer, length);
  }

  if (error) {
    throw error;
  }
}

export default posterize;
