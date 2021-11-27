const Sequelize = require('sequelize');

class Review extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            content: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            star:{
                type: Sequelize.FLOAT,
                allowNull:false
            },
            user_id:{
                type: Sequelize.STRING(45),
                allowNull: false
            },
            activity_id:{
                type: Sequelize.INTEGER,
                allowNull: false
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Review',
            tableName: 'reviews',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Review.belongsTo(db.User);
        db.Review.belongsTo(db.Activity);
    }
}

module.exports = Review;