const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class sport extends Model {};

sport.init({
    name: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'SPORT',
    modelName: 'sport'
})

module.exports = sport;
