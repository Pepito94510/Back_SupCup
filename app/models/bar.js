const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class bar extends Model {};

bar.init({
    Name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Postcode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    City: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'USER',
    modelName: 'user'
})

module.exports = bar;
