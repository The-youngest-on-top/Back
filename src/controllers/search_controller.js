const Search = require('../models/search');
const Activity_image = require('../models/activity_image');
const Company = require('../models/company');
const Activity_time = require('../models/activity_time');

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
            // include: [
            //     {
            //         model: Activity_image,
            //         attributes: ["image_url"],
            //         required:false
            //     }
            // ],
            attributes: ["activity_category", "activity_name", "activity_price", "location", "company_id"],
        })
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
    let {activity_name, company_id} = req.body;
    try{    
        let activity = await Activity.findAll({
            attributes: ["activity_category", "activity_name", "activity_price", "location", "company_id"],
            where: {
                "activity_name": activity_name,
                "company_id": company_id
            }
        });
        console.log(activity);
        res.send({
            "success": true,
            "data": activity
        });
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
    
};

exports.get_location_activities = async (req,res)=>{
    let {location} = req.body;
    try{
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
    } catch(err){
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
    Activity.destroy({
        where:{
            "activity_name": activity_name
        }
    })
    console.log(`${activity_name} 삭제`)
};