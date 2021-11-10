const Sequelize = require('sequelize');

class Account extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            account_owner: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            account_number: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true
            },
            account_image: {
                type: Sequelize.STRING(45),
                allowNull: true
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Account',
            tableName: 'accounts',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {}
}

module.exports = Account;