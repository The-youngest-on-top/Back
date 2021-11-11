const express = require('express');
const router = express.Router();
const User  = require('../models/user');
const multer = require('multer');
const path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

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

router.post('/user',upload_with_original_file_name.single('profile_image'),async (req,res)=>{
    let data = req.body;
    let profile_image = `${req.file.destination}/${req.file.filename}`;
    await User.create({
        "user_id":data.user_id,
        "password":data.password,
        "profile_image": profile_image,
        "nickname": data.nickname,
        "name": data.name,
        "phone_number":data.phone_number,
        "birthday":data.birthday,
        "email": data.email
    })
    res.send(`${data.user_id} 저장 성공`);
});

router.get('/user', async (req,res)=>{
    let user_id = req.body.user_id;
    let result= await User.findAll({
        where:{
            "user_id": user_id
        }
    })
    console.log(result);
    res.send(result);
});

router.get('/user/profile_image', async (req,res)=>{
    let user_id = req.body.user_id;
    let project_path = path.resolve("./");
    let user_data= await User.findOne({
        attributes:['profile_image'],
        where:{
            "user_id": user_id
        }
    })
    console.log(`${project_path}/${user_data.profile_image}`);
    res.sendFile(`${project_path}/${user_data.profile_image}`);
});


router.delete('/user', async (req,res)=>{
    let user_id = req.body.user_id;
    await User.destroy({
        where:{
            "user_id": user_id
        }
    })
    
    res.send(`${user_id}   삭제`);
});

router.patch('/user', async (req,res)=>{
    let modify = req.body.modify_id;
    let user_id = req.body.user_id;
    let password = req.body.password;
    let nickname = req.body.nickname;
    // await User.update({
    //     comment: user_id,
    // }, {
    //     where: { id: 2 },
    // });
    if(modify==1)
    {
        await User.update({password:password},{where:{user_id:user_id}});
        res.send(`${user_id}   패스워드만 수정`);
    }
    else if(modify==2)
    {
        await User.update({nickname:nickname},{where:{user_id:user_id}});
        res.send(`${user_id}   닉네임만 수정`);
    }
    else if(modify==3)
    {
        await User.update({password:password, nickname:nickname},{where:{user_id:user_id}});
        res.send(`${user_id}   둘다 수정`);
    }
});


module.exports = router;