const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking connection to Supabase...');
  console.log('URL:', supabaseUrl);

  const { data, error } = await supabase
    .from('profiles')
    .select('count', { count: 'exact', head: true });

  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      console.log('Table "profiles" DOES NOT exist.');
    } else {
      console.error('Error checking tables:', error.message);
    }
  } else {
    console.log('Table "profiles" EXISTS.');
  }
}

checkTables();
