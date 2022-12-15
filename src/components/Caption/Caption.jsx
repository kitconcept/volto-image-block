/**
 * Image/video caption component.
 * @module components/Image/Caption
 */
import { defineMessages, useIntl } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import { UniversalLink } from '@plone/volto/components';

const messages = defineMessages({
  VideoLength: {
    id: 'VideoLength',
    defaultMessage: 'Duration: ',
  },
});

/**
 * Image/video caption component class.
 * @function Caption
 * @params {string} as HTML tag used to wrap the caption.
 * @params {string} title Image title.
 * @params {string} description Image description.
 * @params {object} imageNumber Image number.
 * @params {object} credit Credit rich text.
 * @params {bool} shows_people Image shows people.
 * @params {bool} downloadHref Show download link.
 * @returns {string} Markup of the component.
 */
const Caption = ({
  as = 'figcaption',
  title,
  description,
  imageNumber,
  credit,
  shows_people = true,
  downloadHref,
  downloadFilename,
  currentSlide,
  video_length,
}) => {
  const As = as;
  const intl = useIntl();

  const creditIsEmpty =
    !credit || credit.replace(/<[^>]*>?/gm, '').match(/^\s*$/);
  const renderedCredit = creditIsEmpty ? (
    shows_people ? (
      <UniversalLink
        tabIndex={currentSlide ? '0' : '-1'}
        href="/de/service/impressum"
      >
        &copy; DLR. Alle Rechte vorbehalten
      </UniversalLink>
    ) : (
      <UniversalLink
        tabIndex={currentSlide ? '0' : '-1'}
        href="/de/service/impressum"
      >
        DLR (CC BY-NC-ND 3.0)
      </UniversalLink>
    )
  ) : (
    <div
      dangerouslySetInnerHTML={{
        __html: currentSlide
          ? credit
          : credit.replace(/<a /, '<a tabindex="-1" '),
      }}
    />
  );
  return (
    <As>
      {title && <div className="title">{title}</div>}
      {description && (
        <div className="description">
          {description.split('\n').map((line, index) => (
            <div key={index}>{line || '\u00A0'}</div>
          ))}
        </div>
      )}
      <div className="credits">
        <div>
          {imageNumber}
          Credit: {renderedCredit}
        </div>
        {downloadHref && (
          <UniversalLink
            href={downloadHref}
            download={true}
            downloadFilename={downloadFilename}
            tabIndex={currentSlide ? '0' : '-1'}
          >
            Download
          </UniversalLink>
        )}
      </div>
      {video_length && (
        <div className="video-length">
          <div>
            {intl.formatMessage(messages.VideoLength)}
            {video_length}
          </div>
        </div>
      )}
    </As>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Caption.propTypes = {
  allow_image_download: PropTypes.bool,
  credit: PropTypes.string,
  shows_people: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Caption;
