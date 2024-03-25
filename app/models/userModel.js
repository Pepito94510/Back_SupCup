import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class user extends Model{};

user.init({
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_id: {
        type: DataTypes.NUMBER,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'USER',
    modelName: 'user'
})

export default user;
