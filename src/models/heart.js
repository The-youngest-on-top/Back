const Sequelize = require('sequelize');
class Heart extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            activity_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.STRING(45),
                allowNull: false,
                primaryKey: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Heart',
            tableName: 'hearts',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Heart.belongsTo(db.User);
        db.Heart.belongsTo(db.Activity);
    }
};

module.exports = Heart;