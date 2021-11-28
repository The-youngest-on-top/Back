const Company  = require('../models/company');
var url = require('url');

exports.signup_company = async (req,res)=>{
    let {company_id, password, company_name, company_contact, company_address, company_manager, activity_category} = req.body;
    let {account_number, bank_name} = req.body;
    let account_image = req.file.location;
    console.log(req.body)
    try{
        await Company.create({
            "id": company_id,
            "password": password,
            "company_name": company_name,
            "company_contact": company_contact,
            "company_address": company_address,
            "company_manager": company_manager,
            "activity_category": activity_category,
            "bank_name": bank_name,
            "account_number": account_number,
            "account_image": account_image
        });
        res.send({
            "success": true,
            "message": `회원가입 완료`
        });
    } catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err
        });
    }
    
};

exports.get_company = async (req,res)=>{
    data = url.parse(req.url, true).query;
    let company_id = data.id;
    try{
        let result = await Company.findAll({
            attributes : ["id", "password", "company_name", "company_contact", "company_manager", "company_address", "activity_category","bank_name", "account_number"],
            where: {
                "id": company_id
            }
        })
        if(result.length==0){
            res.send(
                {
                    "success": false,
                    "message": `존재하지 않는 회원입니다.`
                }
            );
        }
        console.log(`${result}`);
        res.send({
            "success": true,
            "data": result
            }
        );
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

exports.modify_company = async (req,res)=>{
    let data = req.body;
    console.log(data);
    try{
        let result = await Company.update({
            "password": data.password,
            "company_name": data.company_name,
            "company_contact": data.company_contact,
            "company_manager": data.company_manager,
            "company_address": data.company_address,
            "activity_category": data.activity_category
        
        },{
            where: {"id": data.company_id},
        });
        console.log(result);

        if(result==1){
            res.send({
                "success": true,
                "message": "업체 회원 정보 수정 성공"
            });
        }else{
            res.send({
                "success": false,
                "message": "수정 실패"
            });
        }
        
    } catch(err){
        res.send({
            "success": false,
            "message": err
        });
    }
};

exports.login = async (req,res)=>{
    let data = req.body;
    let result= await Company.findOne({
        where:{
            "id": data.company_id
        },
    })
    if(!result){
        res.send({
            "success": false,
            "message": "존재하지 않는 아이디"
        })
    } else{
        if(data.password==result.password){
            res.send({
                "success": true,
                "message": `${result.id} 로그인 성공`
            })
        } else{
            res.send({
                "success": false,
                "message": "존재하지 않는 비밀번호"
            })
        }

    }
};

exports.delete_company =  async (req,res)=>{
    let {company_id} = req.body;
    await Company.destroy({
        where:{
            "id": company_id
        }
    })
    
    res.send(`${company_id} 삭제`);
};