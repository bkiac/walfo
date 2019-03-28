import React, { useContext } from 'react';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { TextField, Paper, MenuItem } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { CoinsContext } from '../../../contexts';

function renderInput(inputProps) {
  const { InputProps, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...InputProps,
      }}
      {...other}
    />
  );
}

// eslint-disable-next-line react/prop-types
function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem ? selectedItem.label : '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(data, value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : data.filter(element => {
        const keep = count < 5 && element.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function CoinField({ error, helperText, onChange, value: initialSymbol, disabled }) {
  const { coins, coinListForInput } = useContext(CoinsContext);
  const initialCoin = coins[initialSymbol];
  const initialSelectedItem = initialCoin
    ? { label: initialCoin.FullName, value: initialSymbol }
    : undefined;

  return (
    <Downshift
      initialSelectedItem={initialSelectedItem}
      onChange={selection => onChange(selection.value)}
      itemToString={item => (item ? item.label : '')}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
      }) => (
        <div>
          {renderInput({
            label: 'Coin',
            margin: 'normal',
            variant: 'outlined',
            fullWidth: true,
            InputProps: getInputProps({
              placeholder: 'Bitcoin (BTC)',
              error,
              helperText,
              disabled,
            }),
          })}
          <div {...getMenuProps()}>
            {isOpen ? (
              <Paper square>
                {getSuggestions(coinListForInput, inputValue).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        </div>
      )}
    </Downshift>
  );
}

CoinField.propTypes = {
  error: PropTypes.bool,
  helperText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
};

CoinField.defaultProps = {
  error: false,
  helperText: '',
  value: '',
  disabled: false,
};

export default CoinField;
