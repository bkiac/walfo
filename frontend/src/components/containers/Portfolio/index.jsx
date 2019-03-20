import React from 'react';
import * as PropTypes from 'prop-types';
import { portfolioApi } from '../../../api';
import { useApiOnMount } from '../../../hooks';
import { Spinner, Positions } from '../../views';

function Portfolio({ name }) {
  const portfolio = useApiOnMount(portfolioApi.getPortfolio, name);

  if (portfolio.isLoading || portfolio.hasError) {
    return <Spinner />;
  }
  return <Positions positions={portfolio.data.positions} />;
}

Portfolio.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Portfolio;
