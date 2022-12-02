const mysql = require('mysql');
const fs = require('fs');


let dbInfo = JSON.parse(fs.readFileSync('./db_info.json', 'utf8'));
console.log(dbInfo);

var connection = mysql.createConnection({
    host: dbInfo.host,
    user: dbInfo.user,
    password: dbInfo.password,
    port: dbInfo.port
});



connection.connect(function (err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});


/*
connection.query('CREATE DATABASE feast_review', function (error, results, fields) {
    if (error) throw error;
    console.log('database created');
});
*/


connection.query('USE feast_review', function (error, results, fields) {
    if (error) throw error;
    console.log('using the database');
});


/*
connection.query('CREATE TABLE tests (queries int)', function (error, results, fields) {
    if (error) throw error;
    console.log('table created');
});
*/

/*
let randomNumber = String(Math.random() * 1000);
connection.query('INSERT INTO tests (queries) VALUES (' + randomNumber + ')', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});
*/


connection.query('SELECT * FROM tests', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});
