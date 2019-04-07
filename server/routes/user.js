const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const Auth = require('../middlewares/authenticate').Authenticate

router.get('/verified', Auth, userController.checkLogin)
router.post('/register', userController.createUser)
router.post('/login', userController.login)

module.exports = router