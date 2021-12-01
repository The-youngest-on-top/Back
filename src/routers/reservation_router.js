const express = require('express');
const controller = require('../controllers/reservation_controller');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/reservation',controller.add_reservation);
router.get('/reservation/orderlist',controller.get_orderlist);
router.get('/reservation/activity',controller.get_activity_reservations);


router.post('/cart',controller.add_cart);
router.get('/cart',controller.get_carts);
router.post('/cart/del',controller.del_cart);

module.exports = router;