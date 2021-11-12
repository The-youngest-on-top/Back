'use strict';

//models/index.js
const Sequelize = require('sequelize');
const User = require('./user');
const Coupon = require('./coupon');
const Company = require('./company');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Coupon = Coupon;
db.Company = Company;

User.init(sequelize);
Coupon.init(sequelize);
Company.init(sequelize);

User.associate(db);
Coupon.associate(db);
Company.associate(db);

module.exports = db;
