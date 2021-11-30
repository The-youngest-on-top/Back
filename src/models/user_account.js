const Sequelize = require('sequelize');

class User_account extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            account_number: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            bank_name:{
                type: Sequelize.STRING(45),
                allowNull:false
            },
            user_id:{
                type: Sequelize.STRING(45),
                allowNull:false
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'User_account',
            tableName: 'user_accounts',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.User_account.belongsTo(db.User);
     }
}

module.exports = User_account;