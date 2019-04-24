import React from 'react';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { coinsApi } from '../../../api';
import { Spinner } from '../../views';
import ChangePasswordDialog from '../ChangePasswordDialog';
import Portfolio from '../Portfolio';
import { CoinsProvider, DashboardProvider, PortfolioProvider } from '../../providers';
import { DashboardContext } from '../../../contexts';
import style from './style.module.scss';
import PortfoliosDrawer from '../PortfoliosDrawer';
import DashboardNav from '../DashboardNav';
import InitialTransactionForm from '../InitialTransactionForm';
import PortfolioDialogs from '../PortfolioDialogs';

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

          <ChangePasswordDialog />

          <div className={style.padding}>
            <DashboardContext.Consumer>
              {({ selectedPortfolio, NEW_PORTFOLIO }) =>
                selectedPortfolio === NEW_PORTFOLIO ? (
                  <InitialTransactionForm />
                ) : (
                  <PortfolioProvider portfolioName={selectedPortfolio}>
                    <>
                      <Portfolio />
                      <PortfolioDialogs />
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
