const express = require('express');
const router = express.Router();
const controller = require('../controllers/review_controller');

router.post('/review', controller.add_review);

module.exports = router;