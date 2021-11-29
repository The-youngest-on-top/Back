const User  = require('../models/user');
const path = require('path');

exports.signup_user = async (req,res) =>{
    let data = req.body;
    try{
        let profile_image = req.file.location;
    let e_result= await User.findOne({
        where:{
            "email": data.email
        }
    })
    if(e_result){
        res.send({
            "success": false,
            "message": "사용 불가 이메일"
        })
    }

    let p_result= await User.findOne({
        where:{
            "phone_number": data.phone_number
        },
    })
    if(p_result){
        res.send({
            "success": false,
            "message": "사용 불가 전화번호"
        })
    } 

    let n_result= await User.findOne({
        where:{
            "nickname": data.nickname
        },
    })
    if(n_result){
        res.send({
            "success": false,
            "message": "사용 불가 닉네임"
        })
    } 

    if(!(e_result || p_result || n_result))
    {
        await User.create({
            "id":data.user_id,
            "password":data.password,
            "profile_image": profile_image,
            "nickname": data.nickname,
            "name": data.name,
            "phone_number":data.phone_number,
            "birthday":data.birthday,
            "email": data.email
        })
        res.send({
            "success": true,
            "message": "회원가입 완료"
        })
    }
    }catch(err){
        res.send({
            "success": false,
            "message": err
        })
    }
};

exports.get_user = async (req,res)=>{
    let {user_id} = req.params;
    console.log(user_id);
    try{
        let result= await User.findOne({
            attributes: ["id", "password", "profile_image", "nickname","name", "phone_number", "birthday", "email"],
            where:{
                id : user_id
            }
        })
        console.log(result);
        res.send({
            "success": true,
            "data": result
        });
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err.message
        });
    }
    
};


exports.check_id = async (req,res)=>{
    let user_id = req.params.user_id;
    let result= await User.findOne({
        where:{
            "id": user_id
        },
    })
    if(result){
        res.send({
            "success": false,
            "message": "이미 사용중인 아이디"
        })
    } else{
        res.send({
            "success": true,
            "message": "사용가능한 아이디"
        })
    }
};

exports.login = async (req,res)=>{
    let data = req.body;
    // let user_id = req.body.user_id;
    // let password = req.body.password;
    console.log(data);
    try{
        let result= await User.findOne({
            where:{
                "id": data.user_id
            },
        })
        if(!result){
            res.status(404).send({
                "success": false,
                "message": "존재하지 않는 아이디"
            });
        } else{
            if(data.password==result.password){
                res.send({
                    "success": true,
                    "message": `${result.id} 로그인 성공`
                });
            } else{
                res.status(404).send({
                    "success": false,
                    "message": "존재하지 않는 비밀번호"
                });
            }
        }
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err
        });
    }
   
};

exports.set_profile_image = async(req,res)=>{
    let user_id = req.body.user_id;
    try{
        let profile_image = req.file.location;
        User.update({
            "profile_image": profile_image
        },{
            where: {"id":user_id}
        });
        res.send({
            "success": true,
            "message": "프로필 이미지 저장 완료"
        })
    } catch(err){
        res.send({
            "success": false,
            "message": err
        })
    }
    
}

exports.get_profile_image = async (req,res)=>{
    let user_id = req.body.user_id;
    
    let user_data= await User.findOne({
        attributes:['profile_image'],
        where:{
            "id": user_id
        }
    })
    console.log(user_data.profile_image);
    res.send(user_data.profile_image);
};

exports.delete_user = async (req,res)=>{
    let user_id = req.body.user_id;
    
    await User.destroy({
        where:{
            "user_id": user_id
        }
    })
    
    res.send(`${user_id}   삭제`);
};

exports.modify_user = async (req,res)=>{
    let user_id = req.body.user_id;
    let password = req.body.password;
    let nickname = req.body.nickname;
    try{
        console.log(req.body);
        await User.update({password:password, nickname:nickname},{where:{id:user_id}});
        res.send({
            "success": true,
            "message": "회원정보 수정 성공"
        });
    }catch (err){
        console.log(err);
        res.send({
            "success": false,
            "message": err
        })
    }
        
};