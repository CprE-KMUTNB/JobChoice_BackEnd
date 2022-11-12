const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    aboutme: String,
    file:String
});

const userPost = new mongoose.Schema({
    post:String,
    email:String,
    user: String,
    JobTitle: String,
    requirement: String,
    details: String,
    Salary: String,
    contact: String,
    file:String
});

const userPost2 = new mongoose.Schema({
    post:String,
    email:String,
    user: String,
    JobTitle: String,
    ability: String,
    details: String,
    SalaryNeed: String,
    contact: String,
    file:String
});

const User = mongoose.model('email', userSchema)
const UserPost = mongoose.model('findworker', userPost)
const UserPost2 = mongoose.model('findjob', userPost2)

exports.User = User;
exports.UserPost = UserPost;
exports.UserPost2 = UserPost2;