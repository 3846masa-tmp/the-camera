/**
 * @param {MediaStream} stream
 */
async function createVideoElement(stream) {
  const videoElem = document.createElement('video');

  const waitPlayingVideoPromise = new Promise((resolve, reject) => {
    videoElem.addEventListener('playing', resolve, { once: true });
    videoElem.addEventListener('error', reject, { once: true });
  });

  Object.assign(videoElem.style, {
    position: 'fixed',
    width: '1px',
    height: '1px',
    opacity: 0,
  });
  Object.assign(videoElem, {
    muted: true,
    autoplay: true,
    playsInline: true,
  });

  document.body.appendChild(videoElem);
  videoElem.srcObject = stream;
  await waitPlayingVideoPromise;

  return videoElem;
}

export default createVideoElement;
