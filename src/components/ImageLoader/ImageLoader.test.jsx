import React from 'react';
import { create, act } from 'react-test-renderer';
import ImageLoader from './ImageLoader';
import { describeAnyLoader, expectWrapper } from './AnyLoader.test';

describe('ImageLoader', () => {
  describeAnyLoader({
    Component: ImageLoader,
    expectComponent: (img, props) => {
      expect(img.type).toBe('img');
      for (const k in props) {
        expect(img.props[k]).toBe(props[k]);
      }
      expect('children' in img.props).toBe(false);
      expect(img.children).toBe(null);
    },
    // Skip tests that only make sense with a component
    // that reacts on the extra placeholder styles
    runPlaceholderExtraStyleTests: false,
  });

  const expectComponent = (img, props) => {
    expect(img.type).toBe('div');
    for (const k in props) {
      expect(img.props[k]).toBe(props[k]);
    }
    expect('children' in img.props).toBe(false);
  };

  test('loaded image can have children', () => {
    const component = create(
      <ImageLoader
        src="http://foo.bar/image"
        alt="DESCRIPTION"
        placeholder={
          <>
            <div foo1="bar1" />
            <div foo2="bar2" />
          </>
        }
      >
        <div foo3="bar3" />
        <div foo4="bar4" />
      </ImageLoader>,
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
    const children = img.children;
    expect(children.length).toBe(2);
    expect(children[0].props.foo3).toBe('bar3');
    expect(children[1].props.foo4).toBe('bar4');
    act(() => {
      img.props.onLoad();
    });
    const loaded = component.toJSON();
    expectComponent(loaded, {
      src: 'http://foo.bar/image',
      alt: 'DESCRIPTION',
    });
    const loadedChildren = loaded.children;
    expect(loadedChildren.length).toBe(2);
    expect(loadedChildren[0].props.foo3).toBe('bar3');
    expect(loadedChildren[1].props.foo4).toBe('bar4');
  });

  test('can update children', () => {
    const component = create(
      <ImageLoader
        src="http://foo.bar/image1"
        alt="DESCRIPTION1"
        placeholder={
          <>
            <div foo1="bar1" />
            <div foo2="bar2" />
          </>
        }
      >
        <div foo3="bar3" />
        <div foo4="bar4" />
      </ImageLoader>,
    );
    const loading = component.toJSON();
    expect(loading.length).toBe(3);
    const img = expectWrapper(loading[0]);
    expect(loading[1].props.foo1).toBe('bar1');
    expect(loading[2].props.foo2).toBe('bar2');
    expectComponent(img, {
      src: 'http://foo.bar/image1',
      alt: 'DESCRIPTION1',
    });
    const children = img.children;
    expect(children.length).toBe(2);
    expect(children[0].props.foo3).toBe('bar3');
    expect(children[1].props.foo4).toBe('bar4');
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
        <ImageLoader
          src="http://foo.bar/image2"
          alt="DESCRIPTION2"
          placeholder={
            <>
              <div foo1="bar1" />
              <div foo2="bar2" />
            </>
          }
        >
          <div foo5="bar5" />
          <div foo6="bar6" />
        </ImageLoader>,
      );
    });
    const updating = component.toJSON();
    expect(updating.length).toBe(2);
    const img2 = expectWrapper(updating[0]);
    const placeholderImg = updating[1];
    expectComponent(placeholderImg, {
      src: 'http://foo.bar/image1',
      alt: 'DESCRIPTION1',
    });
    const childrenP = placeholderImg.children;
    expect(childrenP.length).toBe(2);
    expect(childrenP[0].props.foo3).toBe('bar3');
    expect(childrenP[1].props.foo4).toBe('bar4');
    expectComponent(img2, {
      src: 'http://foo.bar/image2',
      alt: 'DESCRIPTION2',
    });
    const children2 = img2.children;
    expect(children2.length).toBe(2);
    expect(children2[0].props.foo5).toBe('bar5');
    expect(children2[1].props.foo6).toBe('bar6');
    act(() => {
      img2.props.onLoad();
    });
    const loaded2 = component.toJSON();
    expectComponent(loaded2, {
      src: 'http://foo.bar/image2',
      alt: 'DESCRIPTION2',
    });
    const childrenL2 = loaded2.children;
    expect(childrenL2.length).toBe(2);
    expect(childrenL2[0].props.foo5).toBe('bar5');
    expect(childrenL2[1].props.foo6).toBe('bar6');
  });
});
