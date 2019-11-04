const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.log(error)
    }
    response.status(200).json(results.rows)
  })
}

const getProductById = (request, response) => {
  const { idalimento } = request.query
  pool.query('SELECT * FROM products WHERE idalimento = $1', [idalimento], (error, results) => {
    if (error) {
      console.log(error)
    }
    response.status(200).json(results.rows)
  })
}

const createProduct = (request, response) => {
  const { idalimento, nombre, foto, cantidad, fechacaducidad } = request.query

  pool.query('INSERT INTO products (idalimento, nombre, foto, cantidad, fechacaducidad) VALUES ($1, $2, $3, $4, $5)', [idalimento, nombre, foto, cantidad, fechacaducidad], error => {
    if (error) {
      console.log(error)
      response.status(201).json({ status: 'unsuccess', message: 'Cannot add product. Check your values.' })
    } else {
      response.status(200).json({ status: 'success', message: 'Product added.' }) 
    }
  })
}

const updateProduct = (request, response) => {
  const { idalimento, nombre, foto, cantidad, fechacaducidad } = request.query
  pool.query('UPDATE products SET nombre = $1, foto = $2, cantidad = $3, fechacaducidad = $4 WHERE idalimento = $5', [nombre, foto, cantidad, fechacaducidad, idalimento], error => {
    if (error) {
      console.log(error)
      response.status(201).json({ status: 'unsuccess', message: 'Cannot update product. Check your values.'})
    } else {
      response.status(200).json({ status: 'success', message: 'Product updated.' })
    }
    
  })
}

const deleteProduct = (request, response) => {
  const { idalimento } = request.query
  pool.query('DELETE FROM products WHERE idalimento = $1', [idalimento], (error, results) => {
    if (error) {
      console.log(error)
      response.status(201).json({ status: 'unsuccess', message: 'Cannot delete product. Check de product id.' })
    } else {
      response.status(200).json({ status: 'success', message: 'Product deleted.' })
    }
  })
}


app.get('/products/getProducts/',getProducts)
app.get('/products/getProductById/', getProductById)
app.get('/products/createProduct/', createProduct)
app.get('/products/updateProduct/', updateProduct)
app.get('/products/deleteProduct/', deleteProduct)
//app.use(clientErrorHandler);
/*

app.get('/products/getProducts/',getProducts)
app.get('/products/getProductById/:idalimento', getProductById)
app.post('/products/createProduct/:idalimento/:nombre/:foto/:cantidad/:fechacaducidad', createProduct)
app.patch('/products/updateProduct/:idalimento/:nombre/:foto/:cantidad/:fechacaducidad', updateProduct)
app.delete('/products/deleteProduct/:idalimento', deleteProduct)*/

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})