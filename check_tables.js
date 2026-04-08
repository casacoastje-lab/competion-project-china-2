const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://aawjwqudqkvlfuqepwst.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhd2p3cXVkcWt2bGZ1cWVwd3N0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ2NTgwOSwiZXhwIjoyMDkxMDQxODA5fQ.TtKmHj0zQiiGd9JAqEnWtCKa8EDAbaE37L6sIZwaB3U';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkTables() {
  console.log('Checking existing tables in Supabase...\n');
  
  const tables = ['profiles', 'categories', 'posts', 'landmarks', 'lessons', 'badges', 'comments', 'likes', 'bookmarks', 'user_progress', 'user_badges'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`✗ ${table}: ${error.message}`);
      } else {
        console.log(`✓ ${table}: exists`);
      }
    } catch (e) {
      console.log(`✗ ${table}: ${e.message}`);
    }
  }
  
  console.log('\n--- Checking categories (sample data) ---');
  const { data: cats } = await supabase.from('categories').select('*');
  console.log('Categories:', cats?.length || 0);
  
  console.log('\n--- Checking landmarks (sample data) ---');
  const { data: lands } = await supabase.from('landmarks').select('*');
  console.log('Landmarks:', lands?.length || 0);
}

checkTables().catch(console.error);