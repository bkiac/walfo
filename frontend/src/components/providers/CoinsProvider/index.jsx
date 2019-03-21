import React, { useMemo, useState } from 'react';
import * as PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { CoinsContext } from '../../../contexts';

function collectCoinDataIntoArray(coins) {
  return sortBy(Object.values(coins), c => Number.parseInt(c.SortOrder, 10)).map(c => ({
    label: c.FullName,
    value: c.Symbol,
  }));
}

function CoinsProvider({ children, initialCoins }) {
  const [coins, setCoins] = useState(initialCoins);
  const symbols = useMemo(() => Object.keys(coins), [coins]);
  const coinListForInput = useMemo(() => collectCoinDataIntoArray(coins), [coins]);

  return (
    <CoinsContext.Provider value={{ coins, setCoins, symbols, coinListForInput }}>
      {children}
    </CoinsContext.Provider>
  );
}

CoinsProvider.propTypes = {
  children: PropTypes.element.isRequired,
  initialCoins: PropTypes.objectOf(
    PropTypes.shape({
      FullName: PropTypes.string.isRequired,
      Symbol: PropTypes.string.isRequired,
      SortOrder: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CoinsProvider;
