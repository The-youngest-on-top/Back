const Travel = require('../models/travel');
const Travel_image = require('../models/travel_image');
const Company = require('../models/company');


exports.add_travel = async (req,res)=> {
    // let images = req.files;
    let data = req.body;
    // let license_image = `${images[0].location}`
    await Travel.create({
        "travel_name": data.travel_name,
        "location": data.location,
        "address": data.address,
        "content":data.content,
        
    });
    // let activity = await Activity.findOne({
    //     attributes: ['id'],
    //     where: {
    //         "activity_name": data.activity_name,
    //         "company_id":  data.company_id
    //     }
    // })
    // for(let i = 1; i<images.length; i++){
    //     let activity_image = `${images[i].location}`;
    //     await Activity_image.create({
    //         "image_url": activity_image,
    //         "activity_id": activity.id
    //     })
    //     console.log(images[i].filename);
    // }
    res.send(`travel 저장 성공`);
};

exports.get_activity = async (req,res)=>{
    let {activity_name, company_id} = req.body;
    let activity = await Activity.findAll({
        where: {
            "activity_name": activity_name,
            "company_id": company_id
        }
    });
    console.log(activity);
    res.send(activity);
};

exports.get_location_activities = async (req,res)=>{
    let {location} = req.body;
    let activity = await Activity.findAll({
        attributes: ["activity_category", "activity_name", "activity_price", "location", "company_id"],
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
};

exports.get_activity_images = async (req,res)=>{
    let {activity_name} = req.body;
    let activity = await Activity.findOne({
        where: {
            "activity_name": activity_name 
        }
    });
    let images = await Activity_image.findAll({
        where: {
            "activity_id": activity.id
        }
    })
    console.log(images);
    res.send(images);
}

exports.delete_activity = async (req,res)=>{
    let {activity_name} = req.body;
    Activity.destroy({
        where:{
            "activity_name": activity_name
        }
    })
    console.log(`${activity_name} 삭제`)
};