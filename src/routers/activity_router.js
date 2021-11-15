const express = require('express');
const router = express.Router();
const multer = require('multer');
const Activity = require('../models/activity');
const Activity_image = require('../models/activity_image');
const Company = require('../models/company');

const activity_storage = multer.diskStorage({
    // 업로드된 파일명과 서버의 파일명을 동일하게 세팅
    destination(req, file, cb){
        cb(null, 'images/activity_images');
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}__${file.originalname}`);
    }
});
const upload_with_original_file_name= multer({storage: activity_storage});  // 이미지 업로드 (파일명 동일)

router.post('/activity',upload_with_original_file_name.array("activity_images"), async (req,res)=> {
    let images = req.files;
    let data = req.body;
    let license_image = `${images[0].destination}/${images[0].filename}`
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
        let activity_image = `${images[i].destination}/${images[i].filename}`;
        await Activity_image.create({
            "image_url": activity_image,
            "activity_id": activity.id
        })
        console.log(images[i].filename);
    }
    res.send(`activity 저장 성공`);
})

router.get('/activity', async (req,res)=>{
    let {activity_name, company_id} = req.body;
    let activity = await Activity.findAll({
        where: {
            "activity_name": activity_name 
        }
    });
    console.log(activity);
    res.send(activity);
})

router.get('/activity/images', async (req,res)=>{
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
})

router.delete('/activity', async (req,res)=>{
    let {activity_name} = req.body;
    Activity.destroy({
        where:{
            "activity_name": activity_name
        }
    })
    console.log(`${activity_name} 삭제`)
})
module.exports = router;