const Sequelize = require('sequelize');

class Activity_time extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            date: {
                type: Sequelize.STRING(30),
                allowNull: false
            },
            hour:{
                type: Sequelize.STRING(10),
                allowNull:false
            },
            reservation:{
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            activity_id:{
                type: Sequelize.INTEGER,
                allowNull:false
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Activity_time',
            tableName: 'activity_times',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Activity_time.belongsTo(db.Activity,{
            foreignKey: "activity_id",
            onDelete: "cascade"
        });
     }
}

module.exports = Activity_time;