const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/user',(req,res)=>{
    let data = req.body;
    
    User.create({
        id: 1,
        user_id:"eunseo22",
        password:"12345",
        nickname:"genius",
        name:"김은서",
        phone_number:"010-0000-0000",
        birthday:"20000119",
        email:"kim@naver.com"
    })
    
    res.json(data);
});


module.exports = router;