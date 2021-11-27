const Sequelize = require('sequelize');

class Reservation extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            payment: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            people:{
                type: Sequelize.INTEGER,
                allowNull:false
            },
            payment_status:{
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            user_id:{
                type: Sequelize.STRING(50),
                allowNull:false
            },
            activity_time_id: {
                type: Sequelize.INTEGER,
                allowNull:false
            },
            activity_id:{
                type: Sequelize.INTEGER,
                allowNull:false
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Reeservation',
            tableName: 'reservations',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Reservation.belongsTo(db.Activity_time)
        db.Reservation.belongsTo(db.User,{
            foreignKey: "user_id",
            onDelete: "cascade"
        })
        db.Reservation.belongsTo(db.Activity,{
            foreignKey: "activity_id",
            onDelete: "cascade"
        })
     }
}

module.exports = Reservation;