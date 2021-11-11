const Sequelize = require('sequelize');
const db = require("./index")
class Coupon extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            coupon_name: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            validity: {
                type: Sequelize.BOOLEAN,
                defaultValue:true,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            publisher: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            deadline: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.STRING(45),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Coupon',
            tableName: 'coupons',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Coupon.belongsTo(db.User);
    }
};

module.exports = Coupon;