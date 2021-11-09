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


module.exports = router;