import React from 'react';
import { create, act } from 'react-test-renderer';
import Img from './Img';
import { describeAnyLoader, expectWrapper } from './AnyLoader.test';
import config from '@plone/volto/registry';
import makeSrcSet from './makeSrcSet';

describe('Img', () => {
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

  const expectComponent = (img, props) => {
    expect(img.type).toBe('img');
    for (const k in props) {
      expect(img.props[k]).toEqual(props[k]);
    }
  };

  describeAnyLoader({
    Component: Img,
    expectComponent,
  });

  test('Not allowed to have children', () => {
    spyOn(console, 'error');
    expect(() =>
      create(
        <Img
          src="http://foo.bar/image"
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        >
          <div fooC="barC" />
        </Img>,
      ),
    ).toThrow('Children are not allowed in <Img>');
  });

  describe('renders srcSet', () => {
    test('from options', () => {
      const component = create(
        <Img
          src="http://foo.bar/image"
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
          srcSetOptions={{
            minWidth: 600,
            maxWidth: 800,
          }}
        ></Img>,
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
        srcSet: [
          'http://foo.bar/image/@@images/image/teaser 600w',
          'http://foo.bar/image/@@images/image/large 800w',
        ],
      });
    });

    test('from object', () => {
      const srcSetOptions = makeSrcSet({
        minWidth: 600,
        maxWidth: 800,
      });
      const component = create(
        <Img
          src="http://foo.bar/image"
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
          srcSetOptions={srcSetOptions}
        ></Img>,
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
        srcSet: [
          'http://foo.bar/image/@@images/image/teaser 600w',
          'http://foo.bar/image/@@images/image/large 800w',
        ],
      });
    });

    test('from default', () => {
      const component = create(
        <Img
          src="http://foo.bar/image"
          alt="DESCRIPTION"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        ></Img>,
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
        srcSet: [
          'http://foo.bar/image/@@images/image/icon 32w',
          'http://foo.bar/image/@@images/image/tile 64w',
          'http://foo.bar/image/@@images/image/thumb 128w',
          'http://foo.bar/image/@@images/image/mini 200w',
          'http://foo.bar/image/@@images/image/preview 400w',
          'http://foo.bar/image/@@images/image/teaser 600w',
          'http://foo.bar/image/@@images/image/large 800w',
          'http://foo.bar/image/@@images/image/great 1200w',
          'http://foo.bar/image/@@images/image/huge 1600w',
        ],
      });
    });
  });
});
