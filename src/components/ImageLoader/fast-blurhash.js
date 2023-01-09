import { decodeBlurHash } from 'fast-blurhash';

// Note this code depends on the markup created by AnyLoader, so
// if it is changed, the drill-down to the image has to be adjusted here.

document.querySelectorAll('img.blurhash').forEach((img) => {
  const dataRaw = img.getAttribute('data');
  const data = JSON.parse(dataRaw);
  const { width, height, hash, canvasStyle, imgWidth, ratio } = data;
  // Take the original aspect ratio from the img
  const image = img.previousSibling.firstChild.firstChild;
  const computedStyle = getComputedStyle(image);
  const { aspectRatio, objectFit } = computedStyle;
  // Replace the image with a canvas
  //
  const canvas = document.createElement('canvas');
  img.replaceWith(canvas);
  for (const cssProp in canvasStyle) {
    canvas.style[cssProp] = canvasStyle[cssProp];
  }
  canvas.style.width = parseFloat(imgWidth) + 'px';
  canvas.height = height;
  canvas.width = width;
  // Important: ignore auto aspect ratios from the image,
  // ie. "auto 1440 / 980"
  if (
    aspectRatio &&
    !aspectRatio.startsWith('auto') &&
    !canvas.style.aspectRatio
  ) {
    canvas.style.aspectRatio = aspectRatio;
    canvas.style.objectFit = objectFit;
    canvas.style.height = 'auto';
  } else if (imgWidth) {
    canvas.style.height = parseFloat(imgWidth) / ratio + 'px';
  }
  // Paint the blurhash on the canvas
  const pixels = decodeBlurHash(hash, width, height);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
});
