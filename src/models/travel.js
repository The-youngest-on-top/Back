const Sequelize = require('sequelize');

class Travel extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            travel_name: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            location:{
                type: Sequelize.STRING(45),
                allowNull:false
            },
            address:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            content:{
                type: Sequelize.STRING(200),
                allowNull: false
            },
            
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Travel',
            tableName: 'travels',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {}
}

module.exports = Travel;