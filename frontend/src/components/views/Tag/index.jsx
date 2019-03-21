import React from 'react';
import * as PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';
import ColorHash from 'color-hash';

const colorHash = new ColorHash();

function Tag({ tag, className, onDelete }) {
  return (
    <Chip
      className={className}
      label={tag}
      color="primary"
      onDelete={onDelete}
      style={{ backgroundColor: colorHash.hex(tag) }}
    />
  );
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  className: PropTypes.string,
};

Tag.defaultProps = {
  onDelete: undefined,
  className: '',
};

export default Tag;
