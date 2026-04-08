const fs = require('fs');

const SUPABASE_URL = 'https://aawjwqudqkvlfuqepwst.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhd2p3cXVkcWt2bGZ1cWVwd3N0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ2NTgwOSwiZXhwIjoyMDkxMDQxODA5fQ.TtKmHj0zQiiGd9JAqEnWtCKa8EDAbaE37L6sIZwaB3U';

const sql = fs.readFileSync('./supabase/migrations/001_initial_setup.sql', 'utf8');

async function executeSQL() {
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--') && !s.trim().startsWith('/*'));
  
  console.log(`Applying ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (stmt.length === 0 || stmt.includes('storage.buckets')) continue;
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`
        },
        body: JSON.stringify({ query: stmt })
      });
      
      if (!res.ok) {
        const err = await res.text();
        console.log(`Stmt ${i+1}: ${err.substring(0, 150)}`);
      }
    } catch (e) {
      console.log(`Stmt ${i+1} failed: ${e.message}`);
    }
  }
  
  console.log('Done! Check Supabase dashboard for results.');
}

executeSQL().catch(console.error);