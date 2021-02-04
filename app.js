var express = require('express');
var logger = require('morgan');
var cors = require('cors');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.get('/ping', (req, res) => {
  res.send('pong');
});
app.get('/check-db-connector-installed', (req, res) => {
  try {
    require.resolve('pg')
    res.send('OK')
  } catch (err) {
    res.status(202).send(err.message)
  }
})
app.get('/check-db-connection', (req, res) => {
  runWithDBClient((err, client) => {
    if (!err) return res.send('OK')

    res.status(202).send(`${err.message}

      Environment variables:
      - DB_HOST: ${process.env.DB_HOST}
      - DB_PORT: ${process.env.DB_PORT}
      - DB_USER: ${process.env.DB_USER}
      - DB_PASS: ${process.env.DB_PASS}
      - DB_NAME: ${process.env.DB_NAME}
    `)
  })
})
app.get('/check-db-row', (req, res) => {
  runWithDBClient(async (error, client) => {
    if (error) return res.status(202).send('Could not connect to the database.')

    try {
      await client.query('create table if not exists bonus_exercise (id serial primary key, text varchar(11) not null)')
    } catch (_) {
      error = { message: 'Could not create the database table required for this execise.' }
    }

    if (!error) {
      try {
        const response = await client.query('select * from bonus_exercise limit 1;')

        if (response?.rows?.[0]?.text !== 'BONUS_LEVEL') {
          error = { message: '' }
        }
      } catch (err) {
        error = err
      }
    }

    if (error) return res.status(202).send(error.message)

    res.send('OK')
  })
})

async function runWithDBClient (callback) {
  let error
  let client

  try {
    const { Client } = require('pg')
    client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT
    })
    await client.connect()
  } catch (err) {
    error = err
    client = null
  }

  try {
    await callback(error, client)
  } finally {
    try {
      await client?.end()
    } catch (_) {}
  }
}

module.exports = app;
