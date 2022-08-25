const express = require('express');
const route = express.Router();
const userCtrl = require('../controlleurs/userCtrl');


route.get('/register',(req,res)=>{res.render('register');})
route.post('/register',userCtrl.addUser)

route.get('/login',(req,res)=>{res.render('login');})
route.post('/login', userCtrl.logUser);


route.get('/',(req,res)=>{res.render('home');})
route.get('/profile',userCtrl.getUserByToken)



//route.get('/profile',userCtrl.getUserById)





module.exports = route;