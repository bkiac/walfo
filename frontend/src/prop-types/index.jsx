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

export const marketData = PropTypes.shape({
  PRICE: PropTypes.number.isRequired,
  TOTALVOLUME24HTO: PropTypes.number.isRequired,
  VOLUME24HOURTO: PropTypes.number.isRequired,
  CHANGE24HOUR: PropTypes.number.isRequired,
  CHANGEPCT24HOUR: PropTypes.number.isRequired,
  MKTCAP: PropTypes.number.isRequired,
  HIGH24HOUR: PropTypes.number.isRequired,
  LOW24HOUR: PropTypes.number.isRequired,
  SUPPLY: PropTypes.number.isRequired,
});

export const coin = PropTypes.shape({
  info: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    CoinName: PropTypes.string,
    ImageUrl: PropTypes.string.isRequired,
    FullName: PropTypes.string.isRequired,
    Algorithm: PropTypes.string.isRequired,
    ProofType: PropTypes.string.isRequired,
    TotalCoinSupply: PropTypes.string,
    TotalCoinsMined: PropTypes.number,
  }),
  marketData: marketData.isRequired,
});
