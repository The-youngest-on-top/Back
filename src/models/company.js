const Sequelize = require('sequelize');
const db = require("./index")

class Company extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.STRING(45),
                allowNull: false,
                primaryKey: true,
            },
            password:{
                type: Sequelize.STRING(45),
                allowNull:false
            },
            company_name:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            company_contact:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            company_manager:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            company_address:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            activity_category:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            bank_name:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            account_number: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            account_image: {
                type: Sequelize.STRING(100),
                allowNull: false
            }

        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Company',
            tableName: 'companys',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {}
}

module.exports = Company;