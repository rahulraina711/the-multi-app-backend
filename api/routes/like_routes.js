const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Likes_controller = require('../controllers/likes_controller');

router.put('/:id',auth, Likes_controller.add_like);

router.put('/unlike/:id',auth, Likes_controller.remove_like);

module.exports = router