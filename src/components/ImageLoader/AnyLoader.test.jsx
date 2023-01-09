import React from 'react';
import { create, act } from 'react-test-renderer';
import AnyLoader from './AnyLoader';

export const expectWrapper = (wrapper) => {
  expect(wrapper.props.style).toEqual({ position: 'relative' });
  expect(wrapper.children.length).toBe(1);
  expect(wrapper.children[0].props.style).toEqual({
    position: 'absolute',
    visibility: 'hidden',
  });
  const children = wrapper.children[0].children;
  expect(!children || children.length === 1).toBe(true);
  return children?.[0];
};

export const describeAnyLoader = ({
  Component,
  expectComponent,
  runPlaceholderExtraStyleTests = true,
}) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows placeholder, then shows loaded image', () => {
    const component = create(
      <Component
        src="http://foo.bar/image"
        alt="DESCRIPTION"
        placeholder={
          <>
            <div foo1="bar1" />
            <div foo2="bar2" />
          </>
        }
      ></Component>,
    );
    const loading = component.toJSON();
    expect(loading.length).toBe(3);
    const img = expectWrapper(loading[0]);
    expect(loading[1].props.foo1).toBe('bar1');
    expect(loading[2].props.foo2).toBe('bar2');
    expectComponent(img, {
      src: 'http://foo.bar/image',
      alt: 'DESCRIPTION',
    });
    act(() => {
      img.props.onLoad();
    });
    const loaded = component.toJSON();
    expectComponent(loaded, {
      src: 'http://foo.bar/image',
      alt: 'DESCRIPTION',
    });
  });

  test('shows placeholder single child, then shows loaded image', () => {
    const component = create(
      <Component
        src="http://foo.bar/image"
        alt="DESCRIPTION"
        placeholder={<div foo1="bar1" />}
      ></Component>,
    );
    const loading = component.toJSON();
    expect(loading.length).toBe(2);
    const img = expectWrapper(loading[0]);
    expect(loading[1].props.foo1).toBe('bar1');
    expectComponent(img, {
      src: 'http://foo.bar/image',
      alt: 'DESCRIPTION',
    });
    act(() => {
      img.props.onLoad();
    });
    const loaded = component.toJSON();
    expectComponent(loaded, {
      src: 'http://foo.bar/image',
      alt: 'DESCRIPTION',
    });
  });

  runPlaceholderExtraStyleTests &&
    test('shows loaded image if completed', () => {
      const component = create(
        <Component
          src="http://foo.bar/image"
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Component>,
        {
          createNodeMock: () => ({
            complete: true,
            naturalWidth: 800,
          }),
        },
      );
      act(() => {});
      const loaded = component.toJSON();
      expectComponent(loaded, {
        src: 'http://foo.bar/image',
        alt: 'DESCRIPTION',
      });
    });

  test('shows placeholder if image is completed with error', () => {
    const component = create(
      <Component
        src="http://foo.bar/image"
        alt="DESCRIPTION"
        placeholder={
          <>
            <div foo1="bar1" />
            <div foo2="bar2" />
          </>
        }
      ></Component>,
      {
        createNodeMock: () => ({
          complete: true,
          // naturalWidth will be 0 if the image is not loaded
          naturalWidth: 0,
        }),
      },
    );
    const loading = component.toJSON();
    expect(loading.length).toBe(3);
    const img = expectWrapper(loading[0]);
    expect(loading[1].props.foo1).toBe('bar1');
    expect(loading[2].props.foo2).toBe('bar2');
    expectComponent(img, {
      src: 'http://foo.bar/image',
      alt: 'DESCRIPTION',
    });
    act(() => {
      img.props.onLoad();
    });
    const loaded = component.toJSON();
    expectComponent(loaded, {
      src: 'http://foo.bar/image',
      alt: 'DESCRIPTION',
    });
  });

  describe('shows placeholder if src is missing', () => {
    const testWithSrc = (src) => {
      const component = create(
        <Component
          src={src}
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Component>,
      );
      const placeholder = component.toJSON();
      expect(placeholder.length).toBe(3);
      const img = expectWrapper(placeholder[0]);
      expect(placeholder[1].props.foo1).toBe('bar1');
      expect(placeholder[2].props.foo2).toBe('bar2');
      expect(img).toBe(undefined);
    };

    test('null string', () => {
      testWithSrc('');
    });

    test('null', () => {
      testWithSrc(null);
    });

    test('undefined or missing', () => {
      testWithSrc(undefined);
    });

    test('false', () => {
      testWithSrc(false);
    });
  });

  describe('no placeholder', () => {
    test('normal', () => {
      const component = create(
        <Component src="http://foo.bar/image" alt="DESCRIPTION"></Component>,
      );
      const img = component.toJSON();
      expectComponent(img, {
        src: 'http://foo.bar/image',
        alt: 'DESCRIPTION',
      });
    });

    test('without src renders null ', () => {
      const component = create(
        <Component src="" alt="DESCRIPTION"></Component>,
      );
      const img = component.toJSON();
      expect(img).toBe(null);
    });
  });

  describe('can update src', () => {
    test('from placeholder', () => {
      const component = create(
        <Component
          src=""
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Component>,
      );
      const placeholder = component.toJSON();
      expect(placeholder.length).toBe(3);
      const img0 = expectWrapper(placeholder[0]);
      expect(placeholder[1].props.foo1).toBe('bar1');
      expect(placeholder[2].props.foo2).toBe('bar2');
      expect(img0).toBe(undefined);
      act(() => {
        component.update(
          <Component
            src="http://foo.bar/image"
            alt="DESCRIPTION"
            placeholder={
              <>
                <div foo1="bar1" />
                <div foo2="bar2" />
              </>
            }
          ></Component>,
        );
      });
      const loading = component.toJSON();
      expect(loading.length).toBe(3);
      const img = expectWrapper(loading[0]);
      expect(loading[1].props.foo1).toBe('bar1');
      expect(loading[2].props.foo2).toBe('bar2');
      expect(img.props.src).toBe('http://foo.bar/image');
      expect(img.props.alt).toBe('DESCRIPTION');
      expect('children' in img.props).toBe(false);
      expect(img.children).toBe(null);
      act(() => {
        img.props.onLoad();
      });
      const loaded = component.toJSON();
      expectComponent(loaded, {
        src: 'http://foo.bar/image',
        alt: 'DESCRIPTION',
      });
    });

    test('from other src', () => {
      const component = create(
        <Component
          src="http://foo.bar/image1"
          alt="DESCRIPTION1"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Component>,
      );
      const loading = component.toJSON();
      expect(loading.length).toBe(3);
      const img = expectWrapper(loading[0]);
      expect(loading[1].props.foo1).toBe('bar1');
      expect(loading[2].props.foo2).toBe('bar2');
      expect(img.type).toBe('img');
      expect(img.props.src).toBe('http://foo.bar/image1');
      expect(img.props.alt).toBe('DESCRIPTION1');
      expect('children' in img.props).toBe(false);
      expect(img.children).toBe(null);
      act(() => {
        img.props.onLoad();
      });
      const loaded1 = component.toJSON();
      expectComponent(loaded1, {
        src: 'http://foo.bar/image1',
        alt: 'DESCRIPTION1',
      });
      act(() => {
        component.update(
          <Component
            src="http://foo.bar/image2"
            alt="DESCRIPTION2"
            placeholder={
              <>
                <div foo1="bar1" />
                <div foo2="bar2" />
              </>
            }
          ></Component>,
        );
      });
      const updating = component.toJSON();
      expect(updating.length).toBe(2);
      const img2 = expectWrapper(updating[0]);
      expect(updating[1].type).toBe('img');
      expect(updating[1].props.src).toBe('http://foo.bar/image1');
      expect(updating[1].props.alt).toBe('DESCRIPTION1');
      expect(img2.props.src).toBe('http://foo.bar/image2');
      expect(img2.props.alt).toBe('DESCRIPTION2');
      expect('children' in img2.props).toBe(false);
      expect(img2.children).toBe(null);
      act(() => {
        img2.props.onLoad();
      });
      const loaded2 = component.toJSON();
      expectComponent(loaded2, {
        src: 'http://foo.bar/image2',
        alt: 'DESCRIPTION2',
      });
    });
  });

  describe('can update other props than src', () => {
    test('from placeholder', () => {
      const component = create(
        <Component
          src=""
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Component>,
      );
      const placeholder = component.toJSON();
      expect(placeholder.length).toBe(3);
      const img = expectWrapper(placeholder[0]);
      expect(placeholder[1].props.foo1).toBe('bar1');
      expect(placeholder[2].props.foo2).toBe('bar2');
      expect(img).toBe(undefined);
      act(() => {
        component.update(
          <Component
            src=""
            alt="DESCRIPTION2"
            placeholder={
              <>
                <div foo1="bar1" />
                <div foo2="bar2" />
              </>
            }
          ></Component>,
        );
      });
      const placeholder2 = component.toJSON();
      expect(placeholder2.length).toBe(3);
      const img2 = expectWrapper(placeholder2[0]);
      expect(placeholder2[1].props.foo1).toBe('bar1');
      expect(placeholder2[2].props.foo2).toBe('bar2');
      expect(img2).toBe(undefined);
    });

    test('from other src', () => {
      const component = create(
        <Component
          src="http://foo.bar/image1"
          alt="DESCRIPTION1"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Component>,
      );
      const loading = component.toJSON();
      expect(loading.length).toBe(3);
      const img = expectWrapper(loading[0]);
      expect(loading[1].props.foo1).toBe('bar1');
      expect(loading[2].props.foo2).toBe('bar2');
      expect(img.type).toBe('img');
      expect(img.props.src).toBe('http://foo.bar/image1');
      expect(img.props.alt).toBe('DESCRIPTION1');
      expect('children' in img.props).toBe(false);
      expect(img.children).toBe(null);
      act(() => {
        img.props.onLoad();
      });
      const loaded1 = component.toJSON();
      expectComponent(loaded1, {
        src: 'http://foo.bar/image1',
        alt: 'DESCRIPTION1',
      });
      act(() => {
        component.update(
          <Component
            src="http://foo.bar/image1"
            alt="DESCRIPTION2"
            placeholder={
              <>
                <div foo1="bar1" />
                <div foo2="bar2" />
              </>
            }
          ></Component>,
        );
      });
      const loaded2 = component.toJSON();
      expectComponent(loaded2, {
        src: 'http://foo.bar/image1',
        alt: 'DESCRIPTION2',
      });
    });
  });

  describe('can update placeholder', () => {
    test('from placeholder, update becomes visible', () => {
      const component = create(
        <Component
          src=""
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Component>,
      );
      const placeholder = component.toJSON();
      expect(placeholder.length).toBe(3);
      const img = expectWrapper(placeholder[0]);
      expect(placeholder[1].props.foo1).toBe('bar1');
      expect(placeholder[2].props.foo2).toBe('bar2');
      expect(img).toBe(undefined);
      act(() => {
        component.update(
          <Component
            src=""
            alt="DESCRIPTION"
            placeholder={
              <>
                <div foo3="bar3" />
                <div foo4="bar4" />
              </>
            }
          ></Component>,
        );
      });
      const placeholder2 = component.toJSON();
      expect(placeholder2.length).toBe(3);
      const img2 = expectWrapper(placeholder2[0]);
      expect(placeholder2[1].props.foo3).toBe('bar3');
      expect(placeholder2[2].props.foo4).toBe('bar4');
      expect(img2).toBe(undefined);
    });

    test('from other src, no change', () => {
      const component = create(
        <Component
          src="http://foo.bar/image"
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Component>,
      );
      const loading = component.toJSON();
      expect(loading.length).toBe(3);
      const img = expectWrapper(loading[0]);
      expect(loading[1].props.foo1).toBe('bar1');
      expect(loading[2].props.foo2).toBe('bar2');
      expect(img.type).toBe('img');
      expect(img.props.src).toBe('http://foo.bar/image');
      expect(img.props.alt).toBe('DESCRIPTION');
      expect('children' in img.props).toBe(false);
      expect(img.children).toBe(null);
      act(() => {
        img.props.onLoad();
      });
      const loaded1 = component.toJSON();
      expectComponent(loaded1, {
        src: 'http://foo.bar/image',
        alt: 'DESCRIPTION',
      });
      act(() => {
        component.update(
          <Component
            src="http://foo.bar/image"
            alt="DESCRIPTION"
            placeholder={
              <>
                <div foo3="bar3" />
                <div foo4="bar4" />
              </>
            }
          ></Component>,
        );
      });
      const loaded2 = component.toJSON();
      expectComponent(loaded2, {
        src: 'http://foo.bar/image',
        alt: 'DESCRIPTION',
      });
    });
  });

  runPlaceholderExtraStyleTests &&
    describe('placeholder has placeholderExtraStyleRef', () => {
      let origGetComputedStyle;
      const mockGetComputedStyle = jest.fn(() => ({
        aspectRatio: '2 / 1',
        objectFit: 'cover',
        FOO: 'BAR',
      }));
      beforeEach(() => {
        origGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = mockGetComputedStyle;
      });
      afterEach(() => {
        window.getComputedStyle = origGetComputedStyle;
      });

      test('updates aspectRatio and objectFit from styles', () => {
        const mockPlaceholderExtraStyleRef = { current: {} };
        const component = create(
          <Component
            src="http://foo.bar/image"
            alt="DESCRIPTION"
            // Note style should be here or on the parent of this element,
            // but we mock it via getComputedStyle.
            // style={{
            //   aspectRatio: '2 / 1',
            //   objectFit: 'cover',
            // }}
            placeholder={
              <div placeholderExtraStyleRef={mockPlaceholderExtraStyleRef} />
            }
          ></Component>,
          {
            createNodeMock: (el) => el,
          },
        );
        const loading = component.toJSON();
        expect(loading.length).toBe(2);
        const img = expectWrapper(loading[0]);
        expect(loading[1].type).toBe('div');
        expect(loading[1].props.placeholderExtraStyleRef).toBe(
          mockPlaceholderExtraStyleRef,
        );
        expectComponent(img, {
          src: 'http://foo.bar/image',
          alt: 'DESCRIPTION',
        });
        act(() => {
          img.props.onLoad();
        });
        const loaded = component.toJSON();
        expectComponent(loaded, {
          src: 'http://foo.bar/image',
          alt: 'DESCRIPTION',
        });
        // Note we don't check what element mockGetComputedStyle was called
        // with, because the disability of react-test-lib to properly simulate refs.
        expect(mockGetComputedStyle).toBeCalledTimes(1);
        expect(mockPlaceholderExtraStyleRef.current).toEqual({
          aspectRatio: '2 / 1',
          objectFit: 'cover',
        });
      });

      test('skips update if aspectRatio is auto', () => {
        const mockGetComputedStyle = jest.fn(() => ({
          aspectRatio: 'auto',
          objectFit: 'cover',
          FOO: 'BAR',
        }));
        window.getComputedStyle = mockGetComputedStyle;
        const mockPlaceholderExtraStyleRef = { current: {} };
        const component = create(
          <Component
            src="http://foo.bar/image"
            alt="DESCRIPTION"
            // Note style should be here or on the parent of this element,
            // but we mock it via getComputedStyle.
            // style={{
            //   aspectRatio: 'auto',
            //   objectFit: 'cover',
            // }}
            placeholder={
              <div placeholderExtraStyleRef={mockPlaceholderExtraStyleRef} />
            }
          ></Component>,
        );
        const loading = component.toJSON();
        expect(loading.length).toBe(2);
        const img = expectWrapper(loading[0]);
        expect(loading[1].type).toBe('div');
        expect(loading[1].props.placeholderExtraStyleRef).toBe(
          mockPlaceholderExtraStyleRef,
        );
        expectComponent(img, {
          src: 'http://foo.bar/image',
          alt: 'DESCRIPTION',
        });
        act(() => {
          img.props.onLoad();
        });
        const loaded = component.toJSON();
        expectComponent(loaded, {
          src: 'http://foo.bar/image',
          alt: 'DESCRIPTION',
        });
        // Note we don't check what element mockGetComputedStyle was called
        // with, because the disability of react-test-lib to properly simulate refs.
        expect(mockGetComputedStyle).toBeCalledTimes(0);
        expect(mockPlaceholderExtraStyleRef.current).toEqual({});
      });

      test('skips update if aspectRatio starts with auto', () => {
        const mockGetComputedStyle = jest.fn(() => ({
          aspectRatio: 'auto 1440 / 960',
          objectFit: 'cover',
          FOO: 'BAR',
        }));
        window.getComputedStyle = mockGetComputedStyle;
        const mockPlaceholderExtraStyleRef = { current: {} };
        const component = create(
          <Component
            src="http://foo.bar/image"
            alt="DESCRIPTION"
            // Note style should be here or on the parent of this element,
            // but we mock it via getComputedStyle.
            // style={{
            //   aspectRatio: 'auto 1440 / 960',
            //   objectFit: 'cover',
            // }}
            placeholder={
              <div placeholderExtraStyleRef={mockPlaceholderExtraStyleRef} />
            }
          ></Component>,
        );
        const loading = component.toJSON();
        expect(loading.length).toBe(2);
        const img = expectWrapper(loading[0]);
        expect(loading[1].type).toBe('div');
        expect(loading[1].props.placeholderExtraStyleRef).toBe(
          mockPlaceholderExtraStyleRef,
        );
        expectComponent(img, {
          src: 'http://foo.bar/image',
          alt: 'DESCRIPTION',
        });
        act(() => {
          img.props.onLoad();
        });
        const loaded = component.toJSON();
        expectComponent(loaded, {
          src: 'http://foo.bar/image',
          alt: 'DESCRIPTION',
        });
        // Note we don't check what element mockGetComputedStyle was called
        // with, because the disability of react-test-lib to properly simulate refs.
        expect(mockGetComputedStyle).toBeCalledTimes(0);
        expect(mockPlaceholderExtraStyleRef.current).toEqual({});
      });

      test('skips update if placeholder already has aspectRatio', () => {
        const mockPlaceholderExtraStyleRef = { current: {} };
        const component = create(
          <Component
            src="http://foo.bar/image"
            alt="DESCRIPTION"
            // Note style should be here or on the parent of this element,
            // but we mock it via getComputedStyle.
            // style={{
            //   aspectRatio: '2 / 1',
            //   objectFit: 'cover',
            // }}
            placeholder={
              <div placeholderExtraStyleRef={mockPlaceholderExtraStyleRef} />
            }
          ></Component>,
        );
        const loading = component.toJSON();
        expect(loading.length).toBe(2);
        const img = expectWrapper(loading[0]);
        expect(loading[1].type).toBe('div');
        expect(loading[1].props.placeholderExtraStyleRef).toBe(
          mockPlaceholderExtraStyleRef,
        );
        expectComponent(img, {
          src: 'http://foo.bar/image',
          alt: 'DESCRIPTION',
        });
        act(() => {
          mockPlaceholderExtraStyleRef.current = { aspectRatio: '1.333 / 1' };
          img.props.onLoad();
        });
        const loaded = component.toJSON();
        expectComponent(loaded, {
          src: 'http://foo.bar/image',
          alt: 'DESCRIPTION',
        });
        // Note we don't check what element mockGetComputedStyle was called
        // with, because the disability of react-test-lib to properly simulate refs.
        expect(mockGetComputedStyle).toBeCalledTimes(0);
        expect(mockPlaceholderExtraStyleRef.current).toEqual({
          aspectRatio: '1.333 / 1',
        });
      });
    });
};

describe('AnyLoader', () => {
  describeAnyLoader({
    Component: (props) =>
      AnyLoader({
        ...props,
        createComponent: (props, children) =>
          React.createElement('img', props, children),
      }),
    expectComponent: (img, props) => {
      expect(img.type).toBe('img');
      for (const k in props) {
        expect(img.props[k]).toBe(props[k]);
      }
      expect('children' in img.props).toBe(false);
      expect(img.children).toBe(null);
    },
  });
});
