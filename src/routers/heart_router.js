const express = require('express');
const controller = require('../controllers/heart_controller');
const router = express.Router();

router.post('/heart',controller.regist_heart);
router.get('/heart', controller.get_heart);
router.delete('/heart', controller.delete_heart);




module.exports = router;