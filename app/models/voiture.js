import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class voiture extends Model{};

voiture.init({
    Name: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'VOITURE',
    modelName: 'voiture'
})

export default voiture;
