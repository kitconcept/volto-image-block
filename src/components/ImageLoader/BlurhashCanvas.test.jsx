import React from 'react';
import { create, act } from 'react-test-renderer';
import BlurhashCanvas from './BlurhashCanvas';
import { decode } from 'blurhash';

let mockDecodeResult;
jest.mock('blurhash', () => {
  return {
    __esModule: true,
    decode: jest.fn((hash, width, punch) => mockDecodeResult),
  };
});

let mockImageData = { data: { set: jest.fn(() => {}) } };
let mockContext = {
  createImageData: jest.fn(() => mockImageData),
  putImageData: jest.fn(() => {}),
};
let mockCanvas = {
  getContext: jest.fn(() => mockContext),
  style: {},
};

let mockResizeHandler;
let mockResizeObserver = jest.fn((handler) => {
  mockResizeHandler = handler;
  return {
    observe: jest.fn(() => {}),
    unobserve: jest.fn(() => {}),
  };
});

describe('BlurhashCanvas', () => {
  let origResizeObserver;
  beforeEach(() => {
    jest.clearAllMocks();
    origResizeObserver = window.ResizeObserver;
    window.ResizeObserver = mockResizeObserver;
  });
  afterEach(() => {
    jest.clearAllMocks();
    window.ResizeObserver = origResizeObserver;
  });

  describe('renders', () => {
    describe('as img on server', () => {
      test('normal', () => {
        let component;
        mockDecodeResult = 'PIXELS';
        act(() => {
          component = create(
            <BlurhashCanvas hash="HASH" ratio={2} punch={1} width={32} />,
            // There is no ref on the server.
          );
        });
        const img = component.toJSON();
        expect(img.type).toBe('img');
        expect(img.children).toBe(null);
        const props = img.props;
        expect(typeof props.src).toBe('string');
        expect(props.alt).toBe('');
        // important marker used by fast-blurhash.js
        expect(props.className).toBe('blurhash');
        expect(props.data).toEqual(
          '{"hash":"HASH","punch":1,"ratio":2,"width":32,"height":16}',
        );
        expect(props.style).toEqual({});
      });

      test('with imgClass, imgStyle', () => {
        let component;
        mockDecodeResult = 'PIXELS';
        act(() => {
          component = create(
            <BlurhashCanvas
              hash="HASH"
              ratio={2}
              punch={1}
              width={32}
              imgClass="IMG-CLASS"
              imgStyle={{ width: '100%' }}
            />,
            // There is no ref on the server.
          );
        });
        const img = component.toJSON();
        expect(img.type).toBe('img');
        expect(img.children).toBe(null);
        const props = img.props;
        expect(typeof props.src).toBe('string');
        expect(props.alt).toBe('');
        // important marker used by fast-blurhash.js
        expect(props.className).toBe('IMG-CLASS blurhash');
        expect(props.style).toEqual({ width: '100%' });
        expect(props.data).toEqual(
          '{"hash":"HASH","punch":1,"ratio":2,"width":32,"height":16}',
        );
      });
    });

    test('with imgWidth, imgHeight', () => {
      let component;
      mockDecodeResult = 'PIXELS';
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={2}
            punch={1}
            width={32}
            imgWidth="1440"
            imgHeight="810"
          />,
          // There is no ref on the server.
        );
      });
      const img = component.toJSON();
      expect(img.type).toBe('img');
      expect(img.children).toBe(null);
      const props = img.props;
      expect(typeof props.src).toBe('string');
      expect(props.alt).toBe('');
      expect(props.width).toBe('1440');
      expect(props.height).toBe('810');
      expect(props.data).toEqual(
        '{"hash":"HASH","punch":1,"ratio":2,"width":32,"height":16,"imgWidth":"1440px"}',
      );
    });

    describe('renders as canvas', () => {
      test('normal', () => {
        let component;
        mockDecodeResult = 'PIXELS';
        mockCanvas.offsetWidth = 100;
        act(() => {
          component = create(
            <BlurhashCanvas hash="HASH" ratio={2} punch={1} width={32} />,
            // The appearance of the ref turns it into a real canvas.
            { createNodeMock: () => mockCanvas },
          );
        });
        const canvas = component.toJSON();
        expect(canvas.type).toBe('canvas');
        expect(canvas.children).toBe(null);
        const props = canvas.props;
        expect(props.height).toBe(16);
        expect(props.width).toBe(32);
        expect(props.style).toEqual({ height: 50 });
      });
    });

    test('with imgClass, imgStyle', () => {
      let component;
      mockDecodeResult = 'PIXELS';
      mockCanvas.offsetWidth = 100;
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={2}
            punch={1}
            width={32}
            imgClass="IMG-CLASS"
            imgStyle={{ width: '100%' }}
          />,
          // The appearance of the ref turns it into a real canvas.
          { createNodeMock: () => mockCanvas },
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      const props = canvas.props;
      expect(props.height).toBe(16);
      expect(props.width).toBe(32);
      expect(props.style).toEqual({ height: 50 });
      expect(props.className).toBe(undefined);
    });
  });

  test('canvas paint ignored on server', () => {
    let component;
    mockDecodeResult = 'PIXELS';
    act(() => {
      component = create(
        <BlurhashCanvas hash="HASH" ratio={2} punch={1} width={32} />,
      );
    });
    const canvas = component.toJSON();
    expect(canvas.type).toBe('img');
    expect(canvas.children).toBe(null);
    expect(decode).not.toHaveBeenCalled();
    expect(mockImageData.data.set).not.toHaveBeenCalled();
    expect(mockContext.putImageData).not.toHaveBeenCalled();
  });

  describe('paints canvas on client', () => {
    beforeEach(() => {
      // canvas already visible
      mockCanvas.offsetWidth = 100;
    });
    test('initially', () => {
      let component;
      mockDecodeResult = 'PIXELS';
      act(() => {
        component = create(
          <BlurhashCanvas hash="HASH" ratio={2} punch={1} width={32} />,
          { createNodeMock: () => mockCanvas },
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      expect(decode).toBeCalledWith('HASH', 32, 16, 1);
      expect(mockImageData.data.set).toBeCalledWith('PIXELS');
      expect(mockContext.putImageData).toBeCalledWith(mockImageData, 0, 0);
    });

    test('when hash changes', () => {
      let component;
      mockDecodeResult = 'PIXELS';
      act(() => {
        component = create(
          <BlurhashCanvas hash="HASH" ratio={2} punch={1} width={32} />,
          { createNodeMock: () => mockCanvas },
        );
      });
      mockDecodeResult = 'NEWPIXELS';
      act(() => {
        component.update(
          <BlurhashCanvas hash="NEWHASH" ratio={2} punch={1} width={32} />,
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      const props = canvas.props;
      expect(props.height).toBe(16);
      expect(props.width).toBe(32);
      expect(decode).toBeCalledWith('NEWHASH', 32, 16, 1);
      expect(mockImageData.data.set).toBeCalledWith('NEWPIXELS');
      expect(mockContext.putImageData).toBeCalledWith(mockImageData, 0, 0);
    });

    test('accepts placeholderExtraStyleRef', () => {
      let component;
      mockDecodeResult = 'PIXELS';
      const mockPlaceholderExtraStyleRef = { current: {} };
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={2}
            punch={1}
            width={32}
            placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
          />,
          {
            createNodeMock: (el) => mockCanvas,
          },
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      const props = canvas.props;
      expect(props.height).toBe(16);
      expect(props.width).toBe(32);
      // Nothing to check here.
      expect(mockPlaceholderExtraStyleRef.current).toEqual({});
    });
  });

  describe('sets height', () => {
    test('initially', () => {
      let component;
      mockCanvas.offsetWidth = 100;
      const mockPlaceholderExtraStyleRef = { current: {} };
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={2}
            punch={1}
            width={32}
            placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
          />,
          { createNodeMock: () => mockCanvas },
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      expect(canvas.props.style.height).toBe(50);
    });

    describe('sets width from imgWidth', () => {
      test('without style', () => {
        let component;
        mockCanvas.offsetWidth = 100;
        const mockPlaceholderExtraStyleRef = { current: {} };
        act(() => {
          component = create(
            <BlurhashCanvas
              hash="HASH"
              ratio={2}
              punch={1}
              width={32}
              imgWidth={140}
              placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
            />,
            { createNodeMock: () => mockCanvas },
          );
        });
        const canvas = component.toJSON();
        expect(canvas.type).toBe('canvas');
        expect(canvas.children).toBe(null);
        expect(canvas.props.style.width).toBe(140);
      });

      test('with style ignored', () => {
        let component;
        mockCanvas.offsetWidth = 100;
        const mockPlaceholderExtraStyleRef = { current: {} };
        act(() => {
          component = create(
            <BlurhashCanvas
              hash="HASH"
              ratio={2}
              punch={1}
              width={32}
              imgWidth={140}
              style={{ width: '100%' }}
              placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
            />,
            { createNodeMock: () => mockCanvas },
          );
        });
        const canvas = component.toJSON();
        expect(canvas.type).toBe('canvas');
        expect(canvas.children).toBe(null);
        expect(canvas.props.style.width).toBe('100%');
      });

      test('accepts string as imgWidth', () => {
        let component;
        mockCanvas.offsetWidth = 100;
        const mockPlaceholderExtraStyleRef = { current: {} };
        act(() => {
          component = create(
            <BlurhashCanvas
              hash="HASH"
              ratio={2}
              punch={1}
              width={32}
              imgWidth={'140'}
              placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
            />,
            { createNodeMock: () => mockCanvas },
          );
        });
        const canvas = component.toJSON();
        expect(canvas.type).toBe('canvas');
        expect(canvas.children).toBe(null);
        expect(canvas.props.style.width).toBe('140px');
      });

      test('accepts pixels as imgWidth', () => {
        let component;
        mockCanvas.offsetWidth = 100;
        const mockPlaceholderExtraStyleRef = { current: {} };
        act(() => {
          component = create(
            <BlurhashCanvas
              hash="HASH"
              ratio={2}
              punch={1}
              width={32}
              imgWidth={'140px'}
              placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
            />,
            { createNodeMock: () => mockCanvas },
          );
        });
        const canvas = component.toJSON();
        expect(canvas.type).toBe('canvas');
        expect(canvas.children).toBe(null);
        expect(canvas.props.style.width).toBe('140px');
      });
    });

    test('updates', () => {
      let component;
      mockCanvas.offsetWidth = 100;
      const mockPlaceholderExtraStyleRef = { current: {} };
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={2}
            punch={1}
            width={32}
            placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
          />,
          { createNodeMock: () => mockCanvas },
        );
      });
      mockCanvas.offsetWidth = 200;
      act(() => {
        mockResizeHandler();
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      expect(canvas.props.style.height).toBe(100);
    });

    test('does not update with zero offset width', () => {
      let component;
      mockCanvas.offsetWidth = 100;
      const mockPlaceholderExtraStyleRef = { current: {} };
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={0.5}
            punch={1}
            width={32}
            placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
          />,
          { createNodeMock: () => mockCanvas },
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      expect(canvas.props.height).toBe(64);
      expect(canvas.props.width).toBe(32);
      // change offset to 0 should not update
      mockCanvas.offsetWidth = 0;
      act(() => {
        mockResizeHandler();
      });
      const canvas2 = component.toJSON();
      expect(canvas2.type).toBe('canvas');
      expect(canvas2.children).toBe(null);
      expect(canvas2.props.style.height).toBe(200);
    });
  });

  describe('ignores height with aspectRatio', () => {
    test('initially', () => {
      let component;
      mockCanvas.offsetWidth = 100;
      const mockPlaceholderExtraStyleRef = {
        current: { aspectRatio: '2 / 1' },
      };
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={2}
            punch={1}
            width={32}
            placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
          />,
          { createNodeMock: () => mockCanvas },
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      expect(canvas.props.style.height).toBe('auto');
    });

    test('updates', () => {
      let component;
      mockCanvas.offsetWidth = 100;
      const mockPlaceholderExtraStyleRef = {
        current: { aspectRatio: '2 / 1' },
      };
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={2}
            punch={1}
            width={32}
            placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
          />,
          { createNodeMock: () => mockCanvas },
        );
      });
      mockCanvas.offsetWidth = 200;
      mockCanvas.style.aspectRatio = '2 / 1';
      act(() => {
        mockResizeHandler();
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      expect(canvas.props.style.height).toBe('auto');
    });
  });

  describe('sets canvas height from aspect ratio', () => {
    test('with some ratio', () => {
      let component;
      mockCanvas.offsetWidth = 100;
      const mockPlaceholderExtraStyleRef = { current: {} };
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={0.5}
            punch={1}
            width={32}
            placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
          />,
          { createNodeMock: () => mockCanvas },
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      expect(canvas.props.height).toBe(64);
      expect(canvas.props.width).toBe(32);
    });

    test('with some other ratio', () => {
      let component;
      mockCanvas.offsetWidth = 100;
      const mockPlaceholderExtraStyleRef = { current: {} };
      act(() => {
        component = create(
          <BlurhashCanvas
            hash="HASH"
            ratio={4}
            punch={1}
            width={32}
            placeholderExtraStyleRef={mockPlaceholderExtraStyleRef}
          />,
          { createNodeMock: () => mockCanvas },
        );
      });
      const canvas = component.toJSON();
      expect(canvas.type).toBe('canvas');
      expect(canvas.children).toBe(null);
      expect(canvas.props.height).toBe(8);
      expect(canvas.props.width).toBe(32);
    });
  });
});
