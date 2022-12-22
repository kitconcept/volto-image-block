import React from 'react';
import AnyLoader from './AnyLoader';

/*

A React component ImgLoader.

```jsx
<ImgLoader {...}
  placeholder={[placeholder image or svg]}
/>
```

This will become an img with all the parameters specified in the ImgLoader props.
Before the image is loaded, it will show the component from the
placeholder property.

The placeholder property can be a single element or a list of
elements defined with <>...</>.

If the src component is empty, the image is not loaded and
the placeholder will be permanently shown. This makes it possible
to apply a condition in the src attribute.

ImgLoader cannot have children, as <img> is not allowed to have
children.


Example for png:

```jsx
<ImgLoader
  src={hasImage && flattenToAppURL(
    content.image.scales.teaser.download,
  )}
  alt={content.title}
  placeholder={<img src={personDummyPNG} alt={content.title} />}
/>
```

Example for svg:

```jsx
<ImgLoader
  src={item.image_field && flattenToAppURL(
    `${item['@id']}/@@images/${item.image_field}/preview`,
  )}
  alt={item.title}
  placeholder={<SomeSvg />}
/>
```

Example for Volto icon:

```jsx
<ImgLoader
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

#Future improvement

Add blurHash as placeholder. Blurhash is a separate development effort. The blurhash can be added as placeholder. This will involve creating a new content type (or an adapter). _Not in the current scope._

 */

export default (props) =>
  AnyLoader({
    ...props,
    createComponent: (props, children) => {
      if (children !== undefined) {
        throw new Error('Children are not allowed in <ImgLoader>');
      }
      return React.createElement('img', props);
    },
  });
