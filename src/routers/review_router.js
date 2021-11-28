const express = require('express');
const router = express.Router();
const controller = require('../controllers/review_controller');

router.post('/review', controller.add_review);
router.get('/review', controller.get_review);
router.get('/review/star', controller.get_star_avg);

module.exports = router;