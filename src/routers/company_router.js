const express = require('express');
const router = express.Router();
const controller = require('../controllers/company_controller');
const multer = require('multer');
const Company = require('../models/company');



const account_storage = multer.diskStorage({
    // 업로드된 파일명과 서버의 파일명을 동일하게 세팅
    destination(req, file, cb){
        cb(null, 'images/account_images');
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}__${file.originalname}`);
    }
});
const upload_with_original_file_name= multer({storage: account_storage});  // 이미지 업로드 (파일명 동일)

router.post('/company', upload_with_original_file_name.single('account_image'), controller.signup_company);
router.get('/company', controller.get_company);
router.delete('/company',controller.delete_company);


module.exports = router
