const Heart  = require('../models/heart');
const User = require('../models/user');
const Activity = require('../models/activity');
const path = require('path');



exports.regist_heart = async (req,res) =>{
    let data = req.body;

    console.log("확인"+data.user_id)
    await Heart.create({
        "activity_id":data.activity_id,
        "user_id": data.user_id
    }); 
    res.send(`${data.user_id} 찜 저장 성공`);
};

exports.get_coupon = async (req,res)=>{
    let user_id = req.body.user_id;
    console.log(user_id);
    let result= await Coupon.findAll({
        where:{
            "user_id": user_id
        }
    })
    console.log(result);
    res.send(result);
};

// exports.get_profile_image = async (req,res)=>{
//     let user_id = req.body.user_id;
//     let project_path = path.resolve("./");
//     let user_data= await User.findOne({
//         attributes:['profile_image'],
//         where:{
//             "user_id": user_id
//         }
//     })
//     console.log(`${project_path}/${user_data.profile_image}`);
//     res.sendFile(`${project_path}/${user_data.profile_image}`);
// };

// exports.delete_user = async (req,res)=>{
//     let user_id = req.body.user_id;
//     await User.destroy({
//         where:{
//             "user_id": user_id
//         }
//     })
    
//     res.send(`${user_id}   삭제`);
// };

exports.modify_coupon = async (req,res)=>{
    let {user_id, coupon_num} = req.body;
    console.log(user_id);

    await Coupon.update({"validity":0},{where:{"user_id":user_id, "coupon_num":coupon_num}});
    res.send(`${coupon_num}   쿠폰사용`);

    // console.log(result);
    // res.send(result);
    
};