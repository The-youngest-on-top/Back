const express = require('express');
const router = express.Router();
const controller = require('../controllers/company_controller');
const {account_upload} = require('../models/multer');


router.post('/company', account_upload.single('account_image'), controller.signup_company);
router.post('/company/modify', controller.modify_company);
router.get('/company', controller.get_company);
router.post('/company/login',controller.login);
router.delete('/company',controller.delete_company);


module.exports = router
