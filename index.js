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
        message: 'Success',
        user: user,
    });
});
//--------------------------------------------------------------------------------------------------------
app.post('/user/update/:id', async (req,res) =>{

    let user = await User.findOneAndUpdate({_id:req.params.id},{
        $set:{
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        aboutme: req.body.aboutme, }
        });
    res.send({
        message: 'Success',
        user: user,
    });
})
//--------------------------------------------------------------------------------------------------------
app.delete('/user/delete/:id', async (req,res,next) =>{
    User.find({_id: req.params.id}).deleteOne(function(err, data){
        if(err) throw err;
          res.send('Deleted'); 
      }); 
})
//--------------------------------------------------------------------------------------------------------
app.get('/user/get/:id', async (req,res,next) =>{
    User.findById(req.params.id).then(result => {
        res.status(200).send(result)
    })
})
//--------------------------------------------------------------------------------------------------------
app.get('/protected',auth, (req, res) => {
    res.send('access Success');
});
//--------------------------------------------------------------------------------------------------------
app.post("/user/post", (req, res) => {
    var myData = new UserPost(req.body);
    myData.save()
    .then(item => {
    res.send("item saved to database");
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
   });
//--------------------------------------------------------------------------------------------------------
app.post("/user/post2", (req, res) => {
    var myData = new UserPost2(req.body);
    myData.save()
    .then(item => {
    res.send("item saved to database");
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
   });
//--------------------------------------------------------------------------------------------------------
const server = app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.express = server;