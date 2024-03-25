import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class equipe extends Model{};

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

export default equipe;
