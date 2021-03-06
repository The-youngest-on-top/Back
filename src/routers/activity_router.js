const express = require('express');
const router = express.Router();
const {activity_upload} = require('../models/multer');
const controller = require('../controllers/activity_controller');

router.post('/activity',activity_upload.array("activity_images"),controller.add_activity);
router.post('/activity/modify',controller.modify_activity);
router.get('/activities', controller.get_activities);
router.get('/activity', controller.get_activity);
router.get('/activity/location/:location', controller.get_location_activities);
router.get('/activity/category/:category', controller.get_category_activities);
router.get('/activity/search', controller.search_activities);
router.get('/activity/images', controller.get_activity_images);
router.post('/activity/images',activity_upload.array("activity_images"), controller.add_activity_image);
router.delete('/activity', controller.delete_activity);
router.post('/activity/times', controller.set_activity_times);
router.get('/activity/times', controller.get_activity_times);
module.exports = router;