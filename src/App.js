import React, {useEffect, useState} from 'react';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import TableComponent from './components/Table'
import DialogUpdate from './components/DialogUpdate'
import DialogDelete from './components/DialogDelete'

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
      
      if(importFiles.length === 0){
        ToastMessage('Select file to import', 'warn')
        return;
      }

      for (let i = 0; i < importFiles.length; i++) {
        files.append(`files`, importFiles[i])
      }

      const response = await api.post('products', files)

      if(response.status === 200){
        ToastMessage('Success to import products', 'success')
      }else{
        // eslint-disable-next-line no-throw-literal
        throw('Error on import products');
      }
      setFilesToImport([])
      setImportFiles('')
      loadProducts()
    }catch(err){
      ToastMessage(err, 'error')
    }
  }

  return (
    <div>
      <ToastContainer />

      <DialogUpdate 
        updateProduct={updateProduct}
        handleCloseDialogUpdate={handleCloseDialogUpdate}
        ToastMessage={ToastMessage}
        loadProducts={loadProducts}
        openDialog={openDialog}
      />

      <DialogDelete 
        deleteProduct={deleteProduct}
        handleCloseDialogDelete={handleCloseDialogDelete}
        ToastMessage={ToastMessage}
        loadProducts={loadProducts}
        openDialogDelete={openDialogDelete}
      />

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
          Import
        </Button>
      </div>

      <TableComponent 
        products={products} 
        DialogUpdateOpen={DialogUpdateOpen}
        DialogDeleteOpen={DialogDeleteOpen}
      />
      
    </div>
  );
}

export default App;
