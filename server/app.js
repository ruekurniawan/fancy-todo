require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const indexRoutes = require('./routes/index')

const moongose = require('mongoose')
const dbName = 'mongodb://localhost/myToDo'
moongose.connect(dbName, { useCreateIndex: true, useNewUrlParser: true })

moongose.connection.once('open', function () {
  console.log('Connected')
}).on('error', function (error) {
  console.log('Connected error: ', error)
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors())

app.use('/', indexRoutes)

const port = 3000

app.listen(port, () => {
  console.log(`App listen in your port ${port}`);
})