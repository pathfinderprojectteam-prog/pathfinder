const axios = require('axios');

async function verifyLogins() {
  const accounts = [
    { email: 'admin@pathfinder.com', password: 'Admin123' },
    { email: 'iset@gmail.com', password: '123456' },
    { email: 'cpg@gmail.com', password: '123456' },
    { email: 'upwork@gmail.com', password: '123456' },
    { email: 'bilel2025@gmail.com', password: '123456' }
  ];

  console.log('--- VERIFYING LOGINS ---\n');

  for (const acc of accounts) {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', acc);
      console.log(`PASS: ${acc.email}`);
      console.log(`Role: ${response.data.role}`);
      console.log(`Token: ${response.data.token.substring(0, 15)}...\n`);
    } catch (err) {
      console.error(`FAIL: ${acc.email}`);
      console.error(`Error: ${err.response?.data?.message || err.message}\n`);
    }
  }
}

verifyLogins();
