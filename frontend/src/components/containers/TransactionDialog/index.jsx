import React, { useContext } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import AddTransactionToPortfolioForm from '../AddTransactionToPortfolioForm';
import { DashboardContext } from '../../../contexts';

function TransactionDialog() {
  const { isDialogOpen, closeDialog } = useContext(DashboardContext);
  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
      <DialogTitle>New Transaction</DialogTitle>
      <DialogContent>
        <AddTransactionToPortfolioForm onSuccess={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}

export default TransactionDialog;
