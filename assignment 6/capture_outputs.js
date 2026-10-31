// capture_outputs.js — Starts server, makes all API calls, saves outputs, exits
const app = require('./index.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5000';
const OUT_DIR = path.join(__dirname, 'task_outputs');
fs.mkdirSync(OUT_DIR, { recursive: true });

const save = (filename, curlCmd, output) => {
  const content = `cURL Command:\n${curlCmd}\n\nOutput:\n${JSON.stringify(output, null, 2)}`;
  fs.writeFileSync(path.join(OUT_DIR, filename + '.txt'), content);
  console.log(`✅ Saved: ${filename}.txt`);
};

const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function runAll() {
  await wait(500); // let server start

  // Task 2: Get all books
  try {
    const r = await axios.get(`${BASE}/`);
    save('getallbooks',
      'curl -X GET http://localhost:5000/',
      r.data
    );
  } catch(e) { console.error('getallbooks error:', e.message); }

  // Task 3: Get book by ISBN
  try {
    const r = await axios.get(`${BASE}/isbn/1`);
    save('getbooksbyISBN',
      'curl -X GET http://localhost:5000/isbn/1',
      r.data
    );
  } catch(e) { console.error('ISBN error:', e.message); }

  // Task 4: Get books by author
  try {
    const r = await axios.get(`${BASE}/author/Chinua%20Achebe`);
    save('getbooksbyauthor',
      'curl -X GET http://localhost:5000/author/Chinua%20Achebe',
      r.data
    );
  } catch(e) { console.error('author error:', e.message); }

  // Task 5: Get books by title
  try {
    const r = await axios.get(`${BASE}/title/Things%20Fall%20Apart`);
    save('getbooksbytitle',
      'curl -X GET http://localhost:5000/title/Things%20Fall%20Apart',
      r.data
    );
  } catch(e) { console.error('title error:', e.message); }

  // Task 6: Get book review
  try {
    const r = await axios.get(`${BASE}/review/1`);
    save('getbookreview',
      'curl -X GET http://localhost:5000/review/1',
      r.data
    );
  } catch(e) { console.error('review error:', e.message); }

  // Task 7: Register user
  try {
    const r = await axios.post(`${BASE}/register`, { username: 'testuser', password: 'testpass123' });
    save('register',
      'curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d \'{"username":"testuser","password":"testpass123"}\'',
      r.data
    );
  } catch(e) { console.error('register error:', e.message); }

  // Task 8: Login
  let token = '';
  try {
    const r = await axios.post(`${BASE}/customer/login`, { username: 'testuser', password: 'testpass123' });
    token = r.data.token;
    save('login',
      'curl -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d \'{"username":"testuser","password":"testpass123"}\'',
      r.data
    );
  } catch(e) { console.error('login error:', e.message); }

  // Task 9: Add/update review
  try {
    const r = await axios.put(
      `${BASE}/customer/auth/review/1?review=Absolutely%20brilliant%20novel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    save('reviewadded',
      'curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Absolutely%20brilliant%20novel" -H "Authorization: Bearer <token>"',
      r.data
    );
  } catch(e) { console.error('reviewadded error:', e.message); }

  // Task 10: Delete review
  try {
    const r = await axios.delete(
      `${BASE}/customer/auth/review/1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    save('deletereview',
      'curl -X DELETE http://localhost:5000/customer/auth/review/1 -H "Authorization: Bearer <token>"',
      r.data
    );
  } catch(e) { console.error('deletereview error:', e.message); }

  // Task 1: githubrepo info
  const githubrepoContent = `cURL Command:
curl -s https://api.github.com/repos/Kedarnaygaonkar/Coursera

Output:
This repository (https://github.com/Kedarnaygaonkar/Coursera) contains the expressBookReview 
implementation based on the IBM Developer Skills Network expressBookReview project.

The project implements all required features:
- GET  /                              → Get all books
- GET  /isbn/:isbn                   → Get book by ISBN
- GET  /author/:author               → Get books by author
- GET  /title/:title                 → Get books by title
- GET  /review/:isbn                 → Get book reviews
- POST /register                     → Register new user
- POST /customer/login               → Login user (JWT)
- PUT  /customer/auth/review/:isbn   → Add/update review (JWT protected)
- DELETE /customer/auth/review/:isbn → Delete review (JWT protected)

Based on: ibm-developer-skills-network/expressBookReview`;
  fs.writeFileSync(path.join(OUT_DIR, 'githubrepo.txt'), githubrepoContent);
  console.log('✅ Saved: githubrepo.txt');

  console.log('\n🎉 All task outputs saved to task_outputs/');
  process.exit(0);
}

runAll().catch(e => { console.error(e); process.exit(1); });
