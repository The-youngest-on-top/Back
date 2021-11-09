const express = require('express');
const path = require('path');
const morgan = require('morgan');

const { sequelize } = require('./models');

const app = express();
const router = require('./routers/weather_router'); 
const port = process.env.PORT || 3003;
const body_parser = require('body-parser')

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

app.use(router);


app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});