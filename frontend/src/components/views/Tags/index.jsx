import React from 'react';
import * as PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import Tag from '../Tag';

function Tags({ tags }) {
  return (
    <Paper>
      {tags.map(t => (
        <Tag key={t} tag={t} />
      ))}
    </Paper>
  );
}

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tags;
