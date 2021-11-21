const Sequelize = require('sequelize');

class Activity_time extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            day: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            hour:{
                type: Sequelize.STRING(10),
                allowNull:false
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Activity_time',
            tableName: 'activity_times',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Activity_time.belongsTo(db.Activity);
     }
}

module.exports = Activity_time;