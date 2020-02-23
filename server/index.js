import express from 'express'
import bodyParser from 'body-parser'

import initiateMongoServer from '../config/db'
import user from '../routes/user'

initiateMongoServer()

const app = express()

const PORT = process.env.PORT || 4000

app.use(bodyParser.json())

/**
 * Router Middleware
 * Route - /user/*
 * Method - *
 */

app.use('/user', user)

app.listen(PORT, (req, res) => {
  console.log('Server started at port: ', PORT)
})
