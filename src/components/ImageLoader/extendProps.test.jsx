import extendProps from './extendProps';

describe('extendProps', () => {
  test('works', () => {
    expect(extendProps({ a: 1, b: 2 }, { b: 22, c: 3 })).toEqual({
      a: 1,
      b: 22,
      c: 3,
    });
  });

  test('ignores undefined', () => {
    expect(extendProps({ a: 1, b: 2 }, { c: undefined })).toEqual({
      a: 1,
      b: 2,
    });
  });

  test('deletes undefined', () => {
    expect(extendProps({ a: 1, b: 2 }, { b: undefined, c: 3 })).toEqual({
      a: 1,
      c: 3,
    });
  });
});
