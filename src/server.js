const express = require('express');
const path    = require('path');
const morgan  = require('morgan');
const cors    = require("cors");
const fs      =require('fs');
require('dotenv').config();
const { sequelize } = require('./models');

const weather_router = require('./routers/weather_router'); 
const user_router = require('./routers/user_router'); 
const coupon_router = require('./routers/coupon_router');
//const reserve_router = require('./routers/reserve_router');
const heart_router = require('./routers/heart_router');
const company_router = require('./routers/company_router');
const activity_router = require('./routers/activity_router');
const travel_router = require('./routers/travel_router');
const app = express();

const port = process.env.PORT || 3003;

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors); //실제 서버 배포 시 IP를 설정해야됨.


app.use(weather_router);
app.use(user_router);
app.use(coupon_router);
//app.use(reserve_router);
app.use(heart_router);
app.use(company_router);
app.use(activity_router);
app.use(travel_router);

app.listen(port, () => {
    // var account_images = './images/account_images';
    // var profile_images = './images/profile_images';
    // var activity_images = './images/activity_images';
    // if(!fs.existsSync(account_images)) fs.mkdirSync(account_images);
    // if(!fs.existsSync(profile_images)) fs.mkdirSync(profile_images);
    // if(!fs.existsSync(activity_images)) fs.mkdirSync(activity_images);
    console.log(`server is listening at localhost:${port}`);
});