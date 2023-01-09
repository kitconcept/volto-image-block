import React from 'react';
import { create } from 'react-test-renderer';
import ImgLoader from './ImgLoader';
import { describeAnyLoader } from './AnyLoader.test';

describe('ImgLoader', () => {
  describeAnyLoader({
    Component: ImgLoader,
    expectComponent: (img, props) => {
      expect(img.type).toBe('img');
      for (const k in props) {
        expect(img.props[k]).toBe(props[k]);
      }
      expect('children' in img.props).toBe(false);
      expect(img.children).toBe(null);
    },
  });

  test('Not allowed to have children', () => {
    spyOn(console, 'error');
    expect(() =>
      create(
        <ImgLoader
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
        </ImgLoader>,
      ),
    ).toThrow('Children are not allowed in <ImgLoader>');
  });
});
