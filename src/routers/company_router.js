const express = require('express');
const router = express.Router();
const controller = require('../controllers/company_controller');
const {account_upload} = require('../models/multer');


router.post('/company', account_upload.single('account_image'), controller.signup_company);
router.get('/company', controller.get_company);
router.delete('/company',controller.delete_company);


module.exports = router
