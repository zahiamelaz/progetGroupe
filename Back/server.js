//import
const express = require ('express');
 const server = express();
 const apiRouter = require('./routes/apiRouter').router;
  //instantiatio
  server.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.send('Bonjour tous le monde')
  });

//les routes

server.use(express.urlencoded({extended: true}));
server.use(express.json());

server.use('/api',apiRouter)


  //listen to the port
  server.listen(8080,()=>{
    console.log('server 8080 en ecoute')
  })


