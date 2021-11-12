const Sequelize = require('sequelize');

class Activity extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            activity_category: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            activity_name:{
                type: Sequelize.STRING(45),
                allowNull:false
            },
            activity_price:{
                type: Sequelize.INTEGER,
                allowNull: false
            },
            location:{
                type: Sequelize.STRING(20),
                allowNull: false
            },
            company_manager:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            license_image:{
                type: Sequelize.STRING(100),
                allowNull: false
            },
            company_id:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Activity',
            tableName: 'activities',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Activity.belongsTo(db.Company);
     }
}

module.exports = Activity;