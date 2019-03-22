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
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalHoldings: PropTypes.number.isRequired,
  avgCost: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(transaction).isRequired,
});
