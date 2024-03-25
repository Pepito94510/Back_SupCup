import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class event extends Model{};

event.init({
    id_sport: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date_event: {
        type: DataTypes.DATE,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'EVENT',
    modelName: 'event'
})

export default event;
