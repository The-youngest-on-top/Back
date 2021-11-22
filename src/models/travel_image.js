const Sequelize = require('sequelize');

class Travel_image extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            image_url: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            travel_id:{
                type: Sequelize.INTEGER,
                allowNull:false
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Travel_image',
            tableName: 'travel_images',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Travel_image.belongsTo(db.Travel);
     }
}

module.exports = Travel_image;