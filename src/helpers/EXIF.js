import piexif from 'piexifjs';
import moment from 'moment';

const { degToDmsRational } = piexif.GPSHelper;

/**
 * @param {Blob} blob
 * @returns {string}
 */
async function blobToBinaryString(blob) {
  const fileReader = new FileReader();
  const waitReadingPromise = new Promise((resolve, reject) => {
    fileReader.addEventListener('load', resolve, { once: true });
    fileReader.addEventListener('error', reject, { once: true });
  });
  fileReader.readAsBinaryString(blob);
  await waitReadingPromise;
  return fileReader.result;
}

/**
 * @param {string} str
 * @param {BlobPropertyBag} [options]
 * @returns {Blob}
 */
function binaryStringToBlob(str, options) {
  const bytes = new Uint8Array(str.length);
  for (var idx = 0; idx < str.length; idx++) {
    bytes[idx] = str.charCodeAt(idx) & 0xff;
  }
  return new Blob([bytes], options);
}

class EXIF {
  /**
   * @typedef EXIFOptions
   * @prop {number} width
   * @prop {number} height
   * @prop {number} [longitude]
   * @prop {number} [latitude]
   */

  /** @param {EXIFOptions} options */
  static generateEXIFObject(options = {}) {
    const now = moment();
    const dateTimeString = now.format('YYYY:MM:DD HH:mm:ss');

    const exifObj = {
      '0th': {
        [piexif.ImageIFD.XResolution]: [72, 1],
        [piexif.ImageIFD.YResolution]: [72, 1],
        [piexif.ImageIFD.ResolutionUnit]: 2,
        [piexif.ImageIFD.YCbCrPositioning]: 1,
        [piexif.ImageIFD.DateTime]: dateTimeString,
      },
      Exif: {
        [piexif.ExifIFD.ExifVersion]: '0230',
        [piexif.ExifIFD.DateTimeOriginal]: dateTimeString,
        [piexif.ExifIFD.DateTimeDigitized]: dateTimeString,
        [piexif.ExifIFD.ComponentsConfiguration]: '\x01\x02\x03\x00',
        [piexif.ExifIFD.FlashpixVersion]: '0100',
        [piexif.ExifIFD.ColorSpace]: 1,
        [piexif.ExifIFD.PixelXDimension]: options.width,
        [piexif.ExifIFD.PixelYDimension]: options.height,
      },
    };

    if (options.latitude != null && options.longitude != null) {
      const utc = now.utc();
      const utcTimeStamp = [[utc.hour(), 1], [utc.minute(), 1], [utc.second() * 1000 + utc.millisecond(), 1000]];
      const utcDateString = utc.format('YYYY:MM:DD');

      Object.assign(exifObj, {
        GPS: {
          [piexif.GPSIFD.GPSVersionID]: [2, 3, 0, 0],
          [piexif.GPSIFD.GPSLatitudeRef]: options.latitude > 0 ? 'N' : 'S',
          [piexif.GPSIFD.GPSLatitude]: degToDmsRational(Math.abs(options.latitude)),
          [piexif.GPSIFD.GPSLongitudeRef]: options.longitude > 0 ? 'E' : 'W',
          [piexif.GPSIFD.GPSLongitude]: degToDmsRational(Math.abs(options.longitude)),
          [piexif.GPSIFD.GPSTimeStamp]: utcTimeStamp,
          [piexif.GPSIFD.GPSDateStamp]: utcDateString,
        },
      });
    }

    return exifObj;
  }

  /**
   * @param {Blob} blob
   * @param {EXIFOptions} options
   */
  static async insertEXIFToBlob(blob, options) {
    const exif = EXIF.generateEXIFObject(options);
    const inserted = piexif.insert(piexif.dump(exif), await blobToBinaryString(blob));
    return binaryStringToBlob(inserted, { type: blob.type });
  }

  /**
   * @param {Blob} from
   * @param {Blob} to
   */
  static async copyEXIF(from, to) {
    const exif = piexif.load(await blobToBinaryString(from));
    const inserted = piexif.insert(piexif.dump(exif), await blobToBinaryString(to));
    return binaryStringToBlob(inserted, { type: to.type });
  }
}

export default EXIF;
