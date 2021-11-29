const express = require('express');
const router = express.Router();
const url = require('url');

const Axios = require('axios')
const land_fcst_location = require("../weather/mid_land_fcst_loctaion.json");
const short_fcst_location= require("../weather/short_fcst_location.json");
//const ta_location = require("../weather/mid_ta_location.json");
const xy_converter = require("../weather/xy_converter");

const CachedCall = require('cached-call')
const cache = new CachedCall()
const cacheError = 10000
const dayjs = require('dayjs')
const everyHour = min => () => dayjs().add(60 - min, 'm').startOf('m').minute(min) - Date.now()
router.get('/', (req,res)=>{
    res.send('Server Open');
});
// 단기예보조회
// requset: lat: 경도, lng: 위도
// response: 0~2일 후 최저기온, 최고기온, 기상상태, 강수확률 반환.
router.get('/weathermap/:lat/:lng', async (req,res)=>{
    let params = req.params;
    let nxy = xy_converter.xy_conv("toXY",params.lat,params.lng);
    console.log(nxy); 
    try{
        let weather = await getWeather(nxy.x,nxy.y);
        //console.log(weather);
        res.send({
            "success": true,
            "data": weather
        });
    } catch(err){
        console.log(err);
        res.send({
            "success": true,
            "message": err
        });
    }
})

router.get('/weather', async(req,res)=>{
    const pad = (n, pad = 2) => ('0'.repeat(pad) + n).slice(-pad)
    let weather;
    let input = url.parse(req.url,true).query;
    let location = input.location;
    let now = new Date();
    var sdt = new Date(now);
    var edt = new Date(input.year,input.month-1, input.day);
    var dateDiff = Math.ceil((edt.getTime()-sdt.getTime())/(1000*3600*24));
    console.log(sdt);
    console.log(edt);
    try{
        if(dateDiff<3){
            let nxy = await xy_converter.xy_conv("toXY",short_fcst_location[location].lat,short_fcst_location[location].lng);
            let fcstdate = `${edt.getFullYear()}${pad(edt.getMonth()+1)}${pad(edt.getDate())}`
            console.log(fcstdate);
            weather = await getForecast(nxy.x,nxy.y);
        }
        else if(dateDiff<11){
            let hour = sdt.getHours();
            let tmfc
            let fctm;
            if(hour<6){
                fctm =`${sdt.getFullYear()}${pad(sdt.getMonth()+1)}${pad(sdt.getDate()-1)}`;
                tmfc = `${fctm}1800`;
            }
            else if(hour<18){
                fctm =`${sdt.getFullYear()}${pad(sdt.getMonth()+1)}${pad(sdt.getDate())}`;
                tmfc = `${fctm}0600`;
            }
            else {
                fctm =`${sdt.getFullYear()}${pad(sdt.getMonth()+1)}${pad(sdt.getDate())}`;
                tmfc = `${fctm}1800`;
            }
            weather= await getMidForecast(tmfc,location,dateDiff, hour);    
        }
        else{
            throw Error('해당 날짜의 날씨 정보가 없습니다.')
        }
        res.send({
            "basedate": sdt.getFullYear()+pad(sdt.getMonth()+1)+pad(sdt.getDate()),
            "time": sdt.getHours(),
            "weather": weather,
            "날짜 차이": dateDiff
        });
    }catch(err){
        console.log(err);
        res.send({
            "success": false,
            "message": err.message
        });
    }   
})

const getBaseDateTime = ({ minutes = 0, provide = 40 } = {}, dt = Date.now()) => {
    const pad = (n, pad = 2) => ('0'.repeat(pad) + n).slice(-pad)
    const date = new Date(dt - (provide * 60 * 1000)) // provide분 전
    return {
        base_date: date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()),
        base_time: pad(date.getHours()) + pad(minutes)
    }
}

const getShort = async (nx,ny) => {
    let {base_date, base_time} = await getBaseDateTime(0,180)
    var uri = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') +`=${process.env.short_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${base_date}`); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(`${base_time}`); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nx}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${ny}`); /* */
    console.log(uri+queryParams);
    const { data } = await Axios.get(uri+queryParams);
    if (!data.response) throw Error('단기예보 응답값 없음')
    //console.log(data.response.body.items.item);
    let state = getState(data.response.body.items.item);
    console.log(state);
    return state;
}


const getWeahterNow = async (nx, ny) => {
    let {base_date, base_time} = await getBaseDateTime()
    let tem, wsd,rain;
    var uri = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') +`=${process.env.short_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${base_date}`); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(`${base_time}`); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nx}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${ny}`); /* */
    console.log(uri+queryParams);
    const { data } = await Axios.get(uri+queryParams);
    if (!data.response) throw Error('getUltraSrtNcst 응답값 없음')
    data.response.body.items.item.forEach(element => {
        if(element.category=="T1H") tem = element.obsrValue;
        if(element.category=="WSD") wsd = element.obsrValue;
        if(element.category=="RN1") rain = element.obsrValue;
    });
    return {"date": base_date, "time": base_time, "tem": tem, "wsd": wsd, "rain":rain};
}

const getForecast = async (nx, ny) => {
    let {base_date, base_time} = await getBaseDateTime()
    var uri = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') +`=${process.env.short_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${base_date}`); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(`${base_time}`); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nx}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${ny}`); /* */
    console.log(uri+queryParams);
    const { data } = await Axios.get(uri+queryParams);
    if (!data.response) throw Error('getUltraSrtFcst 응답값 없음')
    //console.log(data.response.body.items.item);
    let state = getState(data.response.body.items.item);
    console.log(state);
    return state;
}

const weatherState = (ptyCode, skyCode) => {
    switch (ptyCode) {
      case 1: case 4: return '비'
      case 2: return '눈/비'
      case 3: return '눈'
    }
    switch (skyCode) {
      case 1: return '맑음'
      case 3: return '흐림'
      case 4: return '구름많음'
    }
}


const getWeather = async (x, y) => {
    const { getWeahterNow, getForecast } = cachedFn
    const [weather, forecast] = await Promise.all([
        getWeahterNow(x, y),
        getForecast(x, y),
    ])
    return {
        "date": weather.date,
        "time": weather.time,
        "tem":weather.tem,
        "wsd": weather.wsd, 
        "rain": weather.rain,
        "state": forecast 
    }
}

const getState = (data, fcsdate=0) => {
    let pty, sky, state;
    let pty_flag=0, sky_flag=0;
    data.forEach(element => {
        console.log(`fcstdate: ${fcstdate}  element: ${element.fcstDate}`);
        if(fcstdate==element.fcstDate){
                if(element.category=="PTY" && pty_flag==0) {
                    pty = element.fcstValue;
                    console.log(pty);
                }
                if(element.category=="SKY"){
                    sky = element.fcstValue;
                    console.log(sky);
                    state = weatherState(parseInt(pty),parseInt(sky));     
                }
        }
    });
    console.log(`getState: ${state}`);
    return state;
}

const cachedFn = {
    getWeahterNow: cache({ getWeahterNow, cacheError, maxAge: everyHour(40) }),
    getForecast: cache({ getForecast, cacheError, maxAge: everyHour(45) })
}

const getMidForecast = async(tmfc, location, dateDiff, hour) => {
    let weather;
    console.log(`지역코드: ${land_fcst_location[location]}, 날씨: ${tmfc}`)
    var uri = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') +`=${process.env.mid_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('regId') + '=' + encodeURIComponent(`${land_fcst_location[location]}`); /* */
    queryParams += '&' + encodeURIComponent('tmFc') + '=' + encodeURIComponent(`${tmfc}`); /* */
    console.log(uri+queryParams);
    const { data } = await Axios.get(uri+queryParams);
    if (!data.response) throw Error('응답값 없음')
    data.response.body.items.item.forEach(element => {
        switch (dateDiff) {
            case 3:
                if(hour<12){
                    weather = element.wf3Am;
                }else {
                    weather = element.wf3Pm;
                }
                break;
            case 4:
                if(hour<12){
                    weather = element.wf4Am;
                }else {
                    weather = element.wf4Pm;
                }
                break;
            case 5:
                if(hour<12){
                    weather = element.wf5Am;
                }else {
                    weather = element.wf5Pm;
                }
                break;
            case 6:
                if(hour<12){
                    weather = element.wf6Am;
                }else {
                    weather = element.wf6Pm;
                }
                break;
            case 7:
                if(hour<12){
                    weather = element.wf7Am;
                }else {
                    weather = element.wf7Pm;
                }
                break;
            case 8:
                if(hour<12){
                    weather = element.wf8Am;
                }else {
                    weather = element.wf8Pm;
                }
                break;
            case 9:
                if(hour<12){
                    weather = element.wf9Am;
                }else {
                    weather = element.wf9Pm;
                }
                break;
            case 10:
                if(hour<12){
                    weather = element.wf10Am;
                }else {
                    weather = element.wf10Pm;
                }
                break;
            default:
                break;
        }
    });
    return weather;
}   
module.exports = router