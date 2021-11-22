const express = require('express');
const router = express.Router();

const Axios = require('axios')
const cheerio = require("cheerio");
const request = require('request');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const land_fcst_location = require("../weather/mid_land_fcst_loctaion.json");
const ta_location = require("../weather/mid_ta_location.json");
const xy_converter = require("../weather/xy_converter");

router.get('/', (req,res)=>{
    res.send('Server Open');
});

// 중기육상예보조회  
// request: location : 지역 이름
// response:3~7일 후 오전/오후 기상상태, 강수확률 & 8~10일 후 기상상태, 강수확률 
router.get('/midlandfcst/:location', async (req,res,next)=>{
    let url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst';
    let params = req.params;
    let mid_land_fcst = [];
    let today = moment().format('YYYY-mm-dd-HH');
    let dd = moment().format('DD')
    let mm = moment().format('MM')
    let yyyy = moment().format('YYYY')
    let hours = moment().format('HH')
    if(hours < 7){
        dd = dd-1;
    }
    let queryParams = '?' + encodeURIComponent('serviceKey') + `${process.env.mid_service_key}`; /* Service Key*/
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
    let queryParams = '?' + encodeURIComponent('serviceKey') + `${process.env.mid_service_key}`; /* Service Key*/
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
// 단기예보조회
// requset: lat: 경도, lng: 위도
// response: 0~2일 후 최저기온, 최고기온, 기상상태, 강수확률 반환.
router.get('/weathermap/:lat/:lng', (req,res)=>{
    let todayfcst = [];
    let params = req.params;
    let nxy = xy_converter.xy_conv("toXY",params.lat,params.lng);
    console.log(nxy);
    let today = moment().format('YYYY-mm-dd-HH');
    let dd = moment().format('DD');
    let real = moment().format('DD');
    let mm = moment().format('MM');
    let yyyy = moment().format('YYYY');
    let hours = Number(moment().format('HH'));
    if(hours < 2){
        dd = dd-1;
        hours = 23;
    }
    else {
        hours = '02';
    }
    // else if(hours<5){
    //     hours = '02';
    // }
    // else if(hours<8){
    //     hours = '05';
    // }
    // else if(hours<11){
    //     hours = '08';
    // }
    // else if(hours<14){
    //     hours = 11;
    // }
    // else if(hours<17){
    //     hours = 14;
    // }
    // else if(hours<20){
    //     hours = 17;
    // } 
    // else if(hours<23){
    //     hours = 20;
    // }
    if(mm<10){
        mm = '0' +mm;
    }
    if(dd<10){
        dd = '0' +dd;
    }
    console.log(`시간: ${hours}00`)
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') +`=${process.env.short_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${yyyy}${mm}${dd}`); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(`${hours}00`); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nxy.x}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${nxy.y}`); /* */
    console.log(url+queryParams);
    request({
        url: url + queryParams,
        method: 'GET',
        encoding: null
    }, function (error, response, body) {
        if(error){
            console.log(error);
            res.send(error);
        }
        let min,max,pop,sky,pty;
        $ = cheerio.load(body);
        day = parseInt(dd);
        pop_flag = 0;
        sky_flag = 0;
        pty_flag = 0;
        fcst_flag = 0;
        complete_flag = 0;
        if(day<10){
            day = '0'+day;
        }
        date = `${yyyy}${mm}${real}`;
        console.log(date);
        // if($('cmmMsgHeader').find(errMsg).text()){
        //     res.send({
        //         "success": false,
        //         "message": `${$('cmmMsgHeader').find(returnAuthMsg).text()}`
        //     })
        // }
        $('item').each(function (idx){
            let fcst_date = $(this).find('fcstDate').text();
            let category =$(this).find('category').text();
            let value =$(this).find('fcstValue').text();
            if(fcst_date==date){
                if(category=="TMN"){
                    console.log(`날짜: ${fcst_date} 최저기온: ${value}`);
                    min = value;
                    complete_flag++;
                }
                if(category=="TMX"){
                    console.log(`날짜: ${fcst_date} 최고기온: ${value}`);
                    max = value;
                    complete_flag++;
                }
                if(category=="POP"&& pop_flag==0){
                    console.log(`날짜: ${fcst_date} 강수확률 : ${value}`);
                    pop = value;
                    pop_flag++;
                    complete_flag++;
                }
                if(category=="SKY"&& sky_flag==0){
                    switch(parseInt(value)){
                        case 1:
                            sky = "맑음"
                            break;
                        case 3:
                            sky = "구름많음"
                            break;
                        case 4:
                            sky = "흐림"
                            break;
                    }
                    console.log(`날짜: ${fcst_date} 하늘 상태: ${sky}`);
                    sky_flag++;
                    complete_flag++;
                }
                if(category=="PTY"&& pty_flag==0){
                    switch(parseInt(value)){
                        case 0:
                            pty = 0;
                        case 1:
                            pty = "비"
                            break;
                        case 2:
                            pty = "비/눈"
                            break;
                        case 3:
                            pty = "눈"
                            break;
                        case 4:
                            pty = "소나기"
                            break;
                    }
                    console.log(`날짜: ${fcst_date} 강수 형태: ${pty}`);
                    pty_flag++;
                    complete_flag++;
                }
                if(fcst_flag==0&& complete_flag==5){
                    todayfcst = {
                        "date" : fcst_date, 
                        "min" : min,
                        "max" : max,
                        "sky" : sky,
                        "pty" : pty,
                        "rain" : pop
                    }
                }
            }
        })
        console.log(todayfcst);
        if(todayfcst.length!=0){
            res.send({
                "success": true,
                "data":todayfcst
            }); 
        } else{
            res.send({
                "success": false,
                "message": "날씨 정보를 불러올 수 없습니다."
            })
        }
        
    });
})
module.exports = router