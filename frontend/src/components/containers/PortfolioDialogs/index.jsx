import React, { useContext } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import AddTransactionToPortfolioForm from '../AddTransactionToPortfolioForm';
import { DashboardContext, PortfolioContext } from '../../../contexts';
import { DeleteTransactionConfirmation } from '../index';

function PortfolioDialogs() {
  const {
    isFormDialogOpen,
    isConfirmationDialogOpen,
    closeDialog,
    selectedPortfolio,
    selectedTransaction,
  } = useContext(DashboardContext);
  const { getPositionByTransactionId } = useContext(PortfolioContext);

  const position = getPositionByTransactionId(selectedTransaction);
  const isOpen = isFormDialogOpen || isConfirmationDialogOpen;

  return (
    <Dialog open={isOpen} onClose={closeDialog} fullWidth maxWidth="md">
      {isFormDialogOpen ? (
        <>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogContent>
            <AddTransactionToPortfolioForm onSuccess={closeDialog} />
          </DialogContent>
        </>
      ) : null}

      {isConfirmationDialogOpen ? (
        <>
          <DialogTitle>
            Do you want to delete this {position.symbol} transaction from {`'${selectedPortfolio}'`}
            ?
          </DialogTitle>
          <DialogContent>
            <DeleteTransactionConfirmation />
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}

export default PortfolioDialogs;
