const express = require('express');
const router = express.Router();

const { validateToken } = require('../../middlewares/AuthMiddleware.js');

const LoginState = require('./LoginState.js');
router.get('/', validateToken, LoginState);

const GetUserList = require('./GetUserList.js');
router.get('/adminLNRnUy7s5T', validateToken, GetUserList);

const GetUserListById = require('./GetUserListById.js');
router.post('/admincrhinqi', validateToken, GetUserListById);

const SignUp = require('./SignUp.js');
router.post('/signup', SignUp);

const SignIn = require('./SignIn.js');
router.post('/signin', SignIn);

const UpdateNickname = require('./UpdateNickname.js');
router.put('/update/nickname', validateToken, UpdateNickname);

const UpdatePassword = require('./UpdatePassword.js');
router.put('/update/password', validateToken, UpdatePassword);

const UpdateProfileImg = require('./UpdateProfileImg.js');
router.put('/update/profileimg', validateToken, UpdateProfileImg);

const DeleteProfileImg = require('./DeleteProfileImg.js');
router.put('/delete/profileimg', validateToken, DeleteProfileImg);

const DeleteAccount = require('./DeleteAccount.js');
router.delete('/delete', validateToken, DeleteAccount);

const Admin = require('./Admin.js');
router.post('/admin', Admin);

module.exports = router;
