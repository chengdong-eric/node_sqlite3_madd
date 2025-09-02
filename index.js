import { DB } from './connect.js';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
//
app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.status(200);
  res.send('Mortal enemy service is online');
});

// get all item
app.get('/api', (req, res) => {
  res.set('content-type', 'application/json');
  const sql = 'SELECT * FROM enemies';
  let data = { enemies: [] };
  // handle any db error
  try {
    DB.all(sql, [], (err, rows) => {
      if (err) {
        throw err; // let catch handle it
      }
      rows.forEach((row) => {
        data.enemies.push({
          id: row.enemy_id,
          name: row.enemy_name,
          reason: row.enemy_reason,
        });
      });
      let content = JSON.stringify(data);
      res.send(content);
    });
  } catch (err) {
    console.log('Error getting all enemies from database', err.message);
    res.status(467);
    res.send(`{"code": 467, "status": "${err.message}"}`);
  }
});

// get single item
app.get('/api/:id', (req, res) => {
  re.set('content-type', 'application/json');
  const sql = 'INSERT INTO enemies(enemy_name, enemy_reason) VALUES ($name , $reason)';
  let newId;
  try {
    DB.run(sql, {$name: req.body.name, $reason: req.body.reason}, function(err) {
      // using 'function' instead of arrow function to use the 'this' keyword to refer back to DB object.
      if (err) throw err;
    })
  } catch (err) {
    
  }
});

// add item, return success message
app.post('/api', (req, res) => {});

// remove item, return success message
app.delete('/api', (req, res) => {});

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log('ERROR:', err.message);
  }
  console.log(`LISTENING on ${PORT}.`);
});
