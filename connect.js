import sqlite3 from 'sqlite3';

// Step 1 connect to the driver to talk to SQLite
const sql3 = sqlite3.verbose();

// Step 2 connect to a specific database
// Database(): database name, type of connection, callback function
// ':memory:' means to launch a new database in memory
// '' empty string will create a temporary file that disappears after termination
const DB = new sql3.Database('./my_data.db', sqlite3.OPEN_READWRITE, connected);

function connected(err) {
  // handle error from error passed to callback
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database. DB created/exist');
}

// When creating a table: Check if already exist
const sql = `CREATE TABLE IF NOT EXISTS enemies(
  enemy_id INTEGER PRIMARY KEY,
  enemy_name TEXT NOT NULL,
  enemy_reason TEXT NOT NULL
)`;

// Run accepts sql command as a string, an array of commands used in the sql statement,
// and a callback function

// DB.run: modifies data and returns no rows
// DB.get: fetches one single row
// DB.all: fetches all rows matching the query
DB.run(sql, [], (err) => {
  //handle the error here too
  if (err) {
    console.log('Error creating enemy table,', err.message);
  }
  console.log('table created or already exists');
});

export { DB };
