const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync('.env', 'utf-8');
const lines = envContent.split('\n');
let url = '';
let anonKey = '';

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    url = trimmed.split('=')[1].trim();
  }
  if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    anonKey = trimmed.split('=')[1].trim();
  }
}

if (!url || !anonKey) {
  console.error('Missing Supabase URL or Anon Key');
  process.exit(1);
}

const tables = [
  'products',
  'product_variants',
  'orders',
  'order_items',
  'reviews',
  'inquiries'
];

async function backup() {
  const results = {};
  console.log(`Starting backup from ${url}...`);

  for (const table of tables) {
    try {
      const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`
        }
      });

      if (!res.ok) {
        console.error(`Failed to fetch ${table}: ${res.status} ${res.statusText}`);
        results[table] = { count: 0, status: 'ERROR', error: await res.text() };
        continue;
      }

      const data = await res.json();
      const filePath = path.join('backups', `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      results[table] = { count: data.length, status: 'OK', filePath };
      console.log(`Backed up ${table}: ${data.length} rows saved to ${filePath}`);
    } catch (err) {
      console.error(`Error backing up ${table}:`, err.message);
      results[table] = { count: 0, status: 'EXCEPTION', error: err.message };
    }
  }

  // Summary metadata file
  const metaPath = path.join('backups', `backup_summary.json`);
  fs.writeFileSync(metaPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    url,
    tables: results
  }, null, 2));

  console.log('\n--- BACKUP COMPLETE ---');
  console.table(Object.entries(results).map(([tbl, info]) => ({
    Table: tbl,
    Rows: info.count,
    Status: info.status
  })));
}

backup();
