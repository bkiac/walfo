import React from 'react';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { coinsApi } from '../../../api';
import { Spinner } from '../../views';
import Portfolio from '../Portfolio';
import { CoinsProvider, DashboardProvider, PortfolioProvider } from '../../providers';
import DashboardNav from '../DashboardNav';
import PortfoliosDrawer from '../PortfoliosDrawer';
import TransactionDialog from '../TransactionDialog';
import { DashboardContext } from '../../../contexts';
import InitialTransactionForm from '../InitialTransactionForm';
import style from './style.module.scss';

function Dashboard() {
  const [coinList] = useApiOnMount(coinsApi.getCoinList);
  const isLoading = useIsLoading([coinList]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <CoinsProvider initialCoins={coinList.data}>
      <DashboardProvider>
        <>
          <PortfoliosDrawer />

          <DashboardNav />

          <div className={style.padding}>
            <DashboardContext.Consumer>
              {({ selectedPortfolio, NEW_PORTFOLIO }) =>
                selectedPortfolio === NEW_PORTFOLIO ? (
                  <InitialTransactionForm />
                ) : (
                  <PortfolioProvider portfolioName={selectedPortfolio}>
                    <>
                      <Portfolio />
                      <TransactionDialog />
                    </>
                  </PortfolioProvider>
                )
              }
            </DashboardContext.Consumer>
          </div>
        </>
      </DashboardProvider>
    </CoinsProvider>
  );
}

export default Dashboard;
