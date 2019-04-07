const Todo = require('../models/todo')

class TodoController {
  static create(req, res) {
    
    Todo
      .create({
        name: req.body.name,
        description: req.body.description,
        due_date: req.body.due_date,
        userId: req.authenticate.id
      })
      .then(todo => {
        res.status(201).json(todo)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static findAll(req, res) {
    console.log()
    Todo
      .find({userId: req.authenticate.id})
      .then(todos => {
        res.status(200).json(todos)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static findOne(req, res) {    
    Todo
      .findOne({_id : req.params.id})
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static update(req, res) {
    Todo
      .findOneAndUpdate(
        {
          _id : req.params.id,
          userId: req.authenticate.id
        },
        {
          name: req.body.name,
          description: req.body.description,
          status: req.body.status,
          due_date: req.body.due_date
        }, {new : true})
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static remove(req, res) {
    Todo
      .deleteOne({
        _id: req.params.id,
        userId: req.authenticate.id
      })
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
}

module.exports = TodoController