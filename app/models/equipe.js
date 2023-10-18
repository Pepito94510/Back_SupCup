const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class equipe extends Model {};

equipe.init({
    id_sport: {
        type: DataTypes.NUMBER,
        allowNull: true
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'EQUIPE',
    modelName: 'equipe'
})

module.exports = equipe;
