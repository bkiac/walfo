import React, { useState } from 'react';
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from '@material-ui/core';
import { useApiOnMount, useLogout } from '../../../hooks';
import { coinsApi, portfolioApi } from '../../../api';
import { Spinner } from '../../views';
import Portfolio from '../Portfolio';
import TransactionForm from '../TransactionForm';
import { CoinsProvider } from '../../providers';

function Dashboard() {
  const logout = useLogout();

  const [isDrawOpen, setIsDrawOpen] = useState(false);
  function openDrawer() {
    setIsDrawOpen(true);
  }
  function closeDrawer() {
    setIsDrawOpen(false);
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  function openDialog() {
    setIsDialogOpen(true);
  }
  function closeDialog() {
    setIsDialogOpen(false);
  }

  const portfolios = useApiOnMount(portfolioApi.getPortfolioNames);
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(0);

  const coinList = useApiOnMount(coinsApi.getCoinList);

  if (portfolios.isLoading || portfolios.hasError || coinList.isLoading) {
    return <Spinner />;
  }
  return (
    <CoinsProvider initialCoins={coinList.data}>
      <>
        <Drawer open={isDrawOpen} onClose={closeDrawer}>
          <List>
            {portfolios.data.map((p, i) => (
              <ListItem
                key={p}
                selected={i === selectedPortfolioIndex}
                onClick={() => setSelectedPortfolioIndex(i)}
              >
                <ListItemText primary={p} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>New Transaction</DialogTitle>
          <DialogContent>
            <TransactionForm portfolio={portfolios.data[selectedPortfolioIndex]} />
          </DialogContent>
        </Dialog>

        <Grid item>
          <Grid container direction="row" justify="center" alignItems="flex-start">
            <Button variant="contained" color="primary" onClick={logout}>
              Logout
            </Button>

            <Button variant="contained" color="primary" onClick={openDrawer}>
              open fiók
            </Button>

            <Button variant="contained" color="primary" onClick={openDialog}>
              new tx
            </Button>
          </Grid>
        </Grid>

        <Portfolio name={portfolios.data[selectedPortfolioIndex]} />
      </>
    </CoinsProvider>
  );
}

export default Dashboard;
