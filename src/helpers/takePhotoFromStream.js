import createVideoElement from '~/helpers/createVideoElement';

/** @param {MediaStream} stream */
async function takePhotoFromStream(stream) {
  const source = await getSourceFromMediaStream(stream);
  const blob = await getBlobFromSource(source);

  if (source instanceof HTMLVideoElement) {
    source.remove();
  } else {
    source.close();
  }
  return blob;
}

/**
 * @param {MediaStream} stream
 * @returns {Promise<HTMLVideoElement | ImageBitmap>}
 */
async function getSourceFromMediaStream(stream) {
  let source;
  if ('ImageCapture' in window) {
    const track = stream.getVideoTracks()[0];
    const capture = new ImageCapture(track);
    source = await capture.grabFrame();
  } else {
    source = await createVideoElement(stream);
  }
  return source;
}

/**
 * @param {HTMLVideoElement | ImageBitmap} source
 * @returns {Promise<Blob>}
 */
async function getBlobFromSource(source) {
  const canvas = document.createElement('canvas');

  if (source instanceof HTMLVideoElement) {
    Object.assign(canvas, {
      width: source.videoWidth,
      height: source.videoHeight,
    });
  } else {
    Object.assign(canvas, {
      width: source.width,
      height: source.height,
    });
  }

  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
  return blob;
}

export default takePhotoFromStream;
