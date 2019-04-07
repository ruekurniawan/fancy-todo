const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  name: String,
  description: String,
  status: {
    type: Boolean,
    default: false
  },
  due_date: Date,
  userId : {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Todo = mongoose.model('todo', todoSchema)

module.exports = Todo