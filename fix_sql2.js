const fs = require('fs');

let sql = fs.readFileSync('./supabase/migrations/001_initial_setup.sql', 'utf8');

// Fix Chinese quotes that break JSON - replace "麻辣" with 「麻辣」
sql = sql.replace(/\"麻辣\"/g, '「麻辣」');
sql = sql.replace(/\"mala\" \(numbing/g, 'Mala (numbing');

fs.writeFileSync('./supabase/migrations/001_initial_setup.sql', sql);
console.log('Fixed additional Chinese quotes');