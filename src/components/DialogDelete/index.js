import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

import Button from '@material-ui/core/Button';

import api from '../../service/api';
// import { Container } from './styles';

function DialogDelete({
  deleteProduct,
  ToastMessage,
  handleCloseDialogDelete,
  loadProducts,
  openDialogDelete,
}) {
  async function handleDeleteProduct() {
    try {
      handleCloseDialogDelete();
      const response = await api.delete(`products/${deleteProduct._id}`);
      if (response.status === 200) {
        ToastMessage('Delete product success', 'success');
      } else {
        throw 'Error on delete product';
      }
      loadProducts();
    } catch (err) {
      ToastMessage(err, 'error');
      handleCloseDialogDelete();
    }
  }

  return (
    <Dialog
      open={openDialogDelete}
      onClose={handleCloseDialogDelete}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Delete {deleteProduct.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You confirm to delete product? This operation is not rollback!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialogDelete} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleDeleteProduct()}
          color="primary"
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogDelete;
