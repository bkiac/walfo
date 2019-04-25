import React, { useState } from 'react';
import { Paper, TextField } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import style from './style.module.scss';
import { Tag } from '../../views';

function TagsField({ initialTags, onChange }) {
  const [input, setInput] = useState('');
  const [ownTags, setOwnTags] = useState([]);
  const tags = [...initialTags, ...ownTags];

  function change(newTags) {
    setOwnTags(newTags);
    onChange(newTags);
  }

  function createTag(newTag) {
    const newTags = tags.includes(newTag) ? ownTags : [...ownTags, newTag];
    change(newTags);
  }

  function removeTag(tagToBeRemoved) {
    const newTags = ownTags.filter(t => t !== tagToBeRemoved);
    change(newTags);
  }

  return (
    <div>
      <Paper className={style.tagsContainer}>
        {initialTags.map(it => (
          <Tag className={style.margin} key={it} tag={it} />
        ))}
        {ownTags.map(t => (
          <Tag className={style.margin} key={t} tag={t} onDelete={() => removeTag(t)} />
        ))}
      </Paper>
      <TextField
        fullWidth
        margin="normal"
        value={input}
        onChange={e => setInput(e.target.value)}
        label="New tag (press TAB to add the new tag to the list)"
        placeholder="tag"
        onKeyDown={e => {
          const key = e.which || e.keyCode;
          if (key === 9) {
            createTag(e.target.value);
            setInput('');
          }
        }}
      />
    </div>
  );
}

TagsField.propTypes = {
  initialTags: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

TagsField.defaultProps = {
  initialTags: [],
};

export default TagsField;
