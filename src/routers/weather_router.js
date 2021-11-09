const express = require('express');
const router = express.Router();
const cheerio = require("cheerio");
const request = require('request');
const http = require('http');
const service_key = require("../../weatherAPI.json");
const land_fcst_location = require("../weather/mid_land_fcst_loctaion.json");
const ta_location = require("../weather/mid_ta_location.json");
const xy_converter = require("../weather/xy_converter");

router.get('/', (req,res)=>{
    res.send('Server Open');
});

router.get('/user',(req,res)=>{
    res.send('User @@')
});
// 중기육상예보조회  
// request: location : 지역 이름
// response:3~7일 후 오전/오후 기상상태, 강수확률 & 8~10일 후 기상상태, 강수확률 
router.get('/midlandfcst/:location', async (req,res,next)=>{
    let url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst';
    let params = req.params;
    let mid_land_fcst = [];
    let today = new Date();
    today.setHours(today.getHours());
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    let hours = today.getHours();
    if(hours < 7){
        dd = dd-1;
    }
    if(mm<10){
        mm = '0' +mm;
    }
    if(dd<10){
        dd = '0' +dd;
    }
    let queryParams = '?' + encodeURIComponent('serviceKey') + `${service_key.mid_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /* */
    queryParams += '&' + encodeURIComponent('regId') + '=' + encodeURIComponent(land_fcst_location[params.location]); /* */
    queryParams += '&' + encodeURIComponent('tmFc') + '=' + encodeURIComponent(`${yyyy}${mm}${dd}0600`); /* */
    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        if(error){
            console.log('Status', response.statusCode);
            console.log('Headers', JSON.stringify(response.headers));
            console.log(error);
            res.send(error);
        }
        //console.log('Reponse received', body);
        $ = cheerio.load(body);
        for(let i=3; i<=10; i++){
            let day = parseInt(dd) + i;
            if(i<8){
                mid_land_fcst[i-3]={
                    'date': `${yyyy}${mm}${day}`,
                    'fcst_am' : $('item').find(`wf${i}Am`).text(),
                    'fcst_pm' : $('item').find(`wf${i}Pm`).text(),
                    'rain_am' : $('item').find(`rnSt${i}Am`).text(),
                    'rain_pm' : $('item').find(`rnSt${i}Pm`).text()
                };
            }
            else {
                mid_land_fcst[i-3]={
                    'date': `${yyyy}${mm}${day}`,
                    'fcst' : $('item').find(`wf${i}`).text(),
                    'rain' : $('item').find(`rnSt${i}`).text()
                };
            }
        }
        console.log(mid_land_fcst);
        res.send(mid_land_fcst);
    })
    
    
});
//중기기온조회 -
// request: location: 지역이름
// response: 3~10일 후에 최저기온과 최고기온 반환
router.get('/midta/:location', (req,res)=>{
    let mid_ta = [];
    let params = req.params;
    let today = new Date();
    today.setHours(today.getHours());
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    let hours = today.getHours();
    if(hours < 7){
        dd = dd-1;
    }
    if(mm<10){
        mm = '0' +mm;
    }
    if(dd<10){
        dd = '0' +dd;
    }
    let url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa';
    let queryParams = '?' + encodeURIComponent('serviceKey') + `${service_key.mid_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /* */
    queryParams += '&' + encodeURIComponent('regId') + '=' + encodeURIComponent(ta_location[params.location]); /* */
    queryParams += '&' + encodeURIComponent('tmFc') + '=' + encodeURIComponent(`${yyyy}${mm}${dd}0600`); /* */
    request({
        url: url + queryParams,
        method: 'GET'
    },  function (error, response, body) {
        if(error){
            console.log('Status', response.statusCode);
            console.log('Headers', JSON.stringify(response.headers));
            console.log(error);
            res.send(error);
        }
        $ = cheerio.load(body);
        for(let i=3; i<=10; i++){
            let day = parseInt(dd) + i;
            mid_ta[i-3]={
                'date': `${yyyy}${mm}${day}`,
                'min' : $('item').find(`taMin${i}`).text(),
                'max' : $('item').find(`taMax${i}`).text()
            };
        }
        console.log(mid_ta);
        res.send(mid_ta)
    })
})

router.get('/vilagefcst/:lat/:lng', (req,res)=>{
    let vilagefcst = [];
    let params = req.params;
    let today = new Date();
    let nxy = xy_converter.xy_conv("toXY",params.lat,params.lng);
    today.setHours(today.getHours());
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    let hours = today.getHours();
    if(hours < 3){
        dd = dd-1;
        hours = 23;
    }
    else if(hours<6){
        hours = '02';
    }
    else if(hours<9){
        hours = '05';
    }
    else if(hours<12){
        hours = '08';
    }
    else if(hours<15){
        hours = 11;
    }
    else if(hours<18){
        hours = 14;
    }
    else if(hours<21){
        hours = 17;
    }
    if(mm<10){
        mm = '0' +mm;
    }
    if(dd<10){
        dd = '0' +dd;
    }
    console.log(`${yyyy}${mm}${dd} ${hours}`)
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') +`${service_key.mid_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${yyyy}${mm}${dd}`); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(`${hours}00`); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nxy.x}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${nxy.y}`); /* */
    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        if(error){
            console.log('Status', response.statusCode);
            console.log('Headers', JSON.stringify(response.headers));
            console.log(error);
            res.send(error);
        }
        res.send(body);
        console.log(body);
    });
})



module.exports = router