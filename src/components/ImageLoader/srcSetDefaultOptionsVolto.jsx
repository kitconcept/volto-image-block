import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers';

// Acquire server data for a block
export const blockDataSrc = {
  test: (src) => typeof src?.image_scales?.image?.[0]?.scales === 'object',
  isLocal: (src) => isInternalURL(src.url),
  preprocessSrc: (src) => ({
    ...src,
    __cache: {
      prefix: flattenToAppURL(
        src.url.replace(/\/@@images\/image.*$/, '').replace(/\/$/, ''),
      ),
    },
  }),
  getScalesFromProps: ({ src, scales }) => src.image_scales.image[0].scales,
  createScaledSrc: (src, scaleName, scaleData) => ({
    url: `${src.__cache.prefix}/${scaleData.download}`,
    width: scaleData.width,
  }),
  createNoDefaultScaleSrc: (src) =>
    flattenToAppURL(`${src.url}/${src.image_scales.image[0].download}`),
};

// Acquire server data for an image instance
export const contentDataSrc = {
  test: (src) => typeof src?.scales === 'object',
  isLocal: (src) => isInternalURL(src.download),
  preprocessSrc: (src) => src,
  getScalesFromProps: ({ src, scales }) => src.scales,
  createScaledSrc: (src, scaleName, scaleData) => ({
    // Important: this MUST be flattened, because it does not pass through
    // preprocessSrc.
    url: flattenToAppURL(scaleData.download),
    width: scaleData.width,
  }),
  createNoDefaultScaleSrc: (src) => flattenToAppURL(src.download),
};

// Work without server data from statically defined scales
export const stringSrc = {
  test: (src) => typeof src === 'string',
  isLocal: (src) => isInternalURL(src),
  getScalesFromProps: ({ src, scales }) => scales,
  preprocessSrc: (src) =>
    flattenToAppURL(src.replace(/\/@@images\/image.*$/, '').replace(/\/$/, '')),
  createScaledSrc: (src, scaleName, scaleData) => ({
    url: `${src}/@@images/image/${scaleName}`,
    width: scaleData,
  }),
  createNoDefaultScaleSrc: (src) => undefined,
};

// Fallback when no data is available (e.g. loading transition)
export const missingSrc = {
  test: (src) => true,
  isLocal: (scr) => false,
  preprocessSrc: (src) => undefined,
  getScalesFromProps: ({ src, scales }) => scales,
  createScaledSrc: (src, scaleName, scaleData) => ({}),
  createNoDefaultScaleSrc: (src) => undefined,
};

const getProcessor = (src) =>
  blockDataSrc.test(src)
    ? blockDataSrc
    : contentDataSrc.test(src)
    ? contentDataSrc
    : stringSrc.test(src)
    ? stringSrc
    : missingSrc;

const srcSetDefaultOptionsVolto = {
  // enabled: true,
  isLocal: (src) => getProcessor(src).isLocal(src),
  preprocessSrc: (src) => getProcessor(src).preprocessSrc(src),
  getScalesFromProps: ({ src, scales }) =>
    getProcessor(src).getScalesFromProps({ src, scales }),
  createScaledSrc: (src, scaleName, scaleData) =>
    getProcessor(src).createScaledSrc(src, scaleName, scaleData),
  createNoDefaultScaleSrc: (src) =>
    getProcessor(src).createNoDefaultScaleSrc(src),
  minWidth: 0,
  maxWidth: Infinity,
  scales: {},
};

export default srcSetDefaultOptionsVolto;
