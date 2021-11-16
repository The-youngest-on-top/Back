const Sequelize = require('sequelize');
const db = require("./index")
class Heart extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            
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
    
};

module.exports = Heart;