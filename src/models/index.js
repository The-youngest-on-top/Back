'use strict';

//models/index.js
const Sequelize = require('sequelize');
const User = require('./user');
const Coupon = require('./coupon');
//const Reserve = require('./reserve');
const Heart = require('./heart');
const Company = require('./company');
const Activity = require('./activity');
const Travel = require('./travel');
const Travel_image = require('./travel_image');
const Activity_image = require('./activity_image');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Coupon = Coupon;
//db.Reserve = Reserve;
db.Heart = Heart;
db.Company = Company;
db.Activity = Activity;
db.Travel = Travel;
db.Activity_image = Activity_image;
db.Travel_image = Travel_image;

User.init(sequelize);
Coupon.init(sequelize);
//Reserve.init(sequelize);
Heart.init(sequelize);
Company.init(sequelize);
Activity.init(sequelize);
Travel.init(sequelize);
Activity_image.init(sequelize);
Travel_image.init(sequelize);

User.associate(db);
Coupon.associate(db);
//Reserve.associate(db);
Heart.associate(db);
Company.associate(db);
Activity.associate(db);
Travel.associate(db);
Activity_image.associate(db);
Travel_image.associate(db);

module.exports = db;
