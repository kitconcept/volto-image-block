/**
 * Edit image block.
 * @module components/manage/Blocks/Image/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import { isEqual } from 'lodash';

import { ImageSidebar, SidebarPortal } from '@plone/volto/components';
import { createContent } from '@plone/volto/actions';
import { flattenToAppURL, withBlockExtensions } from '@plone/volto/helpers';
import ImageWidget from '@kitconcept/volto-image/components/ImageWidget/ImageWidget';

import config from '@plone/volto/registry';
import Caption from '@kitconcept/volto-image/components/Caption/Caption';

/**
 * Edit image block class.
 * @class Edit
 * @extends Component
 */
class ImageEdit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    content: PropTypes.objectOf(PropTypes.any).isRequired,
    request: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    createContent: PropTypes.func.isRequired,
    openObjectBrowser: PropTypes.func.isRequired,
  };

  /**
   * @param {*} nextProps
   * @returns {boolean}
   * @memberof Edit
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.selected ||
      nextProps.selected ||
      !isEqual(this.props.data, nextProps.data)
    );
  }

  /**
   * Align block handler
   * @method onAlignBlock
   * @param {string} align Alignment option
   * @returns {undefined}
   */
  onAlignBlock(align) {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      align,
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { data } = this.props;
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
    return (
      <div
        className={cx(
          'block image align',
          {
            center: !Boolean(data.align),
          },
          data.align,
        )}
      >
        {data.url ? (
          <figure
            className={cx(
              'figure',
              {
                center: !Boolean(data.align),
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
                  data.image_scales?.image[0].scales.fullscreen ||
                  data.image_scales?.image[0].download
                }`
              }
            />
          </figure>
        ) : (
          <ImageWidget {...this.props} />
        )}
        <SidebarPortal selected={this.props.selected}>
          <ImageSidebar {...this.props} />
        </SidebarPortal>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withBlockExtensions,
  connect(
    (state, ownProps) => ({
      request: state.content.subrequests[ownProps.block] || {},
      content: state.content.subrequests[ownProps.block]?.data,
    }),
    { createContent },
  ),
)(ImageEdit);
