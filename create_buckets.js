const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://aawjwqudqkvlfuqepwst.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhd2p3cXVkcWt2bGZ1cWVwd3N0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ2NTgwOSwiZXhwIjoyMDkxMDQxODA5fQ.TtKmHj0zQiiGd9JAqEnWtCKa8EDAbaE37L6sIZwaB3U';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function createBuckets() {
  const buckets = [
    { id: 'avatars', name: 'avatars', public: true, file_size_limit: 2097152, allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp'] },
    { id: 'post-images', name: 'post-images', public: true, file_size_limit: 5242880, allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] },
    { id: 'lesson-media', name: 'lesson-media', public: true, file_size_limit: null, allowed_mime_types: null }
  ];

  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.createBucket(bucket.id, {
      name: bucket.name,
      public: bucket.public,
      file_size_limit: bucket.file_size_limit,
      allowed_mime_types: bucket.allowed_mime_types
    });
    
    if (error) {
      console.log(`Bucket ${bucket.id}: ${error.message}`);
    } else {
      console.log(`✓ Bucket ${bucket.id} created`);
    }
  }
}

createBuckets();