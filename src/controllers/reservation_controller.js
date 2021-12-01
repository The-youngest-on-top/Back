const Reservation = require('../models/reservation');
const Activity_time = require('../models/activity_time');
const Activity_image = require('../models/activity_image');
const Company = require('../models/company');
const url = require('url');
const Activity = require('../models/activity');
exports.add_reservation = async (req,res) => {
    let {activity_id,activity_time_id, user_id, payment, people} = req.body
    try{
        let time = await Activity_time.findOne({
            attributes: ["reservation"],
            where:{
                id : activity_time_id
            }
        })
        if(time.reservation){
            res.send({
                "success": false,
                "message": "예약이 불가능한 시간대"
            })
        } else {
            await Reservation.create({
                "payment": payment,
                "people": people,
                "user_id": user_id,
                "activity_time_id": activity_time_id,
                "activity_id": activity_id,
                "payment_status": true
            });
            await Activity_time.update({
                "reservation": true
            },{
                where:{
                    "id": activity_time_id
                }
            });
            res.send({
                "success": true,
                "message": "예약 추가 성공"
            });
        }
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
}

exports.add_cart = async (req,res) => {
    let {activity_id,activity_time_id, user_id, payment, people} = req.body
    try{
        Reservation.create({
            "payment": payment,
            "people": people,
            "user_id": user_id,
            "activity_time_id": activity_time_id,
            "activity_id": activity_id
        });
        res.send({
            "success": true,
            "message": "장바구니 추가 성공"
        });
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
}


exports.get_orderlist = async(req,res) => {
    let data = url.parse(req.url, true).query;
    let user_id = data.id;
    try{
        result = await Reservation.findAll({
            include:[
                {
                    model: Activity_time,
                    attributes: ["date", "hour"],
                },
                {
                    model: Activity,
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
                    attributes: ["id", "activity_name"]
                }
            ],
            attributes: ["id", "payment","people"],
            where:{
                payment_status: true,
                user_id: user_id
            }
        });
        if(result){
            res.send({
                "success": true,
                "data": result
            })
        } else{
            res.send({
                "success": false,
                "message": "해당 유저의 예약이 없습니다."
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

exports.get_carts = async(req,res) => {
    let data = url.parse(req.url, true).query;
    let user_id = data.id;
    try{
        result = await Reservation.findAll({
            include:[
                {
                    model: Activity_time,
                    attributes: ["date", "hour"],
                },
                {
                    model: Activity,
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
                    attributes: ["id", "activity_name", "activity_price"]
                }
            ],
            attributes: ["id", "payment","people"],
            where:{
                payment_status: false,
                user_id: user_id
            }
        });
        if(result){
            res.send({
                "success": true,
                "data": result
            })
        } else{
            res.send({
                "success": false,
                "message": "해당 유저의 장바구니 내역이 없습니다."
            });
        }
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
}

exports.get_activity_reservations = async(req,res) => {
    let data = url.parse(req.url, true).query;
    let activity_id = data.id;
    try{
        result = await Reservation.findAll({
            include:[
                {
                    model: Activity_time,
                    attributes: ["date", "hour"],
                },
                {
                    model: Activity,
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
                    attributes: ["id", "activity_name","activity_price"]
                }
            ],
            attributes: ["id", "payment","people"],
            where:{
                activity_id : activity_id
            }
        });
        if(result){
            res.send({
                "success": true,
                "data": result
            })
        } else{
            res.send({
                "success": false,
                "message": "해당 유저의 예약이 없습니다."
            });
        }
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
}
