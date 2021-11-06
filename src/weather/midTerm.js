const request = require('request');
const cheerio = require("cheerio");

exports.midTemperatures = () => {
    let midtermWeather = {};
    let url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa';
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=aZSH0zE97sXr7zgQvmEalmKcA0sx5Qyqtohjm7Z%2BTHyvh0DCTyzTkeKlKpPyFa5I4ad69%2F%2BGHDJ2CrsVENOVXA%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /* */
    queryParams += '&' + encodeURIComponent('regId') + '=' + encodeURIComponent('11B10101'); /* */
    queryParams += '&' + encodeURIComponent('tmFc') + '=' + encodeURIComponent('202111060600'); /* */
    request({
        url: url + queryParams,
        method: 'GET'
    },  function (error, response, body) {
        $ = cheerio.load(body);
        for(let i=3; i<=10; i++){
            midtermWeather[i-3]={
                'date': i,
                'min' : $('item').find(`taMin${i}`).text(),
                'max' : $('item').find(`taMax${i}`).text()
            };
        }
        console.log(midtermWeather);
        return midtermWeather;
    })
}

exports. mid = () => {
    let midtermWeather = {};
    let url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst';
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=aZSH0zE97sXr7zgQvmEalmKcA0sx5Qyqtohjm7Z%2BTHyvh0DCTyzTkeKlKpPyFa5I4ad69%2F%2BGHDJ2CrsVENOVXA%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /* */
    queryParams += '&' + encodeURIComponent('regId') + '=' + encodeURIComponent('11B00000'); /* */
    queryParams += '&' + encodeURIComponent('tmFc') + '=' + encodeURIComponent('202111060600'); /* */
    request({
        url: url + queryParams,
        method: 'GET'
    },  function (error, response, body) {
        $ = cheerio.load(body);
        for(let i=3; i<=10; i++){
            midtermWeather[i-3]={
                'date': i,
                'amRain' : $('item').find(`rnSt${i}Am`).text(),
                'pmRain' : $('item').find(`rnSt${i}Pm`).text(),
                'amweather' : $('item').find(`wf${i}Am`).text(),
                'pmweather' : $('item').find(`wf${i}Pm`).text()
            };
        }
        console.log(midtermWeather);
        return midtermWeather;
    })
}


