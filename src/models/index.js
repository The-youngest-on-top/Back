'use strict';

//models/index.js
const Sequelize = require('sequelize');
const User = require('./user');
const Coupon = require('./coupon');
//const Reserve = require('./reserve');
const Heart = require('./heart');
const Company = require('./company');
const Activity = require('./activity');
const Activity_image = require('./activity_image');
const Activity_time = require('./activity_time');

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
db.Activity_image = Activity_image;
db.Activity_time = Activity_time;

User.init(sequelize);
Coupon.init(sequelize);
//Reserve.init(sequelize);
Heart.init(sequelize);
Company.init(sequelize);
Activity.init(sequelize);
Activity_image.init(sequelize);
Activity_time.init(sequelize);

User.associate(db);
Coupon.associate(db);
//Reserve.associate(db);
Heart.associate(db);
Company.associate(db);
Activity.associate(db);
Activity_image.associate(db);
Activity_time.associate(db);

module.exports = db;
