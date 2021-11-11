'use strict';

//models/index.js
const Sequelize = require('sequelize');
const User = require('./user');
const Account = require('./account');
const Coupon = require('./coupon');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Account = Account;
db.Coupon = Coupon;

User.init(sequelize);
Account.init(sequelize);
Coupon.init(sequelize);

User.associate(db);
Account.associate(db);
Coupon.associate(db);

module.exports = db;
