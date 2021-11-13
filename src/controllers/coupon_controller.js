const Coupon  = require('../models/coupon');
const User = require('../models/user')
const path = require('path');
const fs = require('fs')



exports.regist_coupon = async (req,res) =>{
    let data = req.body;
    let project_path = path.resolve("./");
    let today = new Date();
    today.setHours(today.getHours());
    let dd = today.getDate();
    let mm = today.getMonth()+2;
    let yyyy = today.getFullYear();
    const dataBuffer = fs.readFileSync(`${project_path}/coupon/coupon_list.json`);
    const dataJSON = JSON.parse(dataBuffer);
    console.log(dataJSON[data.coupon_id].coupon_name);
    let user_data = await User.findAll({
        attributes: ['id'],
        where: {
            "id": data.id
        }
    })
    console.log("확인"+user_data.id)
    await Coupon.create({
        "coupon_name": dataJSON[data.coupon_id].coupon_name,
        "price": dataJSON[data.coupon_id].price,
        "publisher": dataJSON[data.coupon_id].publisher,
        "deadline": `${yyyy}-${mm}-${dd}`,
        "user_id": user_data.id
    });

    
    // if(coupon_data[data.coupon_num] == "")
    // await Coupon.create({
    //     "user_id":data.user_id,
    //     "password":data.password,
    //     "profile_image": profile_image,
    //     "nickname": data.nickname,
    //     "name": data.name,
    //     "phone_number":data.phone_number,
    //     "birthday":data.birthday,
    //     "email": data.email
    // })
    

    res.send(`${dataJSON[data.coupon_id]} 
                ${data.user_id} 쿠폰 번호 저장 성공`);
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