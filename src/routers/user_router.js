const express = require('express');
const controller = require('../controllers/user_controller');
const path = require('path');
const router = express.Router();


router.post('/user',upload.single('profile_image'),controller.signup_user);
router.get('/user', controller.get_user);
router.get('/user/profile_image', controller.get_profile_image);
router.delete('/user', controller.delete_user);
router.patch('/user', controller.modify_user);


module.exports = router;