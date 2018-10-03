/**
 * Based from FileSaver.js under the MIT License
 * Copyright (c) 2016 Eli Grey.
 */

/**
 * @param {Blob} blob
 * @param {string} filename
 */
function saveAs(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  const aLink = Object.assign(document.createElement('a'), {
    download: filename,
    href: blobUrl,
  });

  setTimeout(() => {
    aLink.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4e4);
  }, 0);
}

export default saveAs;
