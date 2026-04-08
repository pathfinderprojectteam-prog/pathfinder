const axios = require('axios');
require('dotenv').config();

async function debugApplication() {
  const studentEmail = 'bilel2025@gmail.com';
  const studentPassword = '123456';

  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: studentEmail,
      password: studentPassword
    });
    const token = loginRes.data.token;
    console.log('Logged in as Student');

    // 2. Get all jobs to find one to apply to
    const jobsRes = await axios.get('http://localhost:5001/api/jobs');
    if (jobsRes.data.length > 0) {
      const jobId = jobsRes.data[0]._id;
      console.log(`Found job: ${jobId} (${jobsRes.data[0].title})`);
      console.log('Applying to job...');
      const applyJobRes = await axios.post(`http://localhost:5001/api/applications/job/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Job Application Success:', applyJobRes.data);
    }

    // 2.5 Get all freelance projects
    const freelanceRes = await axios.get('http://localhost:5001/api/freelance-projects');
    if (freelanceRes.data.length > 0) {
      const projectId = freelanceRes.data[0]._id;
      console.log(`Found project: ${projectId} (${freelanceRes.data[0].title})`);
      console.log('Applying to freelance...');
      const applyFreelanceRes = await axios.post(`http://localhost:5001/api/applications/freelance/${projectId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Freelance Application Success:', applyFreelanceRes.data);
    }

  } catch (err) {
    console.error('--- ERROR DEBUG ---');
    console.error('Status:', err.response?.status);
    console.error('Message:', err.response?.data?.message || err.message);
    if (err.response?.data?.error) console.error('Error Details:', err.response.data.error);
  }
}

debugApplication();
