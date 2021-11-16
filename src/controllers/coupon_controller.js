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
    console.log(dataJSON[data.coupon_num].coupon_name);
    // let user_data = await User.findAll({
    //     attributes: ['id'],
    //     where: {
    //         "user_id": data.user_id
    //     }
    // })
    
    console.log("확인"+data.user_id)
    await Coupon.create({
        "coupon_num":data.coupon_num,
        "coupon_name": dataJSON[data.coupon_num].coupon_name,
        "price": dataJSON[data.coupon_num].price,
        "publisher": dataJSON[data.coupon_num].publisher,
        "deadline": `${yyyy}-${mm}-${dd}`,
        "user_id": data.user_id
    }); 
    res.send(`${dataJSON[data.coupon_id]} 
                ${data.user_id} 쿠폰 번호 저장 성공`);
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