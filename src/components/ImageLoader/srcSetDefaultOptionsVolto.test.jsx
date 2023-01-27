import srcSetDefaultOptionsVolto from './srcSetDefaultOptionsVolto';
import * as processors from './srcSetDefaultOptionsVolto';
import * as testData from './test-data';

jest.mock('@plone/volto/helpers', () => {
  return {
    __esModule: true,
    flattenToAppURL: jest.fn((url) =>
      url.replace(/http:\/\/localhost:3000/, ''),
    ),
    isInternalURL: jest.fn(
      (url) =>
        url.search(/http:\/\/localhost:3000/) !== -1 ||
        url.search(/http:\/\//) === -1,
    ),
  };
});

describe('srcSetDefaultOptionsVolto', () => {
  describe('blockDataSrc', () => {
    test('test', () => {
      expect(processors.blockDataSrc.test(testData.blockDataSample1)).toEqual(
        true,
      );
      expect(processors.blockDataSrc.test(testData.blockDataSample4)).toEqual(
        true,
      );
    });
    test('isLocal', () => {
      expect(srcSetDefaultOptionsVolto.isLocal(testData.blockDataSample1)).toBe(
        true,
      );
      expect(srcSetDefaultOptionsVolto.isLocal(testData.blockDataSample2)).toBe(
        true,
      );
      expect(srcSetDefaultOptionsVolto.isLocal(testData.blockDataSample3)).toBe(
        true,
      );
      expect(srcSetDefaultOptionsVolto.isLocal(testData.blockDataSample4)).toBe(
        true,
      );
      expect(
        processors.blockDataSrc.isLocal({ url: 'http://foo.bar/image.png' }),
      ).toBe(false);
    });
    test('preprocessSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.preprocessSrc(testData.blockDataSample1),
      ).toEqual({
        ...testData.blockDataSample1,
        __cache: {
          prefix: '/example/image-2',
        },
      });
      expect(
        srcSetDefaultOptionsVolto.preprocessSrc(testData.blockDataSample4),
      ).toEqual({
        ...testData.blockDataSample4,
        __cache: {
          prefix: '/example/image-2',
        },
      });
    });
    test('getScalesFromProps', () => {
      expect(
        srcSetDefaultOptionsVolto.getScalesFromProps({
          src: testData.blockDataSample1,
          scales: 'ANYTHING',
        }),
      ).toEqual({
        icon: {
          download: '@@images/image-32-d5575b5e0795407436104a16e18ebd41.jpeg',
          height: 17,
          width: 32,
        },
        large: {
          download: '@@images/image-800-9c8a61153197fca732c86aa1f2091cb3.jpeg',
          height: 449,
          width: 800,
        },
        larger: {
          download: '@@images/image-1000-36afc44f7c991c35735f3338e76bc0a7.jpeg',
          height: 562,
          width: 1000,
        },
        mini: {
          download: '@@images/image-200-6f2dd5c028b4fbf2c975d98f42077678.jpeg',
          height: 112,
          width: 200,
        },
        preview: {
          download: '@@images/image-400-4abbad67754c69a7af7a1b91d78e680e.jpeg',
          height: 224,
          width: 400,
        },
        teaser: {
          download: '@@images/image-600-705867124c8790a0fc7d4c799e506c2e.jpeg',
          height: 337,
          width: 600,
        },
        thumb: {
          download: '@@images/image-128-eebe3707668d4cd3752626c026191ca0.jpeg',
          height: 71,
          width: 128,
        },
        tile: {
          download: '@@images/image-64-0ea29ecf0ed3720e590d849dcbda5834.jpeg',
          height: 35,
          width: 64,
        },
      });
      expect(
        srcSetDefaultOptionsVolto.getScalesFromProps({
          src: testData.blockDataSample3,
          scales: 'ANYTHING',
        }),
      ).toEqual({
        icon: {
          download:
            '@@images/preview_image-32-55bf93d1a340ed478f81be2833a71993.jpeg',
          height: 32,
          width: 32,
        },
        large: {
          download:
            '@@images/preview_image-800-eb3aebd2b90ad5b03fcbdcef0be0beb5.jpeg',
          height: 800,
          width: 800,
        },
        larger: {
          download:
            '@@images/preview_image-1000-aa0b59eca1a9b588993187796d29e491.jpeg',
          height: 1000,
          width: 1000,
        },
        mini: {
          download:
            '@@images/preview_image-200-87345416346beb71801c3e0e6274125c.jpeg',
          height: 200,
          width: 200,
        },
        preview: {
          download:
            '@@images/preview_image-400-2df9d934007070e332dcb58d0d42be2f.jpeg',
          height: 400,
          width: 400,
        },
        teaser: {
          download:
            '@@images/preview_image-600-84157b40fce66bd541a0876f5534c125.jpeg',
          height: 600,
          width: 600,
        },
        thumb: {
          download:
            '@@images/preview_image-128-b0e482c9def76f77ef514904bc0a567b.jpeg',
          height: 128,
          width: 128,
        },
        tile: {
          download:
            '@@images/preview_image-64-0c3b9155a1112aaaf093e722f926fcb3.jpeg',
          height: 64,
          width: 64,
        },
      });
      expect(
        srcSetDefaultOptionsVolto.getScalesFromProps({
          src: testData.blockDataSample4,
          scales: 'ANYTHING',
        }),
      ).toEqual({
        icon: {
          download: '@@images/image-32-d5575b5e0795407436104a16e18ebd41.jpeg',
          height: 17,
          width: 32,
        },
        large: {
          download: '@@images/image-800-9c8a61153197fca732c86aa1f2091cb3.jpeg',
          height: 449,
          width: 800,
        },
        larger: {
          download: '@@images/image-1000-36afc44f7c991c35735f3338e76bc0a7.jpeg',
          height: 562,
          width: 1000,
        },
        mini: {
          download: '@@images/image-200-6f2dd5c028b4fbf2c975d98f42077678.jpeg',
          height: 112,
          width: 200,
        },
        preview: {
          download: '@@images/image-400-4abbad67754c69a7af7a1b91d78e680e.jpeg',
          height: 224,
          width: 400,
        },
        teaser: {
          download: '@@images/image-600-705867124c8790a0fc7d4c799e506c2e.jpeg',
          height: 337,
          width: 600,
        },
        thumb: {
          download: '@@images/image-128-eebe3707668d4cd3752626c026191ca0.jpeg',
          height: 71,
          width: 128,
        },
        tile: {
          download: '@@images/image-64-0ea29ecf0ed3720e590d849dcbda5834.jpeg',
          height: 35,
          width: 64,
        },
      });
    });
    describe('createScaledSrc', () => {
      const testCreateScaledSrc = (blockDataSample, result) => () => {
        expect(
          srcSetDefaultOptionsVolto.createScaledSrc(
            srcSetDefaultOptionsVolto.preprocessSrc(blockDataSample),
            'large',
            blockDataSample.image_scales[blockDataSample.image_field][0].scales
              .large,
          ),
        ).toEqual(result);
      };
      test(
        'blockDataSample1',
        testCreateScaledSrc(testData.blockDataSample1, {
          url:
            '/example/image-2/@@images/image-800-9c8a61153197fca732c86aa1f2091cb3.jpeg',
          width: 800,
        }),
      );
      test(
        'blockDataSample2 flattening',
        testCreateScaledSrc(testData.blockDataSample2, {
          url:
            '/example/image-2/@@images/image-800-9c8a61153197fca732c86aa1f2091cb3.jpeg',
          width: 800,
        }),
      );
      test(
        'blockDataSample3 teaser',
        testCreateScaledSrc(testData.blockDataSample3, {
          url:
            '/example/teaser-block/image/@@images/preview_image-800-eb3aebd2b90ad5b03fcbdcef0be0beb5.jpeg',
          width: 800,
        }),
      );
    });
    test('createNoDefaultScaleSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.createNoDefaultScaleSrc(
          testData.blockDataSample1,
        ),
      ).toBe(
        '/example/image-2/@@images/image-1126-7bb80db0a452739fa96a97d3c6517495.jpeg',
      );
      expect(
        srcSetDefaultOptionsVolto.createNoDefaultScaleSrc(
          testData.blockDataSample3,
        ),
      ).toBe(
        '/example/teaser-block/image/@@images/preview_image-1126-1a01db87b603934db947bb1d72a06ed8.jpeg',
      );
      expect(
        srcSetDefaultOptionsVolto.createNoDefaultScaleSrc(
          testData.blockDataSample4,
        ),
      ).toBe(
        '/example/image-2/@@images/image-1126-7bb80db0a452739fa96a97d3c6517495.jpeg',
      );
    });
  });
  describe('contentDataSrc', () => {
    test('test', () => {
      expect(processors.blockDataSrc.test(testData.contentDataSample1)).toEqual(
        false,
      );
      expect(
        processors.contentDataSrc.test(testData.contentDataSample1),
      ).toEqual(true);
    });
    test('isLocal', () => {
      expect(
        srcSetDefaultOptionsVolto.isLocal(testData.contentDataSample1),
      ).toBe(true);
      expect(
        processors.contentDataSrc.isLocal({
          download: 'http://foo.bar/image.png',
        }),
      ).toBe(false);
    });
    test('preprocessSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.preprocessSrc(testData.contentDataSample1),
      ).toBe(testData.contentDataSample1);
    });
    test('getScalesFromProps', () => {
      expect(
        srcSetDefaultOptionsVolto.getScalesFromProps({
          src: testData.contentDataSample1,
          scales: 'ANYTHING',
        }),
      ).toEqual({
        great: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-1200-79d8298ba97bbcac8957f2313a4f8739.png',
          height: 263,
          width: 1200,
        },
        huge: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-1600-36844277b711713c66c7c77f6eafa2bf.png',
          height: 351,
          width: 1600,
        },
        icon: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-32-471419cba465f6bf008e71a2a6597a40.png',
          height: 7,
          width: 32,
        },
        large: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-800-00b242dbee2491cdd98180ee7d0a4fe8.png',
          height: 175,
          width: 800,
        },
        larger: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-1000-39bec9ae81852eede0f930c9aced869b.png',
          height: 219,
          width: 1000,
        },
        mini: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-200-010a606b0d76b6a6e089e8ba466dedca.png',
          height: 43,
          width: 200,
        },
        preview: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-400-1766720795b7f683a5d9c9672b9fb259.png',
          height: 87,
          width: 400,
        },
        teaser: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-600-85dc73d6512c05dad7f2ad0bab8c256d.png',
          height: 131,
          width: 600,
        },
        thumb: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-128-b60c381eeb9c02111b3b8d5b82e4fcd8.png',
          height: 28,
          width: 128,
        },
        tile: {
          download:
            'http://localhost:3000/images/plone-foundation.png/@@images/image-64-b45e38d323633ae920af93e7e7e24656.png',
          height: 14,
          width: 64,
        },
      });
    });
    test('createScaledSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.createScaledSrc(
          srcSetDefaultOptionsVolto.preprocessSrc(testData.contentDataSample1),
          'large',
          testData.contentDataSample1.scales.large,
        ),
      ).toEqual({
        url:
          '/images/plone-foundation.png/@@images/image-800-00b242dbee2491cdd98180ee7d0a4fe8.png',
        width: 800,
      });
    });
    test('createNoDefaultScaleSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.createNoDefaultScaleSrc(
          testData.contentDataSample1,
        ),
      ).toBe(
        '/images/plone-foundation.png/@@images/image-2000-9d895f5dd2600938c123550e14965f08.png',
      );
    });
  });
  describe('stringSrc', () => {
    test('test', () => {
      expect(processors.blockDataSrc.test(testData.stringSample1)).toEqual(
        false,
      );
      expect(processors.contentDataSrc.test(testData.stringSample1)).toEqual(
        false,
      );
      expect(processors.stringSrc.test(testData.stringSample1)).toEqual(true);
    });
    test('isLocal', () => {
      expect(srcSetDefaultOptionsVolto.isLocal(testData.stringSample1)).toBe(
        true,
      );
      expect(processors.stringSrc.isLocal('http://foo.bar/image.png')).toBe(
        false,
      );
    });
    test('preprocessSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.preprocessSrc(testData.stringSample1),
      ).toBe('');
    });
    test('getScalesFromProps', () => {
      expect(
        srcSetDefaultOptionsVolto.getScalesFromProps({
          src: testData.stringSample1,
          scales: '{DATA}',
        }),
      ).toEqual('{DATA}');
    });
    test('createScaledSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.createScaledSrc(
          srcSetDefaultOptionsVolto.preprocessSrc(testData.stringSample1),
          'large',
          800,
        ),
      ).toEqual({
        url: '/@@images/image/large',
        width: 800,
      });
    });
    test('createNoDefaultScaleSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.createNoDefaultScaleSrc(
          testData.stringSample1,
        ),
      ).toBe(undefined);
    });
  });
  describe('missingSrc', () => {
    test('test', () => {
      expect(processors.blockDataSrc.test(undefined)).toEqual(false);
      expect(processors.contentDataSrc.test(undefined)).toEqual(false);
      expect(processors.stringSrc.test(undefined)).toEqual(false);
      expect(processors.missingSrc.test(undefined)).toEqual(true);
    });
    test('isLocal', () => {
      expect(srcSetDefaultOptionsVolto.isLocal(undefined)).toBe(false);
    });
    test('preprocessSrc', () => {
      expect(srcSetDefaultOptionsVolto.preprocessSrc(undefined)).toBe(
        undefined,
      );
    });
    test('getScalesFromProps', () => {
      expect(
        srcSetDefaultOptionsVolto.getScalesFromProps({
          src: undefined,
          scales: '{DATA}',
        }),
      ).toEqual('{DATA}');
    });
    test('createNoDefaultScaleSrc', () => {
      expect(
        srcSetDefaultOptionsVolto.createNoDefaultScaleSrc(
          testData.missingSample1,
        ),
      ).toBe(undefined);
    });
  });
});
