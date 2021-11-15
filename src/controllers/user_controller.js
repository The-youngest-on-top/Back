const User  = require('../models/user');
const path = require('path');

exports.signup_user = async (req,res) =>{
    let data = req.body;
    let profile_image = `${req.file.destination}/${req.file.filename}`;
    await User.create({
        "id":data.user_id,
        "password":data.password,
        "profile_image": profile_image,
        "nickname": data.nickname,
        "name": data.name,
        "phone_number":data.phone_number,
        "birthday":data.birthday,
        "email": data.email
    })
    res.send(`${data.user_id} 저장 성공`);
};

exports.get_user = async (req,res)=>{
    let user_id = req.body.user_id;
    let result= await User.findAll({
        where:{
            "user_id": user_id
        }
    })
    console.log(result);
    res.send(result);
};

exports.get_profile_image = async (req,res)=>{
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
};

exports.delete_user = async (req,res)=>{
    let user_id = req.body.user_id;
    await User.destroy({
        where:{
            "user_id": user_id
        }
    })
    
    res.send(`${user_id}   삭제`);
};

exports.modify_user = async (req,res)=>{
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
};