const Account  = require('../models/account');
const path = require('path');

exports.register_account = async (req,res)=>{
    let {account_owner, account_number} = req.body;
    let account_image = `${req.file.destination}/${req.file.filename}`;
    console.log(account_image);
    await Account.create({
        "account_owner": account_owner,
        "account_number": account_number,
        "account_image": account_image
    });
    res.send(`소유주: ${account_owner} 계좌번호: ${account_number} 파일: ${account_image}`);
};

exports.get_account_image = async (req,res)=>{
    let id = req.body.id;
    let project_path = path.resolve("./");
    let account_data= await Account.findOne({
        attributes:['account_image'],
        where:{
            "id": id
        }
    })
    console.log(`${project_path}/${account_data.account_image}`);
    res.sendFile(`${project_path}/${account_data.account_image}`);
};