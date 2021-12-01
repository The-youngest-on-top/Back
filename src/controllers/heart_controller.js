const Heart  = require('../models/heart');
const User = require('../models/user');
const Company = require('../models/company');
const Activity = require('../models/activity');
const Activity_image = require('../models/activity_image');
const url = require('url');



exports.add_heart = async (req,res) =>{
    let {user_id, activity_id} = req.body;
    try{
        await Heart.create({
            "activity_id":activity_id,
            "user_id": user_id
        }); 
        res.send({
            "success": true,
            "message": `찜 저장 성공`
        });
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err.message
        });
    }
    
};
exports.get_hearts = async (req,res)=>{
    let {id} = url.parse(req.url, true).query;
    let user_id = id;
    try{
        let result= await Heart.findAll({
            include: [
                {
                  model: Activity,
                  include: [
                    {
                        model : Activity_image,
                        attributes: ["image_url"]
                    },
                    {
                        model: Company,
                        attributes: ["company_name"],
                        required:false
                    }
                  ],
                  attributes: ["activity_name"]
                }
             ],
             attributes: ["activity_id"],
            where:{
                "user_id": user_id
            }
        })
        if(result){
            res.send({
                "success": true,
                "data": result
            });
        }else {
            res.send({
                "success": false,
                "message": "찜 내역이 없습니다."
            });
        }
        
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err.message
        });
    }
    
};

exports.delete_heart = async (req,res)=>{
    let data = req.body;
    try{
        await Heart.destroy({
            where:{
                "activity_id":data.activity_id,
                "user_id": data.user_id
            }
        })  
        res.send({
            "success": true,
            "message": "삭제 성공"
        });
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err.message
        });
    }
    
    
};