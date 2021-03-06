const express = require('express');
const router = express.Router();
const controller = require('../controllers/search_controller');

router.post('/activity',activity_upload.array("activity_images"),controller.add_activity);
router.get('/activity', controller.get_activities);
router.get('/activity/location', controller.get_location_activities);
router.get('/activity/images', controller.get_activity_images);
router.delete('/activity', controller.delete_activity);
module.exports = router;