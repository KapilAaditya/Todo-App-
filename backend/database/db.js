require('dotenv').config()
const mongoose = require('mongoose')

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err))

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    complete: { type: Boolean, default: false } 
})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = { Todo }