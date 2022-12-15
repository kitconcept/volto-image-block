export const ImageBlockDataAdapter = ({
  block,
  data,
  id,
  onChangeBlock,
  value,
}) => {
  const SIZEMAP = {
    l: 'large',
    m: 'medium',
    s: 'small',
  };

  let dataSaved = {
    ...data,
    [id]: value,
  };

  if (id === 'align' && !(value === 'left' || value === 'right')) {
    if (data.size !== 'l') {
      dataSaved = {
        ...dataSaved,
        size: 'l',
        styles: {
          ...dataSaved.styles,
          'size:noprefix': SIZEMAP['l'],
        },
      };
    }
  }

  if (id === 'size') {
    dataSaved = {
      ...dataSaved,
      styles: {
        ...dataSaved.styles,
        'size:noprefix': SIZEMAP[value],
      },
    };
  }

  onChangeBlock(block, dataSaved);
};
