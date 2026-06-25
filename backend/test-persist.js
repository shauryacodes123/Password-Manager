// Quick persistence test: save then reload and verify the row is still there
const base = 'http://localhost:3000';

async function test() {
  // 1. insert a row
  const item = { id: 'persist-test-' + Date.now(), site: 'https://example.com', username: 'u', password: 'p' };
  const saveRes = await fetch(base + '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  const saveBody = await saveRes.json();
  console.log('POST status:', saveRes.status, 'body:', JSON.stringify(saveBody));

  // 2. fetch all
  const listRes = await fetch(base + '/');
  const list = await listRes.json();
  console.log('Total rows after save:', list.length);

  // 3. simulate "reload" — fetch again
  const reloadRes = await fetch(base + '/');
  const reload = await reloadRes.json();
  const found = reload.find(r => r.id === item.id);
  console.log('Row present after reload:', !!found);
  console.log('Row data:', JSON.stringify(found));

  if (!found) {
    console.error('FAIL: data did not persist');
    process.exit(1);
  }
  console.log('PASS: persistence works');
}

test().catch(e => { console.error(e); process.exit(1); });
