import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { DashboardContext } from '../../../contexts';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import * as portfolioApi from '../../../api/portfolioApi';
import { Spinner } from '../../views';

const NEW_PORTFOLIO = 'NEW_PORTFOLIO';

function DashboardProvider({ children }) {
  const [portfolios, refreshPortfolios] = useApiOnMount(portfolioApi.getPortfolioNames);
  const isLoading = useIsLoading([portfolios]);

  const defaultPortfolio =
    portfolios.data && portfolios.data.length > 0 ? portfolios.data[0] : NEW_PORTFOLIO;
  const [selectedPortfolio, setSelectedPortfolio] = useState();

  const [selectedTransaction, selectTransaction] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  function openDrawer() {
    setIsDrawerOpen(true);
  }
  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function openFormDialog() {
    setIsFormDialogOpen(true);
  }
  function openConfirmationDialog() {
    setIsConfirmationDialogOpen(true);
  }
  function closeDialog() {
    selectTransaction('');
    setIsFormDialogOpen(false);
    setIsConfirmationDialogOpen(false);
  }

  function selectPortfolio(portfolio) {
    setSelectedPortfolio(portfolio);
    selectTransaction('');
    closeDrawer();
  }

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <DashboardContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        isFormDialogOpen,
        isConfirmationDialogOpen,
        openFormDialog,
        openConfirmationDialog,
        closeDialog,
        NEW_PORTFOLIO,
        portfolios: portfolios.data,
        refreshPortfolios,
        selectedPortfolio: selectedPortfolio || defaultPortfolio,
        selectPortfolio,
        selectedTransaction,
        selectTransaction,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

DashboardProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default DashboardProvider;
