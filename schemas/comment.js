const mongoose = require('mongoose');


// schema is like a blueprint to make models
const commentSchema = new mongoose.Schema({
  header: String,
  content: String,
  date: Date
})

module.exports = { 
  model: mongoose.model('Comment', commentSchema),
  commentSchema
}