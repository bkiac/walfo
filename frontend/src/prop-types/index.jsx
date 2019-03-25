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
