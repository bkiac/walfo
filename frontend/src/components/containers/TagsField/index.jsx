import React, { useState } from 'react';
import { Paper, TextField } from '@material-ui/core';
import { uniq } from 'lodash';
import * as PropTypes from 'prop-types';
import style from './style.module.scss';
import { Tag } from '../../views';

function TagsField({ initialTags, onChange }) {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState(initialTags);

  function change(newTags) {
    setTags(newTags);
    onChange(newTags);
  }

  function createTag(newTag) {
    const newTags = uniq([...tags, newTag]);
    change(newTags);
  }

  function removeTag(tagToBeRemoved) {
    const newTags = tags.filter(t => t !== tagToBeRemoved);
    change(newTags);
  }

  return (
    <div>
      <Paper className={style.padding}>
        {tags.map(t =>
          initialTags.includes(t) ? (
            <Tag className={style.margin} key={t} tag={t} />
          ) : (
            <Tag className={style.margin} key={t} tag={t} onDelete={() => removeTag(t)} />
          ),
        )}
      </Paper>
      <TextField
        fullWidth
        margin="normal"
        value={input}
        onChange={e => setInput(e.target.value)}
        label="New tag"
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
  initialTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TagsField;
