const express = require('express');
const router = express.Router();

const Axios = require('axios')
//const land_fcst_location = require("../weather/mid_land_fcst_loctaion.json");
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

const getBaseDateTime = ({ minutes = 0, provide = 40 } = {}, dt = Date.now()) => {
    const pad = (n, pad = 2) => ('0'.repeat(pad) + n).slice(-pad)
    const date = new Date(dt - (provide * 60 * 1000)) // provide분 전
    return {
        base_date: date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()),
        base_time: pad(date.getHours()) + pad(minutes)
    }
}

const getWeahterNow = async (nx, ny) => {
    let {base_date, base_time} = await getBaseDateTime()
    let tem, wsd,rain;
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') +`=${process.env.short_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${base_date}`); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(`${base_time}`); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nx}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${ny}`); /* */
    console.log(url+queryParams);
    const { data } = await Axios.get(url+queryParams);
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
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') +`=${process.env.short_service_key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${base_date}`); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(`${base_time}`); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(`${nx}`); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(`${ny}`); /* */
    console.log(url+queryParams);
    const { data } = await Axios.get(url+queryParams);
    if (!data.response) throw Error('getUltraSrtFcst 응답값 없음')
    console.log(data.response.body.items.item);
    let state = getState(data.response.body.items.item);
    console.log(state);
    return state;
}

const weatherState = (ptyCode, skyCode) => {
    switch (ptyCode) {
      case 1: case 4: return 'rainy'
      case 2: return 'snowAndRainy'
      case 3: return 'snow'
    }
    switch (skyCode) {
      case 1: return 'clear'
      case 3: return 'partlyClear'
      case 4: return 'cloudy'
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

const getState = (data) => {
    let pty, sky, state;
    let pty_flag=0, sky_flag=0;
    data.forEach(element => {
        if(element.baseDate==element.fcstDate){
                if(element.category=="PTY"&&pty_flag==0) {
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
module.exports = router