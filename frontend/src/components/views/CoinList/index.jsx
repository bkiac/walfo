import React from 'react';
import * as PropTypes from 'prop-types';
import * as OwnTypes from '../../../prop-types';
import Coin from '../Coin';

function CoinList({ coins, marketCap, volume }) {
  return coins.map((c, i) => (
    <Coin
      key={c.CoinInfo.Name}
      coin={c}
      rank={marketCap || volume ? i + 1 : undefined}
      marketCap={marketCap}
      volume={volume}
    />
  ));
}

CoinList.propTypes = {
  coins: PropTypes.arrayOf(OwnTypes.coin).isRequired,
  marketCap: PropTypes.bool,
  volume: PropTypes.bool,
};

CoinList.defaultProps = {
  marketCap: false,
  volume: false,
};

export default CoinList;
