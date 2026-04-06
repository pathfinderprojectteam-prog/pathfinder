const axios = require('axios');

async function testGorseV1() {
  console.log("--- TESTING GORSE API v1 ---");
  try {
    const GORSE_URL = 'http://localhost:8088';
    
    console.log("1. Checking Gorse Health...");
    const health = await axios.get(`${GORSE_URL}/api/v1/health`);
    console.log("Gorse is running ✅");

    console.log("\n2. Inserting Test Student...");
    await axios.post(`${GORSE_URL}/api/v1/user`, {
      UserId: "student_456",
      Labels: ["React", "Nodejs", "JavaScript"],
      Comment: "Test Student"
    });
    console.log("User Inserted ✅");

    console.log("\n3. Inserting Sample Jobs...");
    const jobs = [
      { ItemId: "job_frontend", IsHidden: false, Categories: ["job"], Timestamp: new Date().toISOString(), Labels: ["React", "JavaScript"], Comment: "Frontend Developer" },
      { ItemId: "job_backend", IsHidden: false, Categories: ["job"], Timestamp: new Date().toISOString(), Labels: ["Nodejs", "Express"], Comment: "Backend Developer" },
      { ItemId: "job_fullstack", IsHidden: false, Categories: ["job"], Timestamp: new Date().toISOString(), Labels: ["React", "Nodejs"], Comment: "Fullstack Developer" }
    ];
    for (let job of jobs) {
      await axios.post(`${GORSE_URL}/api/v1/item`, job);
    }
    console.log("Jobs Inserted ✅");

    // We also need feedback for Gorse to generate personal recommendations
    console.log("\n4. Inserting Mock Feedback (User -> Job)...");
    await axios.post(`${GORSE_URL}/api/v1/feedback`, [
      { FeedbackType: "read", UserId: "student_456", ItemId: "job_frontend", Timestamp: new Date().toISOString() },
      { FeedbackType: "read", UserId: "student_456", ItemId: "job_fullstack", Timestamp: new Date().toISOString() }
    ]);
    console.log("Feedback Inserted ✅");

    console.log("\n5. Getting Recommendations...");
    const recs = await axios.get(`${GORSE_URL}/api/v1/recommend/student_456/job?n=10`);
    console.log("Recommended Items:", recs.data);
    console.log("\nGorse Integration SUCCESS ✅");
    
  } catch(e) {
    if (e.response) {
      console.log(`❌ GORSE ERROR [${e.response.status}]:`, e.response.data);
    } else {
      console.log("❌ GORSE ERROR:", e.message);
    }
  }
}

testGorseV1();
