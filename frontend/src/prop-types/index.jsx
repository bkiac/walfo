import * as PropTypes from 'prop-types';

export const transaction = PropTypes.shape({
  id: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['BUY', 'SELL']).isRequired,
});

export const position = PropTypes.shape({
  symbol: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  avgProfitMargin: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  holdings: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export const rawMarketData = PropTypes.shape({
  PRICE: PropTypes.number.isRequired,
  TOTALVOLUME24HTO: PropTypes.number.isRequired,
  CHANGE24HOUR: PropTypes.number.isRequired,
  CHANGEPCT24HOUR: PropTypes.number.isRequired,
  MKTCAP: PropTypes.number.isRequired,
});

export const displayMarketData = PropTypes.shape({
  PRICE: PropTypes.string.isRequired,
  TOTALVOLUME24HTO: PropTypes.string.isRequired,
  CHANGE24HOUR: PropTypes.string.isRequired,
  CHANGEPCT24HOUR: PropTypes.string.isRequired,
  MKTCAP: PropTypes.string.isRequired,
});

export const coin = PropTypes.shape({
  CoinInfo: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    FullName: PropTypes.string.isRequired,
    Algorithm: PropTypes.string.isRequired,
    ProofType: PropTypes.string.isRequired,
  }),
  RAW: PropTypes.shape({
    USD: rawMarketData,
  }),
  DISPLAY: PropTypes.shape({
    USD: displayMarketData,
  }),
});
