const express = require('express');
const path    = require('path');
const morgan  = require('morgan');
const cors    = require("cors");
const fs      =require('fs');

const { sequelize } = require('./models');

const weather_router = require('./routers/weather_router'); 
const user_router = require('./routers/user_router'); 
const account_router = require('./routers/account_router');
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
app.use(express.urlencoded({ extended: false }));
//app.use(cors); //실제 서버 배포 시 IP를 설정해야됨.


app.use(weather_router);
app.use(user_router);
app.use(account_router);


app.listen(port, () => {
    var account_images = './images/account_images';
    if(!fs.existsSync(account_images)) fs.mkdirSync(account_images);
    console.log(`server is listening at localhost:${port}`);
});