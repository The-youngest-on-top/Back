const Travel = require('../models/travel');
const Travel_image = require('../models/travel_image');
const Company = require('../models/company');


exports.add_travel = async (req,res)=> {
    let images = req.files;
    let data = req.body;
    await Travel.create({
        "travel_name": data.travel_name,
        "location": data.location,
        "address": data.address,
        "content":data.content,
        
    });
    let travel = await Travel.findOne({
        attributes: ['id'],
        where: {
            "travel_name": data.travel_name
        }
    })
    console.log(travel.id);
    for(let i = 0; i<images.length; i++){
        let travel_image = `${images[i].location}`;
        await Travel_image.create({
            "image_url": travel_image,
            "travel_id": travel.id
        })
        console.log(images[i].filename);
    }
    res.send(`travel 저장 성공`);
};

exports.get_location_travel = async (req,res)=>{
    let {location} = req.body;
    let travel = await Travel.findAll({
        attributes: ["travel_name", "location", "address", "content"],
        where: {
            "location": location 
        }
    });
    if(travel.length){
        res.send({
            "success": true,
            "data": travel
        });
    }
    else {
        res.send({
            "success": false,
            "message": "해당 지역에 여행지가 없습니다."
        });
    }
};

exports.get_travel_images = async (req,res)=>{
    let {travel_name} = req.body;
    let travel = await Travel.findOne({
        where: {
            "travel_name": travel_name 
        }
    });
    let images = await Travel_image.findAll({
        attributes:["image_url"],
        where: {
            "travel_id": travel.id
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