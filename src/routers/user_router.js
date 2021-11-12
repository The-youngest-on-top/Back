const express = require('express');
const controller = require('../controllers/user_controller');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const profile_storage = multer.diskStorage({
    // 업로드된 파일명과 서버의 파일명을 동일하게 세팅
    destination(req, file, cb){
        cb(null, 'images/profile_images');
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}__${file.originalname}`);
    }
});
const upload_with_original_file_name= multer({storage: profile_storage});  // 이미지 업로드 (파일명 동일)

router.post('/user',upload_with_original_file_name.single('profile_image'),controller.signup_user);
router.get('/user', controller.get_user);
router.get('/user/profile_image', controller.get_profile_image);
router.delete('/user', controller.delete_user);
router.patch('/user', controller.modify_user);


module.exports = router;