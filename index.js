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
  res.set('content-type', 'application/json');
  const sql = 'SELECT * FROM enemies WHERE enemy_id = $id';
  const id = req.params.id;
  let data = { enemy: null };
  try {
    DB.get(sql, { $id: id }, (err, row) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      data.enemy = [row.enemy_name, row.enemy_reason];

      let content = JSON.stringify(data);
      res.send(content);
    });
  } catch (err) {
    console.log('Error getting an enemy from database', err.message);
    res.status(469);
    res.send(`{"code": 469, "status": "${err.message}"}`);
  }
});

// add item, return success message
app.post('/api', (req, res) => {
  res.set('content-type', 'application/json');
  const sql =
    'INSERT INTO enemies(enemy_name, enemy_reason) VALUES ($name , $reason)';
  let newId;
  try {
    DB.run(
      sql,
      { $name: req.body.name, $reason: req.body.reason },
      function (err) {
        // using 'function' instead of arrow function to use the 'this' keyword to refer back to DB object.
        if (err) throw err;

        newId = this.lastID;
        res.status(201);
        let data = { status: 201, message: `Mortal enemy ${newId} saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      }
    );
  } catch (err) {
    console.log('Error getting all enemies from database', err.message);
    res.status(468);
    res.send(`{"code": 468, "status": "${err.message}"}`);
  }
});

// remove item, return success message
app.delete('/api', (req, res) => {
  res.set('content-type', 'application/json');
  const sql = 'DELETE FROM enemies WHERE enemy_id = $id';
  let id = req.query.id;
  try {
    DB.run(sql, { $id: id }, function (err) {
      if (err) throw err;
      if (this.changes === 1) {
        // one item deleted
        res.status(200);
        res.send(`{"message" : "Enemy ${id} was removed from list."}`);
      } else if (this.changes === 0) {
        // no deletes done
        res.status(404);
        res.send(`{"message" : "Not found, nothing to delete."}`);
      } else if (this.changes > 1) {
        res.status(400);
        res.send(
          `{"message": "I thought you were only going to delete one enemy"}`
        );
      } else {
        throw err('something unexpected happened while deleting enemies');
      }
    });
  } catch (err) {
    console.log('Error deleteing an enemy from database', err.message);
    res.status(470);
    res.send(`{"code": 470, "status": "${err.message}"}`);
  }
});

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log('ERROR:', err.message);
  }
  console.log(`LISTENING on ${PORT}.`);
});
