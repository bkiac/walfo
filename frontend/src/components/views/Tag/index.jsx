import React from 'react';
import * as PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';
import ColorHash from 'color-hash';

const colorHash = new ColorHash();

function Tag({ tag, className }) {
  return (
    <Chip
      className={className}
      label={tag}
      color="primary"
      style={{ backgroundColor: colorHash.hex(tag) }}
    />
  );
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Tag.defaultProps = {
  className: '',
};

export default Tag;
