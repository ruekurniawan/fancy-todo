const express = require('express')
const router = express.Router()
const { Authenticate } = require('../middlewares/authenticate')
const userRoutes = require('../routes/user')
const todoRoutes = require('../routes/todo')

router.use('/users', userRoutes)

router.use(Authenticate)
router.use('/todos', todoRoutes)

module.exports = router

