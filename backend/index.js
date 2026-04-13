const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const { URL } = require('url');
const { Client } = require('pg');

// Initialize table if it doesn't exist
const initDb = async () => {
  try {
    const dbUrlStr = process.env.DATABASE_URL || 'postgresql://postgres:password@db:5432/devops_roadmap';
    const parsedUrl = new URL(dbUrlStr);
    const targetDb = parsedUrl.pathname.slice(1);
    
    // Connect to default 'postgres' db
    parsedUrl.pathname = '/postgres';
    const adminClient = new Client({ connectionString: parsedUrl.toString() });
    
    try {
      await adminClient.connect();
      const res = await adminClient.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`, [targetDb]);
      if (res.rowCount === 0) {
        console.log(`Database ${targetDb} does not exist, creating...`);
        // Cannot use parameterized queries for CREATE DATABASE
        await adminClient.query(`CREATE DATABASE "${targetDb}"`);
        console.log(`Database ${targetDb} created.`);
      }
    } catch (e) {
      console.warn("Could not check/create database (might exist or insufficient permissions):", e.message);
    } finally {
      await adminClient.end();
    }

    // Now connect to the target database and initialize table
    await db.query(`
      CREATE TABLE IF NOT EXISTS progress (
        day INTEGER PRIMARY KEY,
        completed BOOLEAN DEFAULT TRUE
      )
    `);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database', err);
  }
};

initDb();

// Get all completed days
app.get('/api/progress', async (req, res) => {
  try {
    const result = await db.query('SELECT day FROM progress');
    const days = result.rows.map(row => row.day);
    res.json(days);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upsert a completed day
app.post('/api/progress/:day', async (req, res) => {
  const { day } = req.params;
  const { completed } = req.body;

  try {
    if (completed) {
      await db.query('INSERT INTO progress (day) VALUES ($1) ON CONFLICT (day) DO NOTHING', [day]);
    } else {
      await db.query('DELETE FROM progress WHERE day = $1', [day]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
