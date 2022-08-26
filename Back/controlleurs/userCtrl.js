const bcrypt = require('bcrypt');
var jwtUtils = require ('../utils/jwtUtils');
const models = require('../models');
var asyncLib = require('async');

// const
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$/;
//routes
module.exports = {
    adUser: (req,res)=>{
        //parameters
      
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        

        if( username == '' || email == '' || password == ''){
            return res.status(400).json({'error': 'champs vides'})
        };
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email invalid' });
        };
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'invalid password ( doit contenir au moins: 1 majuscule, 1 miniscule,1 chiffre et 1 caracter speciale' });
        }
        //waterfall
        asyncLib.waterfall([
            (done)=> {
                models.user.findOne({
                  attributes: ['email'],
                  where: { email: email }
                })
                .then((userFound)=> {
                  done(null, userFound);
                })
                .catch((err)=> {
                  return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
  
            (userFound, done) =>{
                if (!userFound) {
                  bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                    done(null, userFound, bcryptedPassword);
                  });
                } else {
                  return res.status(409).json({ 'error': 'user exist déja' });
                }
            },
  
            (userFound, bcryptedPassword, done)=> {
                var newUser = models.user.create({
                  email: email,
                  password: bcryptedPassword,
                  username: username,
                 
                })
                .then(function(newUser) {
                  done(newUser);
                })
                .catch(function(err) {
                  return res.status(500).json({ 'error': 'cannot add user' });
                });
            }

        ],(newUser) =>{
            if (newUser) {
              return res.status(201).json({'message': 'User successfully created', newUser});
            } else {
              return res.status(500).json({ 'error': 'cannot add user' });
            }
        });  
    },
    getUser:(req, res)=> {

        var headerAuth = req.headers['authorization'];
        var userid = jwtUtils.getUserId(headerAuth);
        console.log(headerAuth, '-----ici---', userid)
        
        if (userid < 0)
        
            return res.status(400).json({ 'error': 'wrong token' });
        
        models.user.findOne({
            attributes: [ 'id', 'email', 'username'],
             where: { id: userid }
        }).then((user) =>{
            if (user) {
            res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }).catch((err) =>{
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },
    // getAllUsers: function(req, res) {
    
    //     models.User.findAll({
    //         attributes: [ 'id', 'email', 'firstName', 'lastName', 'bio', 'isAdmin' ]
    //     }).then(function(user) {
    //         if (user) {
    //         res.status(201).json(user);
    //         } else {
    //             res.status(404).json({ 'error': 'No user found' });
    //         }
    //     }).catch(function(err) {
    //       console.log(err)
    //         res.status(500).json({ 'error': 'cannot fetch user' });
    //     });
    //     },

    login: function (req, res){

        // params
        var email = req.body.email;
        var password = req.body.password;

        if (email == '' || password == '') {
            return res.status(400).json({ 'error': 'missing parameters'});
        }

        // verify  var
        asyncLib.waterfall([
            function(done) {
              models.user.findOne({
                where: { email: email }
              })
              .then(function(userFound) {
                done(null, userFound);
              })
              .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
              });
            },
            function(userFound, done) {
              if (userFound) {
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                  done(null, userFound, resBycrypt);
                });
              } else {
                return res.status(404).json({ 'error': 'user not exist in DB' });
              }
            },
            function(userFound, resBycrypt, done) {
              if(resBycrypt) {
                done(userFound);
              } else {
                return res.status(403).json({ 'error': 'invalid password' });
              }
            }
          ], function(userFound) {
            if (userFound) {
              return res.status(201).json({
                'userId': userFound.id,
                'token': jwtUtils.generateTokenForUser(userFound)
              });
            } else {
              return res.status(500).json({ 'error': 'cannot log on user' });
            }
          });
        },

        getAllUsers: (request, response) => {
          models.user.findAll({
              attributes: [ 'id', 'email', 'username']
              })
          .then(data => {
              if (data) {
                  response.status(200).send(data);
              }
          })
          .catch(err => {
              response.status(400).send({
                  message: "An error occurred : while retrieving Users."
              });
          });
        },
        putUser: function(req, res) {

          var headerAuth = req.headers['authorization'];
          var userId = jwtUtils.getUserId(headerAuth);
          
          // Params
         
          let username = req.body.username;
          
          asyncLib.waterfall([
              function(done) {
              models.user.findOne({
                  attributes: ['id', 'username','email'],
                  where: { id: userId }
              }).then(function (userFound) {
                  done(null, userFound);
              }).catch(function(err) {
                  console.log(err)
                  return res.status(500).json({ 'error': 'unable to verify user' });
              });
          },
              function(userFound, done) {
              if(userFound) {
                  userFound.update({
                 
                  username : (username ? username : userFound.username),
                 
                  }).then(function() {
                      done(userFound);
                  }).catch(function(err) {
                      res.status(500).json({ 'error': 'cannot update user' });
                  });
              } else {
                  res.status(404).json({ 'error': 'user not found' });
              }
              },
          ], function(userFound) {
              if (userFound) {
                  return res.status(200).json({ 'message': 'User successfully updated' });
              } else {
                  return res.status(500).json({ 'error': 'cannot update user profile' });
              }
          });
      },





}
