import React, { useState, useEffect, useRef, useCallback } from 'react';

/*

Base component for creating image loaders. Should not be used
directly. Instead, it can be used to create a new loader element.

```jsx
<AnyLoader {...}
  createElememt={createElement}
  placeholder={[placeholder image or svg]}
>
  ...
</AnyLoader>
```

The createElement property must be a function that creates the
loading element. The function has the same signature as
React.createElement. The function must in particular, handle the
onLoad property passed to it and make sure that onLoad is called
when the created element has been loaded.

This can be adapted to any specific image loader class. Examples
provided are:

- ImgLoader.jsx for loading an html img element
- ImageLoader.jsx for loading a React Semantic UI Image element

*/

export default (props) => {
  const { children, createComponent, placeholder, ...imgProps } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef();
  const [placeholderProps, setPlaceholderProps] = useState({});
  const [placeholderChildren, setPlaceholderChildren] = useState(undefined);
  const onLoad = useCallback(() => {
    setIsLoaded(true);
    setPlaceholderProps(imgProps);
    setPlaceholderChildren(children);
  }, [imgProps, children]);
  const complete = ref.current?.complete;
  const naturalWidth = ref.current?.naturalWidth;
  useEffect(() => {
    if (ref.current?.complete && ref.current?.naturalWidth !== 0) {
      onLoad();
    }
    if (isLoaded && imgProps.src !== placeholderProps.src) {
      setIsLoaded(false);
    }
  }, [
    isLoaded,
    imgProps.src,
    placeholderProps.src,
    complete,
    naturalWidth,
    onLoad,
  ]);
  useEffect(() => {
    // copy the aspect ratio, if we have it, to the extra style reference
    // to allow the BlurhashCanvas to check if there is a fixed aspect ratio
    const placeholderExtraStyleRefCurrent =
      placeholder?.props.placeholderExtraStyleRef?.current;
    if (ref.current && placeholderExtraStyleRefCurrent) {
      const computedStyle = getComputedStyle(ref.current);
      const { aspectRatio, objectFit } = computedStyle;
      // Important: ignore auto aspect ratios from the image,
      // ie. "auto 1440 / 980"
      if (
        !aspectRatio?.startsWith('auto') &&
        !placeholderExtraStyleRefCurrent.aspectRatio
      ) {
        placeholderExtraStyleRefCurrent.aspectRatio = aspectRatio;
        placeholderExtraStyleRefCurrent.objectFit = objectFit;
      }
    }
  });
  // If there is no placeholder (or any transformer generating it, such as blurhash)
  // then shortcut to show the image without loading.
  // Else set up the loader.
  return placeholder ? (
    <>
      {isLoaded ? (
        createComponent(imgProps, children)
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', visibility: 'hidden' }}>
            {imgProps.src
              ? createComponent({ ...imgProps, onLoad, ref }, children)
              : null}
          </div>
        </div>
      )}
      {isLoaded
        ? null
        : placeholderProps.src
        ? createComponent(placeholderProps, placeholderChildren)
        : placeholder}
    </>
  ) : imgProps.src ? (
    createComponent(imgProps, children)
  ) : null;
};
