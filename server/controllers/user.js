const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { compare } = require('../helpers/bcrypt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

class UserController {
  static createUser(req, res) {
    User
      .create({
        email: req.body.email,
        password: req.body.password
      })
      .then(data => {
        res.status(201).json({
          data,
          msg: 'Email Success Created'
        })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static login(req, res) {
    User
      .findOne({
        email: req.body.email,
      })
      .then(user => {
        if (user) {
          if (compare(req.body.password, user.password)) {
            let payload = {
              id: user._id
            }

            let token = jwt.sign(payload, process.env.JWT_TOKEN)

            res.status(200).json({
              access_token: token
            })
          } else {
            res.status(400).json({
              msg: 'Invalid  Password / Username'
            })
          }
        } else {
          res.status(400).json({
            msg: 'Invalid Email / Password'
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static gLogin(req, res) {
    // console.log(req.body)
    let payload = null
    client.verifyIdToken({
      idToken: req.body.idToken,
      audience: process.env.CLIENT_ID
    })
      .then(ticket => {
        payload = ticket.getPayload()
        // console.log(payload)
        const user = payload
        return User.findOne({
          email: payload.email
        })
          .then(user => {
            if (!user) {
              return User.create({
                email: payload.email,
                name: payload.name,
                password: '12345'
              })
            } else {
              const token = jwt.sign({
                email: user.email,
                name: user.name
              }, process.env.JWT_TOKEN)
              res.status(200).json({ token })
            }
          })
      })
      .then(newUser => {
        const token = jwt.sign({
          email: newUser.email,
          name: newUser.name
        }, process.env.JWT_TOKEN)
        res.status(200).json({ token })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static checkLogin(req, res) {
    User
      .findOne({ _id: req.authenticate.id })
      .select('_id')
        .then(user => {
          res.status(200).json(user)
        })
        .catch(err => {
          res.status(500).json(err)
        })
  }
}

module.exports = UserController