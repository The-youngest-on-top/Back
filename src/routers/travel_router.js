const express = require('express');
const router = express.Router();
const {travel_upload} = require('../models/multer');
const controller = require('../controllers/travel_controller');

router.post('/travel',travel_upload.array("travel_images"),controller.add_travel);
router.get('/activity', controller.get_activity);
router.get('/activity/location', controller.get_location_activities);
router.get('/activity/images', controller.get_activity_images);
router.delete('/activity', controller.delete_activity);
module.exports = router;