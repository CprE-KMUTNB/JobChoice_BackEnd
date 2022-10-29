const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('./model/user');
const { UserPost } = require('./model/user');
const { UserPost2 } = require('./model/user')
const auth = require('./middleware/auth');
const { request } = require('https');
const { ObjectID } = require('bson');


app.use(express.json());

mongoose
.connect('mongodb+srv://jobchoice:Jobchoice65@jobchoice.4paiwbc.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useFindAndModify:false
})
.then(() => console.log('MongoDB connected'));
//--------------------------------------------------------------------------------------------------------
app.post('/user/register', async(req,res) =>{
    const newUser = req.body;

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    let createdUser = await User.create(newUser);
    if(!createdUser) return  res.status(500).send('Cannot create user');

    const token = jwt.sign(
        {
            createdUer: createdUser._id,
            code: createdUser.code,
            email: createdUser.email,
            firstname: createdUser.firstname,
            lastname: createdUser.lastname,
            aboutme: createdUser.aboutme
            
        },
        'eyJ1c2VybmFtZSI6InRlc3QiLCJwYXNzd29yZCI6IjEyMzQiLCJmaXJzdG5hbWUiOiJNYWtrcmFwb25nIiwibGFzdG5hbWUiOiJTb21ib29uIiwiY29udHJhY3QiOiIwOTU5MjY5OTg2IiwiYWxnIjoiSFMyNTYifQ',
    );
    res.send({
        message: 'Create user successfully',
        user: createdUser,
        token: token,
    });
});
//--------------------------------------------------------------------------------------------------------
app.post('/user/login', async(req,res) =>{
    
    let user = await User.findOne({email: req.body.email});

    if (!user) return res.send('User not found.',404);

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    delete user.password;
    const token = jwt.sign(
        {
            _id: user._id,
            code: user.code,
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            aboutme: user.aboutme
        },
        'eyJ1c2VybmFtZSI6InRlc3QiLCJwYXNzd29yZCI6IjEyMzQiLCJmaXJzdG5hbWUiOiJNYWtrcmFwb25nIiwibGFzdG5hbWUiOiJTb21ib29uIiwiY29udHJhY3QiOiIwOTU5MjY5OTg2IiwiYWxnIjoiSFMyNTYifQ',
    );
    res.send({
        message: 'Login success',
        user: user,
        token: token,
    });
});
//--------------------------------------------------------------------------------------------------------
app.post('/user/update/:email', async (req,res) =>{

    let user = await User.findOneAndUpdate({email:req.params.email},{
        $set:{
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        aboutme: req.body.aboutme, }
        });
    res.status(200).send({
        message: 'Update Success',
        user: user,
    });
})
//--------------------------------------------------------------------------------------------------------
app.delete('/user/delete/:email', async (req,res,next) =>{
    User.find({email: req.params.email}).deleteOne(function(err, data){
        if(err) throw err;
      }); 
    res.status(200).send("Deleted")
})
//--------------------------------------------------------------------------------------------------------
app.get('/user/get/:email', async (req,res,next) =>{
    let user = await User.findOne({email: req.params.email});
    res.status(200).send(user);
})
//--------------------------------------------------------------------------------------------------------
app.get('/user/get/workerfinding',(req,res,next) =>{
    UserPost2.find().then(result => {
        res.status(200).json({
            user:result
        });
    })
})
//--------------------------------------------------------------------------------------------------------
app.get('/protected',auth, (req, res) => {
    res.send('access Success');
});
//--------------------------------------------------------------------------------------------------------
app.post("/user/post", (req, res) => {
    var myData = new UserPost({
        user: req.body.user,
        JobTitle: req.body.JobTitle,
        requirement: req.body.requirement,
        details: req.body.details,
        Salary: req.body.Salary,
        contact: req.body.contact
    });
    const val = myData.save()
    res.status(200).send("Post Success")
})
//--------------------------------------------------------------------------------------------------------
app.post("/user/post2", (req, res) => {
    console.log(req.body)
    var myData = new UserPost2({
        user: req.body.user,
        JobTitle: req.body.JobTitle,
        ability: req.body.ability,
        details: req.body.delete,
        SalaryNeed: req.body.SalaryNeed,
        contact: req.body.contact
    });
    const val = myData.save()
    res.status(200).send("Post Success")
})
//--------------------------------------------------------------------------------------------------------
const server = app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.express = server;