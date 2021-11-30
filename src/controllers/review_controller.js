const Review = require('../models/review');
const Review_image = require('../models/review_image');
const User = require('../models/user');
const Activity = require('../models/activity');
const url = require('url');
const { Op } = require('sequelize');

exports.add_review = async (req,res)=> {
    let images = req.files;
    let data = req.body;
    let sum = 0;
    try{
        await Review.create({
            "content": data.content,
            "star": data.star,
            "user_id": data.user_id,
            "activity_id": data.activity_id,
            
        });
        let result= await Review.findAll({
            where:{
                "activity_id": data.activity_id
            },
            attributes: ["star"],
        })
        result.forEach(element => {
            sum+= element.star;
            console.log(element.star);
        });
        const avg = sum/result.length;
        await Activity.update({
            star: avg
        },{
            where:{
                id: data.activity_id
            }
        });
        let review = await Review.findOne({
            attributes: ['id'],
            where: {
                "content": data.content
            }
        })
        console.log(review.id);
        for(let i = 0; i<images.length; i++){
            let review_image = `${images[i].location}`;
            await Review_image.create({
                "image_url": review_image,
                "review_id": review.id
            })
            console.log(images[i].filename);
        }
    res.send({
        "success": true,
        "message": "review 저장 성공"
    });
    } catch(err){
        res.send({
            "success": false,
            "message": err.message
        });
    }
};

exports.get_review = async (req,res)=>{
    let data = url.parse(req.url, true).query;
    let activity_id = data.activity_id;
    try{
        let result= await Review.findAll({
            include: [
                {
                    model: User,
                    attributes: ["nickname", "profile_image"],
                    required:false
                }
            ],
            where:{
                "activity_id": activity_id
            },
            attributes: ["id", "content", "star", "user_id", "activity_id"],
        })
        console.log(result);
        if(result.length){
            res.send({
                "success": true,
                "data": result
            });
        }else{
            res.send({
                "success": false,
                "message": "해당 액티비티의 리뷰가 없습니다."
            });
        }
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
};

exports.get_star_avg = async (req,res)=>{
    let data = url.parse(req.url, true).query;
    let sum = 0;
    let activity_id = data.activity_id;
    try{
        let result= await Review.findAll({
            where:{
                "activity_id": activity_id
            },
            attributes: ["star"],
        })
        result.forEach(element => {
            sum+= element.star;
            console.log(element.star);
        });
        
        const avg = sum/result.length;
        console.log(avg);
        if(result.length){
            res.send({
                "success": true,
                "data": avg
            });
        }else{
            res.send({
                "success": false,
                "message": "해당 액티비티의 리뷰가 없습니다."
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

exports.modify_review = async (req,res)=>{
    let data = req.body;
    
    try{
        let result = await Review.update({
            "content": data.content,
            "star": data.star,
            
        },{
            where: {"id": data.review_id, "user_id": data.user_id},
        });
        console.log(result);

        if(result==1){
            res.send({
                "success": true,
                "message": "review 수정 성공"
            });
        }else{
            res.send({
                "success": false,
                "message": "해당 리뷰의 작성자가 아님"
            });
        }
        
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
};

exports.delete_review = async (req,res)=>{
    let data = req.body;
    
    try{
        let result = await Review.destroy({
            where: {"id": data.review_id, "user_id": data.user_id}, 
         });
        
         if(result==1){
            res.send({
                "success": true,
                "message": "review 삭제 성공"
            });
        }else{
            res.send({
                "success": false,
                "message": "해당 리뷰의 작성자가 아님"
            });
        }
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
};