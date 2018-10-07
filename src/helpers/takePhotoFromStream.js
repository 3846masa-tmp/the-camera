import createVideoElement from '~/helpers/createVideoElement';
import EXIF from '~/helpers/EXIF';
import getGeolocation from '~/helpers/getGeolocation';

/** @param {MediaStream} stream */
async function takePhotoFromStream(stream, facingMode = 'environment') {
  const source = await getSourceFromMediaStream(stream);

  let size = { width: source.width, height: source.height };
  // If source is HTMLVideoElement, use videoWidth and videoHeight.
  if (source instanceof HTMLVideoElement) {
    size = {
      width: source.videoWidth,
      height: source.videoHeight,
    };
  }

  const { coords } = await getGeolocation();
  const blob = await EXIF.insertEXIFToBlob(await getBlobFromSource(source, size, facingMode), {
    ...size,
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

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
 * @param {{ width: number; height: number; }} size
 * @returns {Promise<Blob>}
 */
async function getBlobFromSource(source, size, facingMode) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas, size);

  const ctx = canvas.getContext('2d');
  if (facingMode === 'user') {
    ctx.scale(-1, 1);
    ctx.drawImage(source, -size.width, 0);
  } else {
    ctx.drawImage(source, 0, 0);
  }

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
  return blob;
}

export default takePhotoFromStream;
