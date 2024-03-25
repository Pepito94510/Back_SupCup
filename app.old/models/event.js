const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class event extends Model {};

event.init({
    id_sport: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date_event: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    sequelize,
    timestamps: false,
    tableName: 'EVENT',
    modelName: 'event'
})

module.exports = event;
