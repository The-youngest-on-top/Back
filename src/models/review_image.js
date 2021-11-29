const Sequelize = require('sequelize');

class Review_image extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            image_url: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            review_id:{
                type: Sequelize.INTEGER,
                allowNull:false
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Review_image',
            tableName: 'review_images',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Review_image.belongsTo(db.Review);
     }
}

module.exports = Review_image;