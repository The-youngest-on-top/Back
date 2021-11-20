const express = require('express');
const controller = require('../controllers/reserve_controller');
const multer = require('multer');
const path = require('path');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/reserve',controller.regist_heart);
router.get('/heart', controller.get_heart);
router.delete('/heart', controller.delete_heart);

module.exports = router;