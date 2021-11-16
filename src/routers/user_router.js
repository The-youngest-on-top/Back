const express = require('express');
const controller = require('../controllers/user_controller');
const path = require('path');
const router = express.Router();
const multerS3 = require('multer-s3');
const multer = require('multer');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: "AKIA3KTIC4SMAPUUNQHQ",
    secretAccessKey: "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",
    region: 'ap-northeast-2',
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'extreme-cbnu',
    key(req, file, cb) {
      cb(null, `account-images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
});


router.post('/user',upload.single('profile_image'),controller.signup_user);
router.get('/user', controller.get_user);
router.get('/user/profile_image', controller.get_profile_image);
router.delete('/user', controller.delete_user);
router.patch('/user', controller.modify_user);


module.exports = router;