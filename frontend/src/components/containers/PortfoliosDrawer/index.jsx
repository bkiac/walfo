import React, { useContext } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, ListItemIcon } from '@material-ui/core';
import { NoteAdd as NoteAddIcon } from '@material-ui/icons';
import { DashboardContext } from '../../../contexts';

function PortfoliosDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    portfolios,
    selectPortfolio,
    selectedPortfolio,
    NEW_PORTFOLIO,
  } = useContext(DashboardContext);
  return (
    <Drawer open={isDrawerOpen} onClose={closeDrawer}>
      <List>
        <ListItem button onClick={() => selectPortfolio(NEW_PORTFOLIO)}>
          <ListItemIcon style={{ marginRight: 0 }}>
            <NoteAddIcon />
          </ListItemIcon>
          <ListItemText primary="New portfolio" />
        </ListItem>
      </List>

      <Divider />

      <List>
        {portfolios.map(p => (
          <ListItem
            button
            key={p}
            selected={p === selectedPortfolio}
            onClick={() => selectPortfolio(p)}
          >
            <ListItemText primary={p} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default PortfoliosDrawer;
