import React, { useState } from 'react';
import { Button, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { useApiOnMount, useLogout } from '../../../hooks';
import { portfolioApi } from '../../../api';
import { Spinner } from '../../views';
import Portfolio from '../Portfolio';

function Dashboard() {
  const logout = useLogout();
  const [isDrawOpen, setIsDrawOpen] = useState(false);
  const portfolios = useApiOnMount(portfolioApi.getPortfolioNames);
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(0);

  function openDrawer() {
    setIsDrawOpen(true);
  }

  function closeDrawer() {
    setIsDrawOpen(false);
  }

  if (portfolios.isLoading || portfolios.hasError) {
    return <Spinner />;
  }
  return (
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

      <Button variant="contained" color="primary" onClick={logout}>
        Logout
      </Button>

      <Button variant="contained" color="primary" onClick={openDrawer}>
        open fiók
      </Button>

      <Portfolio name={portfolios.data[selectedPortfolioIndex]} />
    </>
  );
}

export default Dashboard;
