import React from 'react';
import * as PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';
import ColorHash from 'color-hash';

const colorHash = new ColorHash();

function Tag({ tag, className, onClick, clicked, onDelete }) {
  return (
    <Chip
      clickable={onClick !== undefined}
      onClick={onClick}
      className={className}
      label={tag}
      onDelete={onDelete}
      style={clicked ? { color: '#fff', backgroundColor: colorHash.hex(tag) } : {}}
    />
  );
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  className: PropTypes.string,
  onClick: PropTypes.func,
  clicked: PropTypes.bool,
};

Tag.defaultProps = {
  onDelete: undefined,
  onClick: undefined,
  clicked: false,
  className: '',
};

export default Tag;
