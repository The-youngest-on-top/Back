const Sequelize = require('sequelize');

class Activity_image extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            image_url: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            activity_id:{
                type: Sequelize.INTEGER,
                allowNull:false
            }
        },  {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Activity_image',
            tableName: 'activity_images',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Activity_image.belongsTo(db.Activity);
     }
}

module.exports = Activity_image;