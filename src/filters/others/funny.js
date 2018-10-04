import * as fx from 'glfx-es6';

async function funny(canvas, imageBitmap) {
  const fxCanvas = fx.canvas();
  const texture = fxCanvas.texture(imageBitmap);
  fxCanvas.draw(texture).update();

  const faceDetector = new FaceDetector();
  try {
    const faces = await faceDetector.detect(imageBitmap);
    for (const face of faces) {
      console.log(face);
      const box = face.boundingBox;
      fxCanvas
        .bulgePinch((box.left + box.right) / 2, (box.top + box.bottom) / 2, Math.max(box.width, box.height), 0.85)
        .update();
    }
  } catch (err) {}
  return fxCanvas;
}

export default funny;
