const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/account_controller');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

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

router.post('/account', upload_with_original_file_name.single('account_image'), controller.register_account)

router.get('/account/account_image', controller.get_account_image)

router.delete('/account', (req,res)=>{
    
})

router.patch('/account', (req,res)=>{
    
})

module.exports = router;