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

import api from './service/api'

function App() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    const loadProducts = async () => {
      const response = await api.get('products')
      setProducts(response.data)
    }
    loadProducts();
  }, [])

  return (
    <div>
      <div>
        <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            style={{ display: "none" }}
          />
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
            <TableRow key={product.name}>
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
