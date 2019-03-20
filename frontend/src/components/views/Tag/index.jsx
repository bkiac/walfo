import React from 'react';
import * as PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';
import ColorHash from 'color-hash';

const colorHash = new ColorHash();

function Tag({ tag }) {
  return <Chip label={tag} color="primary" style={{ backgroundColor: colorHash.hex(tag) }} />;
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

export default Tag;
