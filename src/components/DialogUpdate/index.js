import React, {useState, useEffect} from 'react';

import {
  Dialog, 
  DialogTitle, 
  DialogActions, 
  DialogContent, 
  DialogContentText,
  TextField,
  InputLabel
} from '@material-ui/core';

import Button from '@material-ui/core/Button';

import api from '../../service/api'

// import { Container } from './styles';
function DialogUpdate({
  updateProduct, 
  handleCloseDialogUpdate, 
  ToastMessage, 
  loadProducts,
  openDialog
}){
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState('')
  
  useEffect(() => {
    setTitle(updateProduct.title)
    setType(updateProduct.type)
    setPrice(updateProduct.price)
  }, [updateProduct.price, updateProduct.title, updateProduct.type])

  function handleChangeTitle(title){
    setTitle(title.target.value)
  }
  function handleChangeType(type){
    setType(type.target.value)
  }
  function handleChangePrice(price){
    setPrice(price.target.value)
  }

  async function handleUpdateProduct(){
    try{
      handleCloseDialogUpdate();
      const response = await api.put(`products/${updateProduct._id}`, {
        title, type, price
      })
      if(response.status === 200){
        ToastMessage('Update product success', 'success')
      }else{
        // eslint-disable-next-line no-throw-literal
        throw('Error on update product');
      }
      
      loadProducts()
    }catch(err){
      ToastMessage(err, 'error')
      handleCloseDialogUpdate();
    }
  }

  return (
    <Dialog 
      open={openDialog} 
      onClose={handleCloseDialogUpdate} 
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        Edit {updateProduct.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Change values and update the product
        </DialogContentText>
        <InputLabel>Title</InputLabel>
        <TextField
          autoFocus
          id="title"
          fullWidth
          value={title}
          onChange={handleChangeTitle}
          
        />
        <div style={{
          paddingTop: '20px'
        }}>
        <InputLabel>Type</InputLabel>
        <TextField
          margin="dense"
          id="type"
          fullWidth
          value={type}
          onChange={handleChangeType}
        />
        </div>
        <div style={{
          paddingTop: '20px'
        }}>
        <InputLabel>Price</InputLabel>
        <TextField
        value={price}
        onChange={handleChangePrice}
        id="Price"
        fullWidth
        type='number'
        margin="dense"
        />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialogUpdate} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleUpdateProduct(updateProduct)} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
  </Dialog>
  );
}

export default DialogUpdate;