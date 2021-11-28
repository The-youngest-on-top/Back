const Activity = require('../models/activity');
const Activity_image = require('../models/activity_image');
const Company = require('../models/company');
const Activity_time = require('../models/activity_time');
var url = require('url');
const { Op } = require('sequelize');
const { Review } = require('../models');

exports.add_activity = async (req,res)=> {
    let images = req.files;
    let data = req.body;
    try{
        let license_image = images[0].location
    await Activity.create({
        "activity_category": data.activity_category,
        "activity_name": data.activity_name,
        "activity_price": data.activity_price,
        "location": data.location,
        "address": data.address,
        "license_image": license_image,
        "company_id": data.company_id,
        
    });
    let activity = await Activity.findOne({
        attributes: ['id'],
        where: {
            "activity_name": data.activity_name,
            "company_id":  data.company_id
        }
    })
    for(let i = 1; i<images.length; i++){
        let activity_image = `${images[i].location}`;
        await Activity_image.create({
            "image_url": activity_image,
            "activity_id": activity.id
        })
        console.log(images[i].filename);
    }
    res.send({
        "success": true,
        "message": "activity 저장 성공"
    });
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
    
};

exports.add_time = async (req,res) => {
    let data = req.body;
    let activity = await Activity.findOne({
        attributes: ['id'],
        where: {
            "activity_name": data.activity_name,
            "company_id":  data.company_id
        }
    })
    
}

exports.get_activities = async (req,res) =>{    
    try{
        let activities = await Activity.findAll({
            include: [
                {
                    model: Activity_image,
                    attributes: ["image_url"],
                    required:false
                }
            ],
            attributes: ["activity_category", "activity_name", "activity_price", "location", "created_at"],
        })
        console.log(activities.created_at);
        console.log(activities);
        res.send({
            "success": true,
            "data": activities
        })
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
}

exports.get_activity = async (req,res)=>{
    data = url.parse(req.url, true).query;
    let activity_id  = data.id;
    try{    
        let activity = await Activity.findOne({
            include: [
                {
                    model: Activity_image,
                    attributes: ["image_url"],
                    required:false
                },
                {
                    model: Company,
                    attributes: ["company_name"],
                    required:false
                }
            ],
            attributes: ["id","activity_category", "activity_name", "activity_price", "location", "created_at"],
            where: {
                "id": activity_id,
            }
        });
        res.send({
            "success": true,
            "data": activity
        });
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err
        });
    }
    
};

exports.get_location_activities = async (req,res)=>{
    let {location} =  req.params;
    console.log(location);
    try{
        let activity = await Activity.findAll({
            include: [
                {
                    model: Activity_image,
                    attributes: ["image_url"],
                    required:false
                },
                {
                    model: Company,
                    attributes: ["company_name"],
                    required:false
                }
            ],
            attributes: ["id","activity_category", "activity_name", "activity_price", "location", "created_at"],
            where: {
                "location": location 
            }
        });
        if(activity.length){
            res.send({
                "success": true,
                "data": activity
            });
        }
        else {
            res.send({
                "success": false,
                "message": "해당 지역에 activity가 없습니다."
            });
        }
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err
        });
    }
    
};

exports.get_category_activities = async(req,res)=>{
    let {category} = req.params;
    try{
        let activity = await Activity.findAll({
            include: [
                {
                    model: Activity_image,
                    attributes: ["image_url"],
                    required:false
                },
                {
                    model: Company,
                    attributes: ["company_name"],
                    required:false
                }
            ],
            attributes: ["activity_category", "activity_name", "activity_price", "location",  "created_at"],
            where: {
                "activity_category": category 
            }
        });
        if(activity.length){
           
            res.send({
                "success": true,
                "data": activity
            });
        }
        else {
            res.send({
                "success": false,
                "message": "해당 카테고리에 activity가 없습니다."
            });
        }
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err.message
        });
    }
}

exports.search_activities = async (req,res)=>{
    data = url.parse(req.url,ture).query;
    let data = data.keyword;
    try{
        let activity = await Activity.findAll({
            include: [
                { 
                    model: Company,  
                    attributes: ["company_name"] },
                
              ],
            attributes: ["activity_category", "activity_name", "activity_price", "location", "address", "company_id"],
            where: {
                [Op.or]: [{ "location": data }, {"activity_category": data }],
                
            }
        });
        console.log(activity);
            const company = await Activity.findAll({
                include: [
                  { model: Company,  
                    where:{
                        "company_name": data
                    },
                    attributes: ["company_name"] },
                  
                ],
                attributes: ["activity_category", "activity_name", "activity_price", "location", "address", "company_id"],
            });
            if(company.length){
                res.send({
                    "success": true,
                    "data": company
                });
            }
            else if(activity.length){
                res.send({
                    "success": true,
                    "data": activity
                });
            }
            else{
                res.send({
                    "success": false,
                    "message": "해당 검색결과가 없습니다."
                });
            }            
        } catch(err){
            console.log(err);
            res.send({
                "success": false,
                "message": err
            });
    }
};

exports.get_activity_images = async (req,res)=>{
    let {activity_name} = req.body;
    let activity = await Activity.findOne({
        where: {
            "activity_name": activity_name 
        }
    });
    let images = await Activity_image.findAll({
        attributes: ['image_url'],
        where: {
            "activity_id": activity.id
        }
    })
    console.log(images);
    res.send(images);

}

exports.delete_activity = async (req,res)=>{
    let {activity_name} = req.body;
    try{
        Activity.destroy({
            where:{
                "activity_name": activity_name
            }
        })
        console.log(`${activity_name} 삭제`)
        res.send({
            "success": true,
            "message": `${activity_name} 삭제`
        });
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
    
};

exports.set_activity_times = async(req,res) =>{
    let {activity_id, times} = req.body;
    try{
        await times.forEach(time => {
            Activity_time.create({
                "date": time.date,
                "hour": time.hour,
                "activity_id": activity_id
            })
        });
        res.send({
            "success": true,
            "message": `activity_id:${activity_id} 예약 가능 시간 추가 성공`
        });
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
}

exports.get_activity_times = async(req,res)=>{
    data = url.parse(req.url, true).query
    let activity_id = data.id;
    let times;
    try{
        times = await Activity_time.findAll({
            attributes:["date", "hour", "reservation"],
            where:{
                "activity_id": activity_id,
            }
        })
        res.send({
            "success": true,
            "data": times
        })
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
}