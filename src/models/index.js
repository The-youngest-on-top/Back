'use strict';

//models/index.js
const Sequelize = require('sequelize');
const User = require('./user');
const Coupon = require('./coupon');
//const Reserve = require('./reserve');
const Heart = require('./heart');
const Company = require('./company');
const Activity = require('./activity');
const Review = require('./review');
const Search = require('./search');
const Travel = require('./travel');
const Travel_image = require('./travel_image');
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
db.Review = Review;
db.Search = Search;
db.Travel = Travel;
db.Activity_image = Activity_image;
db.Activity_time = Activity_time;
db.Travel_image = Travel_image;

User.init(sequelize);
Coupon.init(sequelize);
//Reserve.init(sequelize);
Heart.init(sequelize);
Company.init(sequelize);
Activity.init(sequelize);
Review.init(sequelize);
Search.init(sequelize);
Travel.init(sequelize);
Activity_image.init(sequelize);
Activity_time.init(sequelize);
Travel_image.init(sequelize);

User.associate(db);
Coupon.associate(db);
//Reserve.associate(db);
Heart.associate(db);
Company.associate(db);
Activity.associate(db);
Review.associate(db);
Search.associate(db);
Travel.associate(db);
Activity_image.associate(db);
Activity_time.associate(db);
Travel_image.associate(db);

db.Company.hasMany(db.Activity, { as: "activities" });
db.Activity.belongsTo(db.Company, {
  foreignKey: "id",
  as: "companys"
});

module.exports = db;
