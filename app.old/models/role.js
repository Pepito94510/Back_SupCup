const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class role extends Model {};

role.init({
    Name: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'ROLE',
    modelName: 'role'
})

module.exports = role;
