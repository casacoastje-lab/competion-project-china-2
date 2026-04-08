const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = {
  user: 'postgres',
  host: 'db.aawjwqudqkvlfuqepwst.supabase.co',
  database: 'postgres',
  password: 'cp36149keywigh8E',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
};

const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_setup.sql');

async function runMigration() {
  const client = new Client(config);
  try {
    console.log('Reading migration file...');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully.');

    console.log('Executing migration script (this may take a minute)...');
    await client.query(sql);
    
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.hint) console.error('Hint:', err.hint);
  } finally {
    await client.end();
  }
}

runMigration();
