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
exports.get_heart = async (req,res)=>{
    let user_id = req.body.user_id;
    console.log(user_id);
    let result= await Heart.findAll({
        include: [
            {
              model: Activity
            }
         ],
        where:{
            "user_id": user_id
        }
    })
    console.log(result);
    res.send(result);
};

exports.delete_heart = async (req,res)=>{
    
    let data = req.body;
    await Heart.destroy({
        where:{
            "activity_id":data.activity_id,
            "user_id": data.user_id
        }
    })
    
    res.send(`${data.user_id}   삭제`);
    
};