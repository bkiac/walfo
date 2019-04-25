import React from 'react';
import * as PropTypes from 'prop-types';
import * as OwnTypes from '../../../prop-types';
import Coin from '../Coin';

function CoinList({ coins, marketCap, volume, price, change }) {
  return coins.map((c, i) => (
    <Coin
      key={c.info.Name}
      coin={c}
      rank={marketCap || volume ? i + 1 : undefined}
      marketCap={marketCap}
      volume={volume}
      price={price}
      change={change}
    />
  ));
}

CoinList.propTypes = {
  coins: PropTypes.arrayOf(OwnTypes.coin).isRequired,
  marketCap: PropTypes.bool,
  volume: PropTypes.bool,
  price: PropTypes.bool,
  change: PropTypes.bool,
};

CoinList.defaultProps = {
  marketCap: false,
  volume: false,
  price: false,
  change: false,
};

export default CoinList;
