const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            profile_image: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            nickname: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            birthday: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {}
};

module.exports = User;