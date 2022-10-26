const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user: String,
    JobTitle: String,
    Requirement: String,
    Selary: String,
    Detail: String
});

const Post = mongoose.model('findworker', postSchema)

exports.Post = Post;