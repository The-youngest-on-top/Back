const express = require('express');
const router = express.Router();
const User  = require('../models/user');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/user',async (req,res)=>{
    let data = req.body;
    await User.create({
        "user_id":data.user_id,
        "password":data.password,
        "nickname": data.nickname,
        "name": data.name,
        "phone_number":data.phone_number,
        "birthday":data.birthday,
        "email": data.email
    })
    res.json(data);
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