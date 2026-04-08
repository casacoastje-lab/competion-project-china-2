const fs = require('fs');

let sql = fs.readFileSync('./supabase/migrations/001_initial_setup.sql', 'utf8');

// Fix the Chinese quotes issue in JSON
sql = sql.replace(/"黄金时代"/g, '「黄金时代」');

fs.writeFileSync('./supabase/migrations/001_initial_setup.sql', sql);
console.log('Fixed JSON quotes in SQL file');