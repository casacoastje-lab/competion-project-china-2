// Test Supabase Login Script
// Run: node scripts/test-login.js

require('dotenv').config({ path: '../.env.local' });
const https = require('https');

const SUPABASE_URL = 'https://aawjwqudqkvlfuqepwst.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const email = 'hassanoubihi@stu.cwnu.edu.cn';
const password = 'cwnu2026';

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
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testLogin() {
  console.log('🧪 Testing Supabase Login...\n');
  console.log('Config:');
  console.log('  URL:', SUPABASE_URL);
  console.log('  Has Anon Key:', !!ANON_KEY);
  console.log('\nLogin credentials:');
  console.log('  Email:', email);
  console.log('  Password:', password);

  try {
    // Step 1: Check if user exists
    console.log('\n1️⃣ Checking if user exists...');
    const usersResult = await makeRequest('GET', '/auth/v1/admin/users', null, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    if (usersResult.status === 200) {
      const user = usersResult.data.users?.find(u => u.email === email);
      if (user) {
        console.log('  ✅ User found!');
        console.log('  ID:', user.id);
        console.log('  Confirmed:', user.email_confirmed_at ? 'Yes ✅' : 'No ❌');
      } else {
        console.log('  ❌ User NOT found in database');
        console.log('\n  💡 SOLUTION: Create user in Supabase Dashboard > Authentication > Users > Add User');
      }
    } else {
      console.log('  ⚠️ Could not list users (might need service role key)');
    }

    // Step 2: Try to login
    console.log('\n2️⃣ Attempting login...');
    const loginResult = await makeRequest('POST', '/auth/v1/token?grant_type=password', {
      email: email,
      password: password
    });

    console.log('  Status:', loginResult.status);
    
    if (loginResult.status === 200) {
      console.log('  ✅ Login SUCCESS!');
      console.log('  User ID:', loginResult.data.user?.id);
    } else {
      console.log('  ❌ Login FAILED');
      console.log('  Error:', loginResult.data.msg || loginResult.data.error_description || loginResult.data.error);
      
      if (loginResult.data.error === 'invalid_grant') {
        console.log('\n  💡 This means: Wrong password or user not found');
      }
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testLogin();
