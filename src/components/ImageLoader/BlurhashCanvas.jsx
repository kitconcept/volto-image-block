import { useRef, useState, useEffect } from 'react';
import { decode } from 'blurhash';

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

// Make sure it's a string it has 'px' in the end
// Passing a string without px will ignore the style and break!
const cssify = (n) =>
  typeof n === 'string' ? (n.match(/[0-9]$/) ? n + 'px' : n) : n;

export default ({
  style,
  hash,
  punch,
  ratio,
  width,
  imgClass,
  imgStyle,
  imgWidth,
  imgHeight,
  placeholderExtraStyleRef,
}) => {
  const ref = useRef();
  const [styleHeight, setStyleHeight] = useState();
  // Canvas height is determined from the width (resolutionX) and ratio
  const height = Math.ceil(width / ratio);

  useEffect(() => {
    const canvas = ref.current;
    if (canvas && styleHeight) {
      const pixels = decode(hash, width, height, punch);
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    }
  }, [hash, width, height, punch, styleHeight]);

  const aspectRatio = placeholderExtraStyleRef?.current?.aspectRatio;
  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      if (placeholderExtraStyleRef?.current?.aspectRatio) {
        setStyleHeight('auto');
      } else {
        const adjustHeight = () => {
          // Only update if the width is not zero
          // (zero width might be a bug in ResizeObserver,
          // and it would cause blurhash
          // to revert to the blank image, which we never want)
          if (canvas.offsetWidth > 0) {
            setStyleHeight(canvas.offsetWidth / ratio);
          }
        };
        adjustHeight();
        const observer = new ResizeObserver(adjustHeight);
        observer.observe(canvas);
        return () => observer.unobserve(canvas);
      }
    }
  }, [ratio, aspectRatio, placeholderExtraStyleRef]);

  // We only create a canvas after we have processed the original image's
  // computed style. Until then, we render a blank image to make sure
  // that it gets the same dimensions as the original image. Making it an
  // image lets us mimic the original image's computed css style.
  const cssImgWidth = cssify(imgWidth);
  return styleHeight ? (
    <canvas
      style={{
        width: cssImgWidth,
        ...style,
        ...placeholderExtraStyleRef?.current,
        height: styleHeight,
      }}
      height={height}
      width={width}
      ref={ref}
    />
  ) : (
    <img
      src={BLANK}
      alt=""
      className={imgClass ? imgClass + ' blurhash' : 'blurhash'}
      style={{ ...imgStyle, ...placeholderExtraStyleRef?.current }}
      width={imgWidth}
      height={imgHeight}
      data={JSON.stringify({
        hash,
        punch,
        ratio,
        width,
        height,
        canvasStyle: style,
        imgWidth: cssImgWidth,
      })}
      ref={ref}
    />
  );
};
