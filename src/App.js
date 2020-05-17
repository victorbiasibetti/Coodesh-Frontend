import React, {useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import NumberFormat from 'react-number-format';

import {
  Dialog, 
  DialogTitle, 
  DialogActions, 
  DialogContent, 
  DialogContentText,
  TextField,
  InputLabel
} from '@material-ui/core';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from './service/api'

function App() {

  const [products, setProducts] = useState([])
  const [importFiles, setImportFiles] = useState([])
  const [filesToImport, setFilesToImport] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openDialogDelete, setOpenDialogDelete] = useState(false)
  const [updateProduct, setUpdateProduct] = useState({})
  const [deleteProduct, setDeleteProduct] = useState({})
  
  const loadProducts = async () => {
    const response = await api.get('products')
    setProducts(response.data)
  }

  useEffect(() => {
    loadProducts();
  }, [])

  function DialogUpdateOpen(product){
    setUpdateProduct(product)
    setOpenDialog(true)
  }
  
  function handleCloseDialogUpdate(){
    setUpdateProduct({})
    setOpenDialog(false)
  }
  
  function DialogDeleteOpen(product){
    setDeleteProduct(product)
    setOpenDialogDelete(true)
  }

  function handleCloseDialogDelete(){
    setDeleteProduct({})
    setOpenDialogDelete(false)
  }
    

  function DialogUpdate(){
    const [title, setTitle] = useState(updateProduct.title)
    const [type, setType] = useState(updateProduct.type)
    const [price, setPrice] = useState(updateProduct.price)
    
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

  function DialogDelete(){
    async function handleDeleteProduct(){
      try{
        handleCloseDialogDelete();
        const response = await api.delete(`products/${deleteProduct._id}`)
        if(response.status === 200){
          ToastMessage('Delete product success', 'success')
        }else{
          // eslint-disable-next-line no-throw-literal
          throw('Error on delete product');
        }
        loadProducts()
      }catch(err){
        ToastMessage(err, 'error')
        handleCloseDialogDelete();
      }
    }

    return (
      <Dialog 
        open={openDialogDelete} 
        onClose={handleCloseDialogDelete} 
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Delete {deleteProduct.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You confirm to delete product?
            This operation is not rollback!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteProduct()} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
    </Dialog>
    );
  }


  function handleImportFiles({target}){
    const files = target.files
    
    const filesArray = Array.from(files)
    const filesName = filesArray.map(file => ' '+file.name)
    
    setFilesToImport(filesName)
    setImportFiles(filesArray)
  }

  function ToastMessage(message, type){
    switch(type){
      case 'success': 
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,      
        });
        break;
      case 'info': 
        toast.info(message, {
          position: toast.POSITION.TOP_RIGHT,      
          });
        break;
      case 'warn': 
        toast.warn(message, {
          position: toast.POSITION.TOP_RIGHT,      
          });
        break;
      case 'error': 
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,      
          });
        break;
      default: 
        toast(message, {
          position: toast.POSITION.TOP_RIGHT,
          closeButton: false,
          bodyStyle: {color: 'black'}
        });
        break;
      
    }
  }

  async function handleSendFileToImport(){
    try{
      const files = new FormData() 
      
      for (let i = 0; i < importFiles.length; i++) {
        files.append(`files`, importFiles[i])
      }

      const response = await api.post('products', files)

      if(response.status === 200){
        ToastMessage('Arquivos importados com sucesso', 'success')
      }

      setFilesToImport([])
      setImportFiles('')
      loadProducts()
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div>
      <ToastContainer />

      <DialogUpdate />

      <DialogDelete />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: '50px',
        width: '100%'
      }}>

      <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            accept="application/json"
            onChange={handleImportFiles}
          />
        </Button>
        <Input 
        value={filesToImport} 
        style={{
          marginLeft: '20px',
          width: '50%'
        }}
        fullWidth
        />

        <Button
          style={{
            padding: '10px 20px 10px 20px',
            marginLeft: '30px'
          }}
          variant="contained" 
          color="primary"
          size='medium'
          onClick={handleSendFileToImport}
        >
          Enviar
        </Button>
      </div>
      <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Rating</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell component="th" scope="row">
                {product.title}
              </TableCell>
              <TableCell align="right">{product.type}</TableCell>
              <TableCell align="right">{product.rating}</TableCell>
              <TableCell align="right">{product.price}</TableCell>
              <TableCell align="right">{product.createdAt}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" aria-label="edit" component="span" 
                  onClick={() => DialogUpdateOpen(product)}
                >
                  <Edit  />
                </IconButton>
                <IconButton color="primary" aria-label="delete" component="span"
                  onClick={() => DialogDeleteOpen(product)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default App;
