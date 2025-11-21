const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'casino_user',
    password: 'casino_password_secure',
    database: 'casino_db'
});

// Open the connection
connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database: ' + error.stack);
        return;
    }
    console.log('Successfully connected to the MySQL database.');
});

// Wrapper to mimic sqlite3 interface used in server.cjs
const db = {
    run: (sql, params, callback) => {
        // Replace SQLite specific syntax if necessary (basic replacement)
        // Note: This is a simple heuristic. For complex queries, manual adjustment is needed.
        const mysqlSql = sql.replace(/datetime\('now'\)/g, 'NOW()');

        connection.query(mysqlSql, params, function (err, results) {
            if (callback) {
                // Mocking the 'this' context for lastID and changes
                const context = {
                    lastID: results ? results.insertId : 0,
                    changes: results ? results.affectedRows : 0
                };
                callback.call(context, err);
            }
        });
    },
    get: (sql, params, callback) => {
        const mysqlSql = sql.replace(/datetime\('now'\)/g, 'NOW()');
        connection.query(mysqlSql, params, (err, results) => {
            if (err) return callback(err);
            // sqlite3 .get returns the first row, mysql returns an array
            callback(null, results && results.length > 0 ? results[0] : undefined);
        });
    },
    all: (sql, params, callback) => {
        const mysqlSql = sql.replace(/datetime\('now'\)/g, 'NOW()');
        connection.query(mysqlSql, params, (err, results) => {
            callback(err, results);
        });
    },
    serialize: (callback) => {
        // MySQL doesn't need serialize for this simple usage
        if (callback) callback();
    },
    close: () => {
        connection.end();
    }
};

module.exports = db;
