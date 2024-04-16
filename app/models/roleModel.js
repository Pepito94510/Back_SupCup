import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class role extends Model{};

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

export default role;
