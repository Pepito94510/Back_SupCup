const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class user extends Model {};

user.init({
    Prenom: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Nom: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Telephone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Role_id: {
        type: DataTypes.NUMBER,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'USER',
    modelName: 'user'
})

module.exports = user;
