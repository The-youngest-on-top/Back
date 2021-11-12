const Sequelize = require('sequelize');
const db = require("./index")

class Company extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            company_id: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true
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
            account_number: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true
            },
            account_image: {
                type: Sequelize.STRING(100),
                allowNull: true
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
    static associate(db) { }
}

module.exports = Company;