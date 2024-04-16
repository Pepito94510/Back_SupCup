import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';

class bar extends Model {};

bar.init({
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postcode: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id_user: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'BAR',
    modelName: 'bar'
})

export default bar;
