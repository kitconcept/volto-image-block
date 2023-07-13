import React, { useRef } from 'react';
import AnyLoader from './AnyLoader';
import makeSrcSet from './makeSrcSet';
import makeBlurhash from './makeBlurhash';
import extendProps from './extendProps';

/*

A React component Img.

It supports

- image loading with a placeholder
- blurhash as a placeholder
- srcset property generation

Using with a placeholder:

```jsx
<Img {...}
  placeholder={[placeholder image or svg]}
  alt=""
/>
```
Using with blurhash:

```jsx
<Img {...}
  blurhash="1.3333:LGE{8{%1Rk0LNH4:s.aeD*IV%L-:"
  alt=""
/>
```

Using with srcset:

```jsx
<Img
  src={http://127.0.0.1:3000/de/test-page/fancy-image.jpg"
  defaultScale="great"
  alt=""
/>
```

Combine srcset and blurhash with additional properties
in a Volto usage example:

```jsx
<Img
  blurhash={data.blurhash}
  blurhashOptions={{ style: { width: '100%' } }}
  style={{ height: data.height }}
  className={cx({
    'full-viewport-width': viewPortWidth,
  })}
  src={data.url}
  defaultScale={viewPortWidth ? 'huge' : 'great'}
  scales={data.image_scales?.image?.[0]?.scales}
  alt=""
/>
```

This will become an img with all the parameters specified in the ImgLoader props.
Before the image is loaded, it will show the component from the
placeholder property.

The image will also generate an `srcSet` with the specified (or default) image
scales, and if a defaultScale is specified, it changes
the `src` property to point to the url of the scale specified.

The blurhash will also be generated if specified.

# srcset properties

## 'srcSetOptions' property

Optional property, if missing then the defaults are used.

The defaults can also be specified in Volto's config.js file, full example with
all options (but only the ones you indend to change have to be provided):

```js
  config.settings.scrSetOptions = {
    enabled: true,
    isLocal: (src) => true,
    preprocessSrc: (src) =>
      src.replace(/\/@@images\/image\/.*$/, '').replace(/\/$/, ''),
    createScaledSrc: (src, scaleName, scaleData) => ({
      url: `${src}/@@images/image/${scaleName}`,
      width: scaleData,
    }),
    minWidth: 0,
    maxWidth: Infinity,
    scales: {
      // These are meaningful default however an application should provide
      // a custom createScaleUrl which can accept a scale info object instead of the width
      // we use here.
      icon: 32,
      tile: 64,
      thumb: 128,
      mini: 200,
      preview: 400,
      teaser: 600,
      large: 800,
      great: 1200,
      huge: 1600,
    },
  }}

```

The above example equals the actual default (that is, without even specifying them) lest the
`createScaledUrl` and `isLocal` functions fo avoid the dependencies.
So providing at least these two in config is desired.

```js
  import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers';

  config.settings.scrSetOptions = {
    isLocal: isInternalURL,
    preprocessSrc: (src) =>
      flattenToAppURL(
        src.replace(/\/@@images\/image\/.*$/, '').replace(/\/$/, ''),
      ),
    createScaledSrc: (src, scaleName, scaleData) => {
      return {
        url: `${src}/${scaleData.download}`,
        width: scaleData.width,
      };
    },
  };
```

Explanations for the options:

`enabled`: if set to false then neither the `src` nor the `srcSet` properties are amended.

'isLocal': a function that decides if an url is internal to the site. If the result is false then
the `srcset` and `src` props will not be amended, same as `enabled` false but selectively for some
urls only.

`preprocessSrc` is used to initially process the `src` property passed into the component. It can be
used, for example, to remove `/@@images/image` segments from the url to always arrive to a root url,
and remove a trailing slash, or anything that needs to be done as preprocessing.

`createScaledSrc`: a function that specifies the scale url and width from a base image `src`, a`scaleName`,
and the `scaleData`. The `scaleData` is an object whose keys are the scaleName-s, and its values
are anything that the application wants to use.

`scales`: specifies the list of scales to be used, it equals the `scaleData` described above, with a key
of `scaleName` and value of anything.

`minWidth`, `maxWidth` filter the list of scales and only the scales with a matching width will be
added to `srcSet`.

## Specifying no `srcSetOptions`

In most cases everything should "just work" without an `srcSetOptions` attribute and in this case the
defaults (specified in 'config.js`, or in the lack of this, the global defaults) will be applied

## `defaultScales`

This is a mandatory property. It must specify a `scaleName` avaliable in the `scale` definition.
This will be the image to be used as the `src` property of the image. The reason is the
component will never refer to the full sized image, always use an image that is already processed
and scaled down to a given size.

## `scales`

There are two modes of operations: static and dynamic scales.

With static scales, the `scales` property is not specified. Instead the scales are defined in the
option or in the Volto configuration. Then they are applied for all images. This might work for
Plone versions < 6. It's important that the scales must be kept in sync with the actual scales
from the back-end.

In Plone 6, the scales are provided by Volto for each image in the serialized data. So they can
be passed directly to the component. Besides other, this makes proper cache control for the images
possible.

To use dynamic scales, it's important that the default scales must be removed from the Volto
configuration:

```js
  config.settings.srcSetOptions = {
    // enabled: true,
    isLocal: isInternalURL,
    preprocessSrc: (src) =>
      flattenToAppURL(
        src.replace(/\/@@images\/image\/.*$/, '').replace(/\/$/, ''),
      ),
    createScaledSrc: (src, scaleName, scaleData) => {
      return {
        url: `${src}/${scaleData.download}`,
        width: scaleData.width,
      };
    },
    scales: {},
  }
```

Following this, the scales can be set directly as a property on the Img component:

```jsx
<Img
  src={data.url}
  defaultScale={viewPortWidth ? 'huge' : 'great'}
  scales={data.image_scales?.image?.[0]?.scales}
  alt=""
/>
```

# `placeholder` property

The placeholder property can be a single element or a list of
elements defined with <>...</>.

It can be used with or without srcsets. However it cannot be used
together with blurhash, as when blurhash is specified, it will become
the placeholder.

If the src component is empty, the image is not loaded and
the placeholder will be permanently shown. This makes it possible
to apply a condition in the src attribute.

ImgLoader cannot have children, as <img> is not allowed to have
children.

Example for png:

```jsx
<Img
  src={hasImage && flattenToAppURL(
    content.image.scales.teaser.download,
  )}
  alt={content.title}
  placeholder={<img src={personDummyPNG} alt={content.title} />}
/>
```

Example for svg:

```jsx
<Img
  src={item.image_field && flattenToAppURL(
    `${item['@id']}/@@images/${item.image_field}/preview`,
  )}
  alt={item.title}
  placeholder={<SomeSvg />}
/>
```

Example for Volto icon:

```jsx
<Img
  src={hasImage && flattenToAppURL(
    content.image.scales.teaser.download,
  )}
  alt={content.title}
  placeholder={(
    <Icon
      name={ploneSVG}
      size="20px"
      color="#007EB1"
      title={'plone-svg'}
     />
   )}
/>
```

# `blurhash` properties

## `blurhashOptions`

It is an object containing the options to control the blurhash generation.

`resolutionX`: the canvas width resolution, by default 32. Increasing this value will
create larger blurhash. Used for decoding the blurhash. This value should not correspond to the actual blurhash resolution but it should be a large enough value to accomodate it. Since the maximum blurhash resolution is 9, there is no point in creating a canvas larger than the default. The vertical resolution cannot be specified as it is calculated from the aspect ratio of the actual image.

`punch`: the blurhash punch parameter as specified by the blurhash library documentarion,
by default 1. A larger value will result in a larger blurhash and a more detailed blurred
image. Used for decoding the blurhash.

`style`: The property to be passed to the blurhash canvas. This can be used to set the width
of the canvas to fill its container. The height of the canvas then will be automatically
set according to the image ratio passed in as the first segment of the blurhash string in
the properties of the Img component.

Example for setting the default options in config:

```js
  config.settings.blurhashOptions = {
    resolutionX: 32,
    punch: 1,
    style: { width: '100%' },
  };
```

## `blurhash`

The blurhash property is optional. A blurhash will only be generated if it's present. In this
case it will be used as a placeholder. Because of this it cannot be used together with the
`placeholder` property.

The blurhash has to be created on the back-end, by concatenating
the image ratio number (width / height) and the blurhash provided by the python server side utility.
Example for blurhash property: `1.3333:LGE{8{%1Rk0LNH4:s.aeD*IV%L-:`

The blurhash, when rendered, will need to be the same size as the image loaded later.
To achieve this, the blurhash canvas has to be styled in the same way as the image (depending on the
application). Once the size of the canvas is correct, the height of the canvas will be set according
to the image ratio from the first tag of the property. For example, the following usage will pass the
style property to the canvas to make it fill its container width:

```jsx
<Img {...}
  blurhash="1.3333:LGE{8{%1Rk0LNH4:s.aeD*IV%L-:"
  blurhashOptions={{ style: { width: '100%' } }}
/>
```

Note that the style in the `blurhashOptions` is a different style from the one that is specified
directly on the Img component. The former one will be passed to the blurhash canvas, while the
latter one will be passed to the html image directly. Example:

```jsx
<Img
  blurhash={data.blurhash}
  blurhashOptions={{ style: { width: '100%' } }}     // passed to the blurhash canvas
  style={{ height: data.height }}                    // passed to the html image
/>
'''

There are two resize modes supported for the blurhash canvas:

- If the image has no direct or inherited `aspect-ratio` css style, the canvas height is set according to the
  canvas width and the intrinsic image ratio. This is maintaned continually as the canvas resizes.
  (If the width is set to 100%, this will always result in the canvas filling the parent element's width.)

- If the image has a direct or inherited `aspect-ratio` css style, the same `aspect-ratio` will be set on the
  canvas, together with the `objectFit` style.

Further generalization on the resizing strategy would be possible, once the need emerges.



 */

export default ({ blurhashOptions, ...props }) => {
  const placeholderExtraStyleRef = useRef({});
  props = extendProps(
    props,
    makeBlurhash(blurhashOptions, placeholderExtraStyleRef).fromProps(props),
  );
  return AnyLoader({
    ...props,
    createComponent: ({ srcSetOptions, ...props }, children) => {
      props = extendProps(props, makeSrcSet(srcSetOptions).fromProps(props));
      if (children !== undefined) {
        throw new Error('Children are not allowed in <Img>');
      }
      return React.createElement('img', props);
    },
  });
};
