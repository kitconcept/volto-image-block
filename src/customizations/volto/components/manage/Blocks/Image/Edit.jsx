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
import ImageWidget from '@kitconcept/volto-image-block/components/ImageWidget/ImageWidget';

import config from '@plone/volto/registry';
import Caption from '@kitconcept/volto-image-block/components/Caption/Caption';

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
    const { block, blocksConfig, data, onChangeBlock } = this.props;
    const Image = config.getComponent('Image').component;
    const dataAdapter = blocksConfig[data['@type']].dataAdapter;

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
            <Image
              loading="lazy"
              // TODO: Improve this, please
              src={
                data.image_scales
                  ? data
                  : `${flattenToAppURL(data.url)}/@@images/image`
              }
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
                  data.image_scales?.image[0].scales.fullscreen ||
                  data.image_scales?.image[0].download
                }`
              }
            />
          </figure>
        ) : (
          <ImageWidget
            {...this.props}
            inline
            // Since we are using a component that has a widget interface
            // we need to adapt its props to it
            id="url"
            onChange={(id, value, item) => {
              dataAdapter({
                block,
                data,
                id,
                item,
                onChangeBlock,
                value,
              });
            }}
          />
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
