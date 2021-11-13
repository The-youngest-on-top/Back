const express = require('express');
const controller = require('../controllers/coupon_controller');
const multer = require('multer');
const path = require('path');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/coupon',controller.regist_coupon);
router.get('/user', controller.get_user);
router.get('/user/profile_image', controller.get_profile_image);
router.delete('/user', controller.delete_user);
router.patch('/user', controller.modify_user);


module.exports = router;