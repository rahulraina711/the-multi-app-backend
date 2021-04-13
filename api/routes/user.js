const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller');
const auth = require('../middleware/auth')

router.get('/signin', UserController.sign_in);

router.get('/:id',UserController.get_user);

router.patch('/:id',auth, UserController.set_user);

module.exports = router;