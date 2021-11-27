const express = require('express');
const controller = require('../controllers/coupon_controller');
const router = express.Router();


router.post('/coupon',controller.regist_coupon);
router.get('/coupon', controller.get_coupon);
router.patch('/coupon', controller.modify_coupon);




module.exports = router;