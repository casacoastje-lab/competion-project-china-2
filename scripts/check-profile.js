require('dotenv').config({ path: '../.env.local' });
const https = require('https');

const SUPABASE_URL = 'https://aawjwqudqkvlfuqepwst.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function makeRequest(method, path, body = null, apiKey = ANON_KEY) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': apiKey,
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function checkAndSetAdmin() {
  console.log('🔍 Checking user profiles...\n');

  // Get all profiles
  const profilesResult = await makeRequest('GET', '/rest/v1/profiles?select=*');
  console.log('Profiles:', JSON.stringify(profilesResult.data, null, 2));

  // Get auth users
  const usersResult = await makeRequest('GET', '/auth/v1/admin/users', null, SERVICE_KEY);
  if (usersResult.status === 200) {
    console.log('\nAuth Users:', usersResult.data.users?.map(u => ({ email: u.email, id: u.id })));
  }
}

checkAndSetAdmin();
