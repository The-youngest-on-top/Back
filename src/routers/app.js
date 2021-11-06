const express = require('express');
const router = express.Router();
const midTem = require('../weather/midTerm');


router.get('/', (req,res)=>{
    res.send('Server Open');
});

router.get('/user',(req,res)=>{
    res.send('User @@')
});
// 기상청 날씨 예보
router.get('/weather', async (req,res,next)=>{
    //let midtermWeather = midTem.midTemperatures();
    let midtermWeather2 = midTem.mid();
    console.log(midtermWeather2)
    res.send(midtermWeather2)
});

module.exports = router