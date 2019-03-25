import React from 'react';
import * as PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import Tag from '../Tag';
import style from './style.module.scss';

function Tags({ tags }) {
  return (
    <Paper className={style.tagsContainer}>
      {tags.map(t => (
        <Tag className={style.margin} key={t} tag={t} />
      ))}
    </Paper>
  );
}

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tags;
