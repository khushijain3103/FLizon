// const sql = require('mysql2');

// const pool = sql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Madhusud@n1'
// });

// module.exports = pool.promise();

//sql syntax for connecting to database

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete' , 'root' , 'Madhusud@n1' , {
//     dialect: 'mysql',
//     host: 'localhost'
// });

// module.exports = sequelize;


//mongoDB syntax for connecting to database



const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;


const MongoConnect = callback => {
    MongoClient.connect(process.env.URI)
    .then(
        (client) => {
            _db = client.db();
            console.log('Connected!');
            callback()
        }
    )
    .catch(
        err => {
            console.log(err);
            throw err;
        }
    );
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConnect = MongoConnect;
exports.getDb = getDb;