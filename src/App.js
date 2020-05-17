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

import api from './service/api'

function App() {

  const [products, setProducts] = useState([])
  const [importFiles, setImportFiles] = useState([])
  const [filesToImport, setFilesToImport] = useState('')

  const loadProducts = async () => {
    const response = await api.get('products')
    setProducts(response.data)
  }

  useEffect(() => {
    loadProducts();
  }, [])

  function handleImportFiles({target}){
    const files = target.files
    
    const filesArray = Array.from(files)
    const filesName = filesArray.map(file => ' '+file.name)
    
    setFilesToImport(filesName)
    setImportFiles(filesArray)
  }

  async function handleSendFileToImport(){
    try{
      const files = new FormData() 
      
      for (let i = 0; i < importFiles.length; i++) {
        files.append(`files`, importFiles[i])
      }

      const response = await api.post('products', files)

      if(response.status === 200){
        console.log("Sucesso!!")
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
            <TableRow key={product.title}>
              <TableCell component="th" scope="row">
                {product.title}
              </TableCell>
              <TableCell align="right">{product.type}</TableCell>
              <TableCell align="right">{product.rating}</TableCell>
              <TableCell align="right">{product.price}</TableCell>
              <TableCell align="right">{product.createdAt}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" aria-label="edit" component="span">
                  <Edit />
                </IconButton>
                <IconButton color="primary" aria-label="delete" component="span">
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
