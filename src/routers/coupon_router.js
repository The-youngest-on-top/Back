const express = require('express');
const controller = require('../controllers/coupon_controller');
const multer = require('multer');
const path = require('path');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/coupon',controller.regist_coupon);
router.get('/coupon', controller.get_coupon);
router.patch('/coupon', controller.modify_coupon);




module.exports = router;