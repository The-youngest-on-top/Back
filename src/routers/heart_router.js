const express = require('express');
const controller = require('../controllers/heart_controller');
const router = express.Router();

router.post('/heart',controller.add_heart);
router.get('/hearts', controller.get_hearts);
router.delete('/heart', controller.delete_heart);




module.exports = router;