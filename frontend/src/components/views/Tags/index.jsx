import React from 'react';
import * as PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import Tag from '../Tag';
import style from './style.module.scss';

function Tags({ activeTags, tags }) {
  return (
    <Paper className={style.tagsContainer}>
      {tags.map(t => (
        <Tag className={style.margin} clicked={activeTags.includes(t)} key={t} tag={t} />
      ))}
    </Paper>
  );
}

Tags.propTypes = {
  activeTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tags;
