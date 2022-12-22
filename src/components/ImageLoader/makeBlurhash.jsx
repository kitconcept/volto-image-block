import BlurhashCanvas from './BlurhashCanvas';
const config = require('@plone/volto/registry').default;

const makeBlurhash = (options, placeholderExtraStyleRef) => {
  if (options && options.hasOwnProperty('fromProps')) {
    // If already a cooked object - just use it.
    options = options.options;
  } else {
    // Calculating
    options = Object.assign(
      {
        resolutionX: 32,
        punch: 1,
        style: {},
      },
      config.settings.blurhashOptions,
      options,
    );
  }
  return {
    options,
    fromProps({ placeholder, blurhash, className, style, width, height }) {
      const { resolutionX, punch, style: canvasStyle } = this.options;
      const result = {};
      if (blurhash) {
        // Note the hash itself may contain the delimiter
        const delimiter = blurhash.indexOf(':');
        const ratio = parseFloat(blurhash.substring(0, delimiter));
        const hash = blurhash.substring(delimiter + 1);
        result.placeholder = (
          <BlurhashCanvas
            imgClass={className}
            imgStyle={style}
            imgWidth={width}
            imgHeight={height}
            style={canvasStyle}
            placeholderExtraStyleRef={placeholderExtraStyleRef}
            hash={hash}
            ratio={ratio}
            punch={punch}
            width={resolutionX}
          />
        );
        result.blurhash = undefined;
      }
      return result;
    },
  };
};
export default makeBlurhash;
