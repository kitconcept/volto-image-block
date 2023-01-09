const extendProps = (o1, o2) => {
  const result = { ...o1 };
  Object.keys(o2).forEach((k) => {
    const v = o2[k];
    if (v !== undefined) {
      result[k] = v;
    } else {
      delete result[k];
    }
  });
  return result;
};
export default extendProps;
