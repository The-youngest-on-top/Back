const express = require('express');
const controller = require('../controllers/heart_controller');
const multer = require('multer');
const path = require('path');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/heart',controller.regist_heart);
router.get('/heart', controller.get_heart);
router.delete('/heart', controller.delete_heart);




module.exports = router;