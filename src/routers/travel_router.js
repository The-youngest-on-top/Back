const express = require('express');
const router = express.Router();
const {travel_upload} = require('../models/multer');
const controller = require('../controllers/travel_controller');

router.post('/travel',travel_upload.array("travel_images"),controller.add_travel);
router.get('/travel', controller.get_location_travel);
router.get('/travel/images', controller.get_travel_images);
module.exports = router;