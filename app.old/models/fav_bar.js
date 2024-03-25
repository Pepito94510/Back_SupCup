const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class favBar extends Model {};

favBar.init({
    id_user: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    id_bar: {
        type: DataTypes.NUMBER,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'FAV_BAR',
    modelName: 'fav_bar'
})

module.exports = favBar;
