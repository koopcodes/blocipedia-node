const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../../src/db/models').User;
const validation = require('./validation');

router.get('/users/sign_up', validation.validateUsers, userController.signUp);
router.get('/users/sign_in', userController.signInForm);
router.post('/users/sign_in', validation.validateUsersSignIn, userController.signIn);
router.get('/users/sign_out', userController.signOut);
router.post('/users', validation.validateUsers, userController.create);
router.get('/users/:id', userController.show);
router.post('/users/:id/upgrade', userController.payment);
router.post('/users/:id/downgrade', userController.downgrade);
router.get('/users/collaborations', userController.showCollaborations);

module.exports = router;
