import React from 'react';
import * as PropTypes from 'prop-types';
import { portfolioApi, pricesApi } from '../../../api';
import { useApiOnMount } from '../../../hooks';
import { Spinner, Positions } from '../../views';

function Portfolio({ name }) {
  const portfolio = useApiOnMount(portfolioApi.getPortfolio, name);
  const currentPrices = useApiOnMount(pricesApi.getCurrentPrices);

  if (
    portfolio.isLoading ||
    currentPrices.isLoading ||
    portfolio.hasError ||
    currentPrices.hasError
  ) {
    return <Spinner />;
  }
  return <Positions positions={portfolio.data.positions} currentPrices={currentPrices.data} />;
}

Portfolio.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Portfolio;
