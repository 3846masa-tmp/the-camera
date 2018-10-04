import createVideoElement from '~/helpers/createVideoElement';

const ASPECT_RATIO = 16 / 9;

const SIZE_CONSTRAINT = { min: 1, max: 7680, ideal: 7680 };

/**
 * @param {'user'  | 'environment'} facingMode
 * @param {number} [aspectRatio]
 */
async function getConstraintsWithFacingMode(facingMode, aspectRatio = ASPECT_RATIO) {
  /** @type {MediaStream} */
  let stream;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: facingMode },
        width: SIZE_CONSTRAINT,
        height: SIZE_CONSTRAINT,
      },
    });
  } catch (err) {
    console.error(err);
    return false;
  }

  // MediaTrack returns a part of all properties until playing
  const videoElem = await createVideoElement(stream);
  videoElem.remove();

  const videoTrack = stream.getVideoTracks()[0];
  const settings = videoTrack.getSettings();

  const recommended = {
    ...settings,
    ...generateSize(settings, aspectRatio),
    aspectRatio: { ideal: aspectRatio },
  };

  // MediaTrack.getCapabilities isn't supported in Firefox
  const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};

  // Stop all tracks
  for (const track of stream.getTracks()) {
    track.stop();
  }

  return {
    capabilities,
    recommended,
  };
}

function generateSize(settings, aspectRatio) {
  const { width, height } = settings;
  const longest = Math.max(width, height);
  const narrowest = Math.min(width, height);

  const maybeNarrow = longest / aspectRatio;
  const maybeLong = narrowest * aspectRatio;

  const ideal =
    narrowest >= maybeNarrow ? { long: longest, narrow: maybeNarrow } : { long: maybeLong, narrow: narrowest };

  return {
    width: Math.round(width === longest ? ideal.long : ideal.narrow),
    height: Math.round(height === longest ? ideal.long : ideal.narrow),
  };
}

export default getConstraintsWithFacingMode;
