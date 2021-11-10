const express = require('express');
const router = express.Router();
const Account  = require('../models/account');
const multer = require('multer');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    // 업로드된 파일명과 서버의 파일명을 동일하게 세팅
    destination(req, file, cb){
        cb(null, 'images/account_images');
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}__${file.originalname}`);
    }
});
const upload = multer({ 
    dest: 'images/account_images/', // 이미지 업로드 (파일명 암호화)
});
const upload_with_original_file_name= multer({storage: storage});  // 이미지 업로드 (파일명 동일)

router.post('/account', upload_with_original_file_name.single('account_image'), async (req,res)=>{
    let {account_owner, account_number} = req.body;
    let account_image = `${req.file.destination}/${req.file.filename}`;
    console.log(account_image);
    await Account.create({
        "account_owner": account_owner,
        "account_number": account_number,
        "account_image": account_image
    });
    res.send(`소유주: ${account_owner} 계좌번호: ${account_number} 파일: ${account_image}`);
})

router.get('/account', (req,res)=>{
    
})

router.delete('/account', (req,res)=>{
    
})

router.patch('/account', (req,res)=>{
    
})

module.exports = router;