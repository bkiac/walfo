import React, { useState } from 'react';
import { Paper } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import style from './style.module.scss';
import { Tag } from '../../views';

function TagsSelector({ tags, initialClickedTags, onChange }) {
  const [clickedTags, setClickedTags] = useState(initialClickedTags);

  function toggleTag(tag) {
    const isAlreadyClicked = clickedTags.includes(tag);

    let newTags;
    if (isAlreadyClicked) {
      newTags = clickedTags.filter(t => t !== tag);
    } else {
      newTags = [...clickedTags, tag];
    }
    setClickedTags(newTags);

    onChange(newTags);
  }

  return (
    <Paper className={style.tagsContainer}>
      {tags.map(t => (
        <Tag
          className={style.margin}
          key={t}
          tag={t}
          clickable
          clicked={clickedTags.includes(t)}
          onClick={() => toggleTag(t)}
        />
      ))}
    </Paper>
  );
}

TagsSelector.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  initialClickedTags: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

TagsSelector.defaultProps = {
  tags: [],
  initialClickedTags: [],
};

export default TagsSelector;
