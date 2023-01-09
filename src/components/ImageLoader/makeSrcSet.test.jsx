import makeSrcSet from './makeSrcSet';
import config from '@plone/volto/registry';

describe('makeSrcSet', () => {
  let options;
  let origSrcSetOptions;

  beforeEach(() => {
    jest.clearAllMocks();
    options = {};
    origSrcSetOptions = config.settings.srcSetOptions;
    config.settings.srcSetOptions = options;
  });

  afterEach(() => {
    config.settings.srcSetOptions = origSrcSetOptions;
  });

  describe('fromProps generates scrSet', () => {
    const result = [
      '/foo/bar.jpg/@@images/image/icon 32w',
      '/foo/bar.jpg/@@images/image/tile 64w',
      '/foo/bar.jpg/@@images/image/thumb 128w',
      '/foo/bar.jpg/@@images/image/mini 200w',
      '/foo/bar.jpg/@@images/image/preview 400w',
      '/foo/bar.jpg/@@images/image/teaser 600w',
      '/foo/bar.jpg/@@images/image/large 800w',
      '/foo/bar.jpg/@@images/image/great 1200w',
      '/foo/bar.jpg/@@images/image/huge 1600w',
    ];
    test('regular', () => {
      expect(makeSrcSet().fromProps({ src: '/foo/bar.jpg' }).srcSet).toEqual(
        result,
      );
    });
    test('trailing slash', () => {
      expect(makeSrcSet().fromProps({ src: '/foo/bar.jpg/' }).srcSet).toEqual(
        result,
      );
    });
    test('scaled', () => {
      expect(
        makeSrcSet().fromProps({ src: '/foo/bar.jpg/@@images/image/anyscale' })
          .srcSet,
      ).toEqual(result);
    });
    test('with scales in fromProps', () => {
      expect(
        makeSrcSet().fromProps({
          src: '/foo/bar.jpg',
          scales: {
            large: 800,
            great: 1200,
          },
        }).srcSet,
      ).toEqual([
        '/foo/bar.jpg/@@images/image/large 800w',
        '/foo/bar.jpg/@@images/image/great 1200w',
      ]);
    });
  });

  describe('fromProps generates src', () => {
    const result = '/foo/bar.jpg/@@images/image/huge';
    test('without defaultScale', () => {
      expect(makeSrcSet().fromProps({ src: '/foo/bar.jpg' }).src).toEqual(
        undefined,
      );
    });
    describe('scale not found', () => {
      test('default', () => {
        // createMissingScaleSrc is used, by the default fixture this gives the
        // url back
        expect(
          makeSrcSet().fromProps({
            src: '/foo/bar.jpg',
            defaultScale: 'NOSUCH',
          }).src,
        ).toEqual('/foo/bar.jpg/@@images/image/NOSUCH');
      });
      test('with custom createMissingScaleSrc', () => {
        expect(
          makeSrcSet({
            createMissingScaleSrc: (url, defaultScale) =>
              `${url}/+++/${defaultScale}`,
          }).fromProps({
            src: '/foo/bar.jpg',
            defaultScale: 'NOSUCH',
          }).src,
        ).toEqual('/foo/bar.jpg/+++/NOSUCH');
      });
    });
    test('regular', () => {
      expect(
        makeSrcSet().fromProps({ src: '/foo/bar.jpg', defaultScale: 'huge' })
          .src,
      ).toEqual(result);
    });
    test('trailing slash', () => {
      expect(
        makeSrcSet().fromProps({ src: '/foo/bar.jpg/', defaultScale: 'huge' })
          .src,
      ).toEqual(result);
    });
    test('scaled', () => {
      expect(
        makeSrcSet().fromProps({
          src: '/foo/bar.jpg/@@images/image/anyscale',
          defaultScale: 'huge',
        }).src,
      ).toEqual(result);
    });
    test('defaultScale removed even if enabled=false', () => {
      expect(
        makeSrcSet({ enabled: false }).fromProps({
          src: '/foo/bar.jpg/@@images/image/anyscale',
          defaultScale: 'huge',
        }).defaultScale,
      ).toBe(undefined);
    });
    test('defaultScale removed even if not isLocal', () => {
      expect(
        makeSrcSet({ isLocal: () => false }).fromProps({
          src: '/foo/bar.jpg/@@images/image/anyscale',
          defaultScale: 'huge',
        }).defaultScale,
      ).toBe(undefined);
    });
  });

  describe('options', () => {
    test('scales', () => {
      expect(
        makeSrcSet({
          scales: {
            large: 800,
            great: 1200,
          },
        }).fromProps({ src: '/foo/bar.jpg' }).srcSet,
      ).toEqual([
        '/foo/bar.jpg/@@images/image/large 800w',
        '/foo/bar.jpg/@@images/image/great 1200w',
      ]);
    });
    test('maxWidth', () => {
      expect(
        makeSrcSet({
          maxWidth: 600,
        }).fromProps({ src: '/foo/bar.jpg' }).srcSet,
      ).toEqual([
        '/foo/bar.jpg/@@images/image/icon 32w',
        '/foo/bar.jpg/@@images/image/tile 64w',
        '/foo/bar.jpg/@@images/image/thumb 128w',
        '/foo/bar.jpg/@@images/image/mini 200w',
        '/foo/bar.jpg/@@images/image/preview 400w',
        '/foo/bar.jpg/@@images/image/teaser 600w',
      ]);
    });
    test('minWidth', () => {
      expect(
        makeSrcSet({
          minWidth: 400,
        }).fromProps({ src: '/foo/bar.jpg' }).srcSet,
      ).toEqual([
        '/foo/bar.jpg/@@images/image/preview 400w',
        '/foo/bar.jpg/@@images/image/teaser 600w',
        '/foo/bar.jpg/@@images/image/large 800w',
        '/foo/bar.jpg/@@images/image/great 1200w',
        '/foo/bar.jpg/@@images/image/huge 1600w',
      ]);
    });
    test('minWidth and maxWidth', () => {
      expect(
        makeSrcSet({
          minWidth: 400,
          maxWidth: 600,
        }).fromProps({ src: '/foo/bar.jpg' }).srcSet,
      ).toEqual([
        '/foo/bar.jpg/@@images/image/preview 400w',
        '/foo/bar.jpg/@@images/image/teaser 600w',
      ]);
    });
    test('enabled', () => {
      expect(
        makeSrcSet({
          enabled: false,
        }).fromProps({ src: '/foo/bar.jpg' }).srcSet,
      ).toBe(undefined);
    });
  });

  describe('@plone/volto/registry config', () => {
    test('scales', () => {
      Object.assign(options, {
        scales: {
          large: 800,
          great: 1200,
        },
      });
      expect(makeSrcSet().fromProps({ src: '/foo/bar.jpg' }).srcSet).toEqual([
        '/foo/bar.jpg/@@images/image/large 800w',
        '/foo/bar.jpg/@@images/image/great 1200w',
      ]);
    });
    test('maxWidth', () => {
      Object.assign(options, {
        maxWidth: 600,
      });
      expect(makeSrcSet().fromProps({ src: '/foo/bar.jpg' }).srcSet).toEqual([
        '/foo/bar.jpg/@@images/image/icon 32w',
        '/foo/bar.jpg/@@images/image/tile 64w',
        '/foo/bar.jpg/@@images/image/thumb 128w',
        '/foo/bar.jpg/@@images/image/mini 200w',
        '/foo/bar.jpg/@@images/image/preview 400w',
        '/foo/bar.jpg/@@images/image/teaser 600w',
      ]);
    });
    test('minWidth', () => {
      Object.assign(options, {
        minWidth: 400,
      });
      expect(makeSrcSet().fromProps({ src: '/foo/bar.jpg' }).srcSet).toEqual([
        '/foo/bar.jpg/@@images/image/preview 400w',
        '/foo/bar.jpg/@@images/image/teaser 600w',
        '/foo/bar.jpg/@@images/image/large 800w',
        '/foo/bar.jpg/@@images/image/great 1200w',
        '/foo/bar.jpg/@@images/image/huge 1600w',
      ]);
    });
    test('minWidth and maxWidth', () => {
      Object.assign(options, {
        minWidth: 400,
        maxWidth: 600,
      });
      expect(makeSrcSet().fromProps({ src: '/foo/bar.jpg' }).srcSet).toEqual([
        '/foo/bar.jpg/@@images/image/preview 400w',
        '/foo/bar.jpg/@@images/image/teaser 600w',
      ]);
    });
    test('enabled', () => {
      Object.assign(options, {
        enabled: false,
      });
      expect(makeSrcSet().fromProps({ src: '/foo/bar.jpg' }).srcSet).toEqual(
        undefined,
      );
    });
    test('createMissingScaleSrc', () => {
      Object.assign(options, {
        createMissingScaleSrc: (url, defaultScale) =>
          `${url}/+++/${defaultScale}`,
      });
      expect(
        makeSrcSet().fromProps({
          src: '/foo/bar.jpg',
          defaultScale: 'NOSUCH',
        }).src,
      ).toEqual('/foo/bar.jpg/+++/NOSUCH');
    });
  });

  describe('isLocal wrt srcset', () => {
    const result = [
      '/foo/bar.jpg/@@images/image/icon 32w',
      '/foo/bar.jpg/@@images/image/tile 64w',
      '/foo/bar.jpg/@@images/image/thumb 128w',
      '/foo/bar.jpg/@@images/image/mini 200w',
      '/foo/bar.jpg/@@images/image/preview 400w',
      '/foo/bar.jpg/@@images/image/teaser 600w',
      '/foo/bar.jpg/@@images/image/large 800w',
      '/foo/bar.jpg/@@images/image/great 1200w',
      '/foo/bar.jpg/@@images/image/huge 1600w',
    ];
    let isLocalResult;
    let isLocal = jest.fn(() => isLocalResult);
    test('true', () => {
      isLocalResult = true;
      const src = '/foo/bar.jpg';
      expect(makeSrcSet({ isLocal }).fromProps({ src }).srcSet).toEqual(result);
      expect(isLocal).toHaveBeenCalledWith(src);
    });
    test('false', () => {
      isLocalResult = false;
      const src = '/foo/bar.jpg';
      expect(makeSrcSet({ isLocal }).fromProps({ src }).srcSet).toEqual(
        undefined,
      );
      expect(isLocal).toHaveBeenCalledWith(src);
    });
    test('true with enabled=false', () => {
      isLocalResult = true;
      const src = '/foo/bar.jpg';
      expect(
        makeSrcSet({ isLocal, enabled: false }).fromProps({ src }).srcSet,
      ).toEqual(undefined);
      expect(isLocal).not.toHaveBeenCalled();
    });
  });

  describe('isLocal wrt src', () => {
    const result = '/foo/bar.jpg/@@images/image/huge';
    let isLocalResult;
    let isLocal = jest.fn(() => isLocalResult);
    test('true', () => {
      isLocalResult = true;
      const src = '/foo/bar.jpg';
      expect(
        makeSrcSet({ isLocal }).fromProps({ src, defaultScale: 'huge' }).src,
      ).toEqual(result);
      expect(isLocal).toHaveBeenCalledWith(src);
    });

    test('false wrt src', () => {
      isLocalResult = false;
      const src = '/foo/bar.jpg';
      expect(
        makeSrcSet({ isLocal }).fromProps({ src, defaultScale: 'huge' }).src,
      ).toEqual(undefined);
      expect(isLocal).toHaveBeenCalledWith(src);
    });
    test('true with enabled=false wrt src', () => {
      isLocalResult = true;
      const src = '/foo/bar.jpg';
      expect(
        makeSrcSet({ isLocal, enabled: false }).fromProps({ src }).srcSet,
      ).toEqual(undefined);
      expect(isLocal).not.toHaveBeenCalled();
    });
  });

  describe('preprocessSrc', () => {
    const result = [
      '/foo/bar.jpg/@@images/image/icon 32w',
      '/foo/bar.jpg/@@images/image/tile 64w',
      '/foo/bar.jpg/@@images/image/thumb 128w',
      '/foo/bar.jpg/@@images/image/mini 200w',
      '/foo/bar.jpg/@@images/image/preview 400w',
      '/foo/bar.jpg/@@images/image/teaser 600w',
      '/foo/bar.jpg/@@images/image/large 800w',
      '/foo/bar.jpg/@@images/image/great 1200w',
      '/foo/bar.jpg/@@images/image/huge 1600w',
    ];
    test('works', () => {
      const preprocessSrc = jest.fn((src) =>
        src.replace(/\/REMOVEME/, '').replace(/\/$/, ''),
      );
      expect(
        makeSrcSet({ preprocessSrc }).fromProps({
          src: '/foo/REMOVEME/bar.jpg',
        }).srcSet,
      ).toEqual(result);
      expect(preprocessSrc).toHaveBeenCalledTimes(1);
    });
  });

  describe('createScaledSrc', () => {
    const result = [
      '[/foo/bar.jpg-icon] 1032w',
      '[/foo/bar.jpg-tile] 1064w',
      '[/foo/bar.jpg-thumb] 1128w',
      '[/foo/bar.jpg-mini] 1200w',
      '[/foo/bar.jpg-preview] 1400w',
      '[/foo/bar.jpg-teaser] 1600w',
      '[/foo/bar.jpg-large] 1800w',
      '[/foo/bar.jpg-great] 2200w',
      '[/foo/bar.jpg-huge] 2600w',
    ];
    let createScaledSrc = jest.fn((src, scaleName, scaleData) => ({
      url: `[${src}-${scaleName}]`,
      width: scaleData + 1000,
    }));
    test('works for scrSet', () => {
      const src = '/foo/bar.jpg';
      expect(makeSrcSet({ createScaledSrc }).fromProps({ src }).srcSet).toEqual(
        result,
      );
      expect(createScaledSrc).toHaveBeenCalledTimes(result.length);
    });
    test('works for src', () => {
      const src = '/foo/bar.jpg';
      expect(
        makeSrcSet({ createScaledSrc }).fromProps({ src, defaultScale: 'huge' })
          .src,
      ).toEqual('[/foo/bar.jpg-huge]');
      expect(createScaledSrc).toHaveBeenCalledTimes(result.length + 1);
    });
  });

  describe('using full hint object', () => {
    test('works', () => {
      const src = '/foo/bar.jpg';
      const srcSetOptions = makeSrcSet({ minWidth: 1200 });
      const srcSetOptions2 = makeSrcSet(srcSetOptions);
      expect(srcSetOptions.fromProps({ src })).toEqual(
        srcSetOptions2.fromProps({ src }),
      );
      expect(srcSetOptions.options).toBe(srcSetOptions2.options);
    });
  });

  describe('always cleans extra properties', () => {
    let isLocal = jest.fn(() => false);
    test('not local', () => {
      const src = '/foo/bar.jpg';
      const result = makeSrcSet({ isLocal }).fromProps({ src });
      expect(result).toEqual({});
      expect('scales' in result);
      expect('defaultScale' in result);
    });
    test('not enabled', () => {
      const src = '/foo/bar.jpg';
      const result = makeSrcSet({ enabled: false }).fromProps({ src });
      expect(result).toEqual({});
      expect('scales' in result);
      expect('defaultScale' in result);
    });
    test('effective', () => {
      const src = '/foo/bar.jpg';
      const result = makeSrcSet({}).fromProps({ src });
      expect('scales' in result);
      expect('defaultScale' in result);
    });
  });
});
