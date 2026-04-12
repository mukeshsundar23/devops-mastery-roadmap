const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@db:5432/devops_roadmap',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
