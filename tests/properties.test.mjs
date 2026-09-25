import test from 'node:test';
import assert from 'node:assert/strict';
import { createPropertiesHandler } from '../api/properties.js';

const property = { public_id: 'PROP-100', property_type: 'Flat', bedrooms: 5,
  location: 'jagadeesh nagar', photos: [], notes: '', verification_status: 'APPROVED',
  status: 'VERIFIED', publish_status: 'PUBLISHED', availability_status: 'AVAILABLE' };

async function request(query = {}, rows = [property]) {
  const sql = async (parts, ...values) => {
    const statement = parts.join('?');
    if (!statement.startsWith('SELECT')) return [];
    // Every lookup must retain the public-inventory restrictions.
    for (const guard of ["verification_status='APPROVED'", "status='VERIFIED'", "publish_status='PUBLISHED'", "availability_status='AVAILABLE'"]) assert.ok(statement.includes(guard));
    const visible = rows.filter(row => row.verification_status === 'APPROVED' && row.status === 'VERIFIED' && row.publish_status === 'PUBLISHED' && row.availability_status === 'AVAILABLE');
    if (statement.includes('public_id=?')) return visible.filter(row => row.public_id === values[0]);
    return values[0] === null ? visible : visible.slice(0, values[0]);
  };
  const res = { statusCode: 0, setHeader() {}, end(body) { this.body = JSON.parse(body); } };
  await createPropertiesHandler(async () => sql)({ method: 'GET', query }, res);
  return res;
}

test('a URL advertised in the collection resolves to the same listing', async () => {
  const collection = await request();
  const listing = collection.body.listings[0];
  const detail = await request({ slug: listing.slug });
  assert.equal(detail.statusCode, 200);
  assert.deepEqual(detail.body.listing, listing);
});
test('legacy property IDs and uppercase slug requests still resolve', async () => {
  assert.equal((await request({ id: 'prop-100' })).body.listing.publicId, 'PROP-100');
  assert.equal((await request({ id: '5-BHK-FLAT-JAGADEESH-NAGAR-NELLORE' })).body.listing.publicId, 'PROP-100');
});
test('missing and unpublished properties return 404 without a collection', async () => {
  for (const query of [{slug:'missing'}, {id:'PROP-404'}]) assert.equal((await request(query)).statusCode, 404);
  for (const patch of [{publish_status:'DRAFT'}, {verification_status:'PENDING'}, {status:'NEW'}, {availability_status:'SOLD'}]) {
    const response = await request({slug:'5-bhk-flat-jagadeesh-nagar-nellore'}, [{...property,...patch}]);
    assert.equal(response.statusCode,404);
    assert.equal(response.body.listing, undefined);
  }
});
test('detail lookup is not limited to the first 250 listings', async () => {
  const rows = Array.from({length:251}, (_, i) => ({...property,public_id:`PROP-${i}`,location:`Area ${i}`}));
  assert.equal((await request({}, rows)).body.listings.length, 250);
  assert.equal((await request({slug:'5-bhk-flat-area-250-nellore'},rows)).body.listing.publicId,'PROP-250');
});
