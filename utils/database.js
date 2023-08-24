// const sql = require('mysql2');

// const pool = sql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Madhusud@n1'
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete' , 'root' , 'Madhusud@n1' , {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;