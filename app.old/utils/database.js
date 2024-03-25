const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://supcup_user:supcup_password@db/supcup_db');

try {
    sequelize.authenticate();
    console.log('Connection successful');
}
catch (error) {
    console.error('Unable to connect',error);
}

module.exports = sequelize;