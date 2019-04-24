import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useContext } from 'react';
import { DashboardContext } from '../../../contexts';
import ChangePasswordForm from '../ChangePasswordForm';

function ChangePasswordDialog() {
  const { isChangePasswordDialogOpen, closeDialog } = useContext(DashboardContext);
  return (
    <Dialog open={isChangePasswordDialogOpen} onClose={closeDialog}>
      <DialogTitle>Change password</DialogTitle>
      <DialogContent>
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordDialog;
