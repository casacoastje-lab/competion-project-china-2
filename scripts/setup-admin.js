// Admin User Setup Script for ChinaVerse
// Run this to create the admin user

require('dotenv').config({ path: '../.env.local' });
const https = require('https');

const supabaseUrl = 'https://aawjwqudqkvlfuqepwst.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const adminEmail = 'hassanoubihi@stu.cwnu.edu.cn';
const adminPassword = 'cwnu2026';
const adminUsername = 'admin_hassan';
const adminDisplayName = 'Hassan Admin';

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, supabaseUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
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
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function setupAdminUser() {
  console.log('🔧 Setting up admin user...');
  console.log(`   Email: ${adminEmail}`);

  try {
    // Step 1: Create user via Signup (this bypasses email confirmation when done with service key)
    console.log('\n1️⃣  Creating user...');
    const signupResult = await makeRequest('POST', '/auth/v1/signup', {
      email: adminEmail,
      password: adminPassword,
      data: {
        username: adminUsername,
        display_name: adminDisplayName,
        role: 'admin'
      }
    });

    if (signupResult.status === 200 || signupResult.status === 201) {
      console.log('✅ User created successfully!');
      const userId = signupResult.data.user?.id;
      
      if (userId) {
        // Step 2: Update profile to admin role
        console.log('\n2️⃣  Setting admin role in database...');
        const updateResult = await makeRequest('PATCH', `/rest/v1/profiles?id=eq.${userId}`, {
          role: 'admin',
          username: adminUsername,
          display_name: adminDisplayName
        });

        if (updateResult.status === 200 || updateResult.status === 204) {
          console.log('✅ Admin role set!');
        } else {
          console.log('⚠️  Profile update:', updateResult.data);
        }
      }
    } else if (signupResult.data?.msg?.includes('already been registered')) {
      console.log('📧 User already exists');
      
      // Find the user
      const listResult = await makeRequest('GET', '/auth/v1/admin/users');
      
      if (listResult.status === 200) {
        const user = listResult.data.users?.find(u => u.email === adminEmail);
        if (user) {
          console.log(`   Found user ID: ${user.id}`);
          
          // Update profile
          console.log('\n2️⃣  Setting admin role...');
          const updateResult = await makeRequest('PATCH', `/rest/v1/profiles?id=eq.${user.id}`, {
            role: 'admin',
            username: adminUsername,
            display_name: adminDisplayName
          });
          
          if (updateResult.status === 200 || updateResult.status === 204) {
            console.log('✅ Admin role set!');
          }
        }
      }
    } else {
      console.log('⚠️  Signup response:', signupResult);
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('\n📋 Admin Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANT: Disable email confirmation in Supabase Dashboard:');
    console.log('   Go to: Authentication > Settings > Confirm email > OFF');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupAdminUser();
