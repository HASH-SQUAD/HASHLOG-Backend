const express = require('express');
const router = express.Router();

const { validateToken } = require('../../middlewares/AuthMiddleware.js');

const LoginState = require('./LoginState.js');
router.get('/', validateToken, LoginState);

const SignUp = require('./SignUp.js');
router.post('/signup', SignUp);

const SignIn = require('./SignIn.js');
router.post('/signin', SignIn);

const UpdateNickname = require('./UpdateNickname.js');
router.put('/update/nickname', validateToken, UpdateNickname);

const UpdatePassword = require('./UpdatePassword.js');
router.put('/update/password', validateToken, UpdatePassword);

const DeleteAccount = require('./DeleteAccount.js');
router.delete('/delete', validateToken, DeleteAccount);

const Admin = require('./Admin.js');
router.post('/admin', Admin);

module.exports = router;
