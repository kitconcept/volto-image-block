/**
 * View image block.
 * @module components/manage/Blocks/Image/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { flattenToAppURL } from '@plone/volto/helpers';
import { UniversalLink } from '@plone/volto/components';

import config from '@plone/volto/registry';
import Caption from '@kitconcept/volto-image/components/Caption/Caption';

/**
 * View image block class.
 * @class View
 * @extends Component
 */
const ImageBlockView = ({ data, detached, className }) => {
  let href;
  if (data.href?.length > 0) {
    if (typeof data.href === 'object') {
      href = data.href[0]['@id'];
    } else if (typeof data.href === 'string') {
      // just to catch cases where a string might be supplied
      href = data.href;
    }
  }

  return (
    <div className={cx('block image align', data.align, className)}>
      {data.url && (
        <>
          {(() => {
            const Img = config.getComponent('Img').component;
            // Note defaultScale will be deprecated from Img component
            // Since we have srcset, it has no importance other than
            // the original image should never be used.
            const defaultScale =
              data.align === 'full'
                ? 'fullscreen'
                : data.size === 'l'
                ? 'huge'
                : data.size === 'm'
                ? 'preview'
                : data.size === 's'
                ? 'mini'
                : 'huge';
            const image = (
              <figure
                className={cx(
                  'figure',
                  {
                    center: !Boolean(data.align),
                    detached,
                  },
                  data.align,
                  {
                    // START CUSTOMIZATION
                    // 'full-width': data.align === 'full',
                    // END CUSTOMIZATION
                    large: data.size === 'l',
                    medium: data.size === 'm' || !data.size,
                    small: data.size === 's',
                  },
                )}
              >
                <Img
                  loading="lazy"
                  src={data.url}
                  width="1440"
                  height="810"
                  alt={data.alt || ''}
                  defaultScale={defaultScale}
                  scales={data.image_scales?.image?.[0]?.scales}
                  blurhash={data.image_scales?.image?.[0]?.blurhash}
                />
                <Caption
                  title={data.title}
                  description={data.description}
                  credit={data.credit?.data}
                  downloadFilename={data.title}
                  downloadHref={
                    data.allow_image_download &&
                    `${flattenToAppURL(data.url)}/${
                      data.image_scales?.image[0].scales?.fullscreen
                        ?.download || data.image_scales?.image[0].download
                    }`
                  }
                />
              </figure>
            );

            if (href) {
              return (
                <UniversalLink
                  openLinkInNewTab={data.openLinkInNewTab}
                  href={href}
                >
                  {image}
                </UniversalLink>
              );
            } else {
              return image;
            }
          })()}
        </>
      )}
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ImageBlockView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ImageBlockView;
