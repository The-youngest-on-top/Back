const Review = require('../models/review');
const User = require('../models/user');
const Activity = require('../models/activity');
const { Op } = require('sequelize');

exports.add_review = async (req,res)=> {
    let data = req.body;
    console.log(data);
    try{
        await Review.create({
            "content": data.content,
            "star": data.star,
            "user_id": data.user_id,
            "activity_id": data.activity_id,
            
        });
    res.send({
        "success": true,
        "message": "review 저장 성공"
    });
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
    
};