const mongoose = require('mongoose')
const Schema = mongoose.Schema
const hash = require('../helpers/bcrypt').hash

let userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.'],
    validate: {
      validator: function (value) {
        return User.findOne({
          email: value,
          _id: { $ne: this._id }
        })
        .then(user => {
          // console.log(user);
          if(user) {
            throw 'Email has been used'
          }
        })
        .catch(err => { 
          throw err
        })
      }
    }
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'Your password must be at least six characters']
  }
})

userSchema.pre('save', function (next) {
  this.password = hash(this.password)
  next()
})

let User = mongoose.model('user', userSchema)

module.exports = User