const Travel = require('../models/travel');
const Travel_image = require('../models/travel_image');
const Company = require('../models/company');
const url = require('url');

exports.add_travel = async (req,res)=> {
    let images = req.files;
    let data = req.body;
    try{
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
        res.send({
            "success" : true,
            "message": "travel 저장 성공"
        });
    } catch(err){
        console.log(err);
        res.send(
            {
                "success": false,
                "message": err
            }
        );
    }
    
};

exports.get_location_travel = async (req,res)=>{
    query_data = url.parse(req.url,true).query
    let location = query_data.location;
    try{
        let travel = await Travel.findAll({
            include: [
                {
                    model: Travel_image,
                    attributes: ["image_url"],
                    required:false
                }
            ],
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
    } catch(err){
        console.log(err);
        res.send(
            {
                "success": false,
                "message": err
            }
        );
    }
};

exports.get_travels = async (req,res) => {
    try{
        let travel = await Travel.findAll({
            include: [
                {
                    model: Travel_image,
                    attributes: ["image_url"],
                    required:false
                }
            ],
            attributes: ["travel_name", "location", "address", "content"],
        });
        if(travel){
            res.send({
                "success": true,
                "data": travel
            });
        }else {
            res.send({
                "success": false,
                "message": "여행지 정보가 없습니다."
            })
        }
    } catch(err){
        console.log(err);
        res.send(
            {
                "success": false,
                "message": err
            }
        ); 
    }
}

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