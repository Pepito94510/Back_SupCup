const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class favEquipe extends Model {};

favEquipe.init({
    id_user: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    id_equipe: {
        type: DataTypes.NUMBER,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'FAV_EQUIPE',
    modelName: 'fav_equipe'
})

module.exports = favEquipe;
