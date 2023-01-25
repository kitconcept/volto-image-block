/**
 * View image block.
 * @module components/manage/Blocks/Image/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { flattenToAppURL } from '@plone/volto/helpers';
import { MaybeWrap, UniversalLink } from '@plone/volto/components';

import config from '@plone/volto/registry';
import Caption from '@kitconcept/volto-image-block/components/Caption/Caption';

/**
 * View image block class.
 * @class View
 * @extends Component
 */
const ImageBlockView = ({ data, detached, className, isEditMode }) => {
  let href;
  if (data.href?.length > 0) {
    if (typeof data.href === 'object') {
      href = data.href[0]['@id'];
    } else if (typeof data.href === 'string') {
      // just to catch cases where a string might be supplied
      href = data.href;
    }
  }

  const Image = config.getComponent('Image').component;

  return (
    <div className={cx('block image align', data.align, className)}>
      {data.url && (
        <>
          <MaybeWrap
            condition={href && !isEditMode}
            as={UniversalLink}
            href={href}
            openLinkInNewTab={data.openLinkInNewTab}
            target={data.openLinkInNewTab ? '_blank' : null}
          >
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
              <Image
                loading="lazy"
                src={data}
                width="1440"
                height="810"
                alt={data.alt || ''}
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
                    data.image_scales?.image[0].scales?.fullscreen?.download ||
                    data.image_scales?.image[0].download
                  }`
                }
              />
            </figure>
          </MaybeWrap>
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
