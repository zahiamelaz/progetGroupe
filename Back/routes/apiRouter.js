//import
const express = require('express');
const userCtrl = require('../controlleurs/userCtrl');
const messageCtrl = require('../controlleurs/messageCtrl')

// Router
exports.router = (()=>{
    const apiRouter = express.Router();

    //route user
apiRouter.route('/register').post(userCtrl.adUser);
apiRouter.route('/login').post(userCtrl.login)
// apiRouter.route('/logout').post(userCtrl.logout)
apiRouter.route('/user/:id').get(userCtrl.getUser);
apiRouter.route('/allusers').get(userCtrl.getAllUsers);
// rouapiRouterter.route('/updateUser').put(userCtrl.updateUser);
// apiRouter.route('/deleteUser').delete(userCtrl.deleteUser);

//route message
// apiRouter.route('/message').get(messageCtrl.getMessage);
// apiRouter.route('/usermessage').post(messageCtrl.adMessager);
// apiRouter.route('/updatemessage').put(messageCtrl.updateMesage);
// apiRouter.route('/deletemassage').delete(messageCtrl.deleteMessage);

return apiRouter;
})();
