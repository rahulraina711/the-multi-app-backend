const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FlagController = require('../controllers/flag_controller');

router.post("/:id", FlagController.flag_post);

module.exports = router;