'use strict';

//models/index.js
const Sequelize = require('sequelize');
const User = require('./user');
const Coupon = require('./coupon');
const Company = require('./company');
const Activity = require('./activity');
const Activity_image = require('./activity_image');

const env = process.env.NODE_ENV || 'test';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Coupon = Coupon;
db.Company = Company;
db.Activity = Activity;
db.Activity_image = Activity_image;

User.init(sequelize);
Coupon.init(sequelize);
Company.init(sequelize);
Activity.init(sequelize);
Activity_image.init(sequelize);

User.associate(db);
Coupon.associate(db);
Company.associate(db);
Activity.associate(db);
Activity_image.associate(db);

module.exports = db;
