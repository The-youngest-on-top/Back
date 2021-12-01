const express = require('express');
const router = express.Router();
const {review_upload} = require('../models/multer');
const controller = require('../controllers/review_controller');

router.post('/review', controller.add_review);
router.get('/review', controller.get_review);
router.get('/review/star', controller.get_star_avg);
router.post('/review/modify', controller.modify_review);
router.post('/review/delete', controller.delete_review);

module.exports = router;