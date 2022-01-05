const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    username: String,
    password: String
})