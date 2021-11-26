const Sequelize = require('sequelize');
const db = require("./index")
class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING(45),
                allowNull: false,
                primaryKey: true,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            profile_image: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            nickname: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            birthday: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.User.hasMany(db.Coupon, {
            foreignKey: "user_id",
            onDelete: "cascade"
        })
        db.User.hasMany(db.Reservation)
    }
};

module.exports = User;