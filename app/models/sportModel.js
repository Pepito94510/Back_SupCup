import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class sport extends Model{};

sport.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'SPORT',
    modelName: 'sport'
})

export default sport;
