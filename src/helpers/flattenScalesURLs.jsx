export function flattenScales(contentImage) {
  function flattenScalesURL(id, scale) {
    return scale.replace(`${id}/`, '');
  }

  let image;
  if (contentImage?.image) {
    image = {
      ...contentImage.image,
      download: flattenScalesURL(
        contentImage['@id'],
        contentImage.image.download,
      ),
    };

    Object.keys(contentImage.image.scales).forEach((key) => {
      image = {
        ...image,
        scales: {
          ...image.scales,
          [key]: {
            ...contentImage.image.scales[key],
            download: flattenScalesURL(
              contentImage['@id'],
              contentImage.image.scales[key].download,
            ),
          },
        },
      };
    });
  }

  return image;
}
