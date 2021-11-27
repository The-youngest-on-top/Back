const Reservation = require('../models/reservation');
const url = require('url');
exports.add_reservation = async (req,res) => {
    let {activity_id,activity_time_id, user_id, payment, people} = req.body
    try{
        Reservation.create({
            "payment": payment,
            "people": people,
            "user_id": user_id,
            "activity_time_id": activity_time_id,
            "activity_id": activity_id,
            "payment_status": true
        });
        res.send({
            "success": true,
            "message": "예약 추가 성공"
        });
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
        result = Reservation.findAll({
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
                    attributes: ["activity_category", "activity_name", "activity_price", "location"]
                }
            ],
            attributes: ["id", "payment","people"],
            where:{
                payment_statue: true,
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
        res.send({
            "success": false,
            "message": err
        });
    }
}

exports.get_cart = async(req,res) => {
    let data = url.parse(req.url, true).query;
    let user_id = data.id;
    try{
        result = Reservation.findAll({
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
                    attributes: ["activity_category", "activity_name", "activity_price", "location"]
                }
            ],
            attributes: ["id", "payment","people"],
            where:{
                payment_statue: false,
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
        res.send({
            "success": false,
            "message": err
        });
    }
}

exports.get_activity_reservation = async(req,res) => {
    let data = url.parse(req.url, true).query;
    let activity_id = data.id;
    try{
        result = Reservation.findAll({
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
                    attributes: ["activity_category", "activity_name", "activity_price", "location"]
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