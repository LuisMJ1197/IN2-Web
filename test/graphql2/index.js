const { GraphQLScalarType } = require ('graphql')
const { GraphQLServer } = require('graphql-yoga')
const fetch = require('node-fetch')

const baseURL = `http://localhost:3002/products/`

const resolvers = {
  Query: {
    products: () => {
      return fetch(`${baseURL}getProducts`).then(res => res.json())
    },
    product: (parent, args) => {
      const { idalimento } = args
      return fetch(`${baseURL}getProductById?idalimento=${idalimento}`).then(res => res.json())
    }
  },
  Mutation: {
    createProduct: (parent, args) => {
      const {idalimento, nombre, foto, cantidad, fechacaducidad} = args
      return fetch(`${baseURL}createProduct?idalimento=${idalimento}&nombre=${nombre}&foto=${foto}&cantidad=${cantidad}&fechacaducidad=${fechacaducidad}`)
      .then(res => res.json())
    },
    updateProduct: (parent, args) => {
      const {idalimento, nombre, foto, cantidad, fechacaducidad} = args
      return fetch(`${baseURL}updateProduct?idalimento=${idalimento}&nombre=${nombre}&foto=${foto}&cantidad=${cantidad}&fechacaducidad=${fechacaducidad}`)
      .then(res => res.json())
    },
    deleteProduct: (parent, args) => {
      const { idalimento } = args
      return fetch(`${baseURL}deleteProduct?idalimento=${idalimento}`).then(res => res.json())
    },
  },
}

const server = new GraphQLServer({
  typeDefs: `schema.graphql`,
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))