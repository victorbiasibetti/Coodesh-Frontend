import React from 'react';
import { parseISO, format } from 'date-fns'
import {
  Table, 
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

// import { Container } from './styles';

function TableComponent({products, DialogUpdateOpen, DialogDeleteOpen}) {
  return (
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
              <TableCell align="right">{new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(product.price)}
              </TableCell>
              <TableCell align="right">{
                format(
                  parseISO(product.createdAt), 
                  "dd/MM/yyyy HH:mm:ss 'GMT' XXX"
                  ) 
                }</TableCell>
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
  );
}

export default TableComponent;