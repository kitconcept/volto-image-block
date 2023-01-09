import React from 'react';
import { Image } from 'semantic-ui-react';
import AnyLoader from './AnyLoader';

/*

A React component ImageLoader. Loads a semantic UI image.

```jsx
<ImageLoader
  src={
    member?.image_field &&
    flattenToAppURL(
      `${member['@id']}/@@images/${member.image_field}/preview`,
    )
  }
  size="small"
  avatar
  placeholder={
    <Image
      src={avatarPlaceholderPNG}
      size="small"
      avatar
    />
  }
/>
```

This will become a react-semantic-ui Image with all the parameters specified in the ImageLoader props.
Before the image is loaded, it will show the component from the
placeholder property.

The placeholder property can be a single element or a list of
elements defined with <>...</>.

If the src component is empty, the image is not loaded and
the placeholder will be permanently shown. This makes it possible
to apply a condition in the src attribute.

As the semantic UI Image tag is allowed to have children,
ImageLoader also supports to have children, and they will behave as if they were children of the semantic UI Image tag. The children will only appear when the image has been loaded.
*/

export default (props) =>
  AnyLoader({
    ...props,
    createComponent: (props, children) =>
      React.createElement(
        React.forwardRef((props, ref) =>
          React.createElement(Image, props, children),
        ),
        props,
        children,
      ),
  });
