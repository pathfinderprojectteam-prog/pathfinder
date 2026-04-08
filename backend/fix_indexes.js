const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('applications');
    
    console.log('Fetching indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Look for student_1_job_1 or any similar problematic index
    const problematicIndexes = indexes.filter(idx => 
      idx.name !== '_id_' && 
      (idx.name.includes('student') || idx.name.includes('job') || idx.name.includes('freelance') || idx.name.includes('scholarship'))
    );

    for (const idx of problematicIndexes) {
      console.log(`Dropping index: ${idx.name}`);
      await collection.dropIndex(idx.name);
    }

    console.log('Indexes dropped. We now rely on applicationController manual checks for duplicates.');
    
    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error fixing indexes:', err);
  }
}

fixIndexes();
