const express = require('express')
const router = express()
const todoController = require('../controllers/todo')


router.post('/', todoController.create)
router.get('/', todoController.findAll)
router.get('/:id', todoController.findOne)
router.put('/:id', todoController.update)
router.delete('/:id', todoController.remove)

module.exports = router