const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'supcup_db',
    'supcup_user',
    'supcup_password',
     {
       host: 'localhost',
       dialect: 'mysql'
     }
   );

try {
    sequelize.authenticate();
    console.log('Connection successful');
}
catch (error) {
    console.error('Unable to connect',error);
}

module.exports = sequelize;