const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'dummy_key';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Generate a professional summary via OpenRouter API
 */
const generateAISummary = async (profile, careerGoal) => {
  const skills = (profile.skills || []).map(s => s.name).join(', ');
  const prompt = `Write a short, professional, ATS-optimized CV summary (max 3 sentences) for a candidate targeting a '${careerGoal}' role. Their key skills are: ${skills || 'learning'}.`;
  
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.warn('OpenRouter API Summary Error:', error.message);
    return profile.bio || 'Motivated professional actively seeking new opportunities.';
  }
};

/**
 * Generate an ATS-optimized PDF CV Buffer
 */
const generatePDF = async (profile, careerGoal) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const summary = await generateAISummary(profile, careerGoal);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text(profile.user?.name || 'Candidate Name', { align: 'center' });
      doc.fontSize(12).font('Helvetica').text(profile.user?.email || 'email@example.com', { align: 'center' });
      doc.moveDown();

      // Summary
      doc.fontSize(14).font('Helvetica-Bold').text('Professional Summary');
      doc.fontSize(11).font('Helvetica').text(summary);
      doc.moveDown();

      // Skills
      doc.fontSize(14).font('Helvetica-Bold').text('Skills');
      const skillsMatch = (profile.skills || []).map(s => s.name).join(', ');
      doc.fontSize(11).font('Helvetica').text(skillsMatch || 'N/A');
      doc.moveDown();

      // Experience
      doc.fontSize(14).font('Helvetica-Bold').text('Experience');
      if (profile.experiences && profile.experiences.length > 0) {
        profile.experiences.forEach(exp => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${exp.title} - ${exp.company || ''}`);
          doc.fontSize(11).font('Helvetica').text(`${exp.years} years`);
          if (exp.description) doc.fontSize(10).text(exp.description);
          doc.moveDown(0.5);
        });
      } else {
        doc.fontSize(11).font('Helvetica').text('No experience listed.');
      }
      doc.moveDown();

      // Education
      doc.fontSize(14).font('Helvetica-Bold').text('Education');
      if (profile.educations && profile.educations.length > 0) {
        profile.educations.forEach(edu => {
          doc.fontSize(12).font('Helvetica-Bold').text(edu.degree);
          doc.fontSize(11).font('Helvetica').text(edu.institution || '');
          doc.moveDown(0.5);
        });
      } else {
        doc.fontSize(11).font('Helvetica').text('No education listed.');
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate an ATS-optimized DOCX CV Buffer
 */
const generateDOCX = async (profile, careerGoal) => {
  const summaryText = await generateAISummary(profile, careerGoal);
  
  const skillsText = (profile.skills || []).map(s => s.name).join(', ');
  
  const expParagraphs = (profile.experiences || []).map(exp => {
    return new Paragraph({
      children: [
        new TextRun({ text: `${exp.title} - ${exp.company || ''}`, bold: true }),
        new TextRun({ text: `\n${exp.years} years`, break: 1 }),
        new TextRun({ text: exp.description ? `\n${exp.description}` : '', break: 1 })
      ]
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: profile.user?.name || 'Candidate Name',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: profile.user?.email || 'email@example.com',
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Professional Summary',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: summaryText }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Skills',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: skillsText || 'N/A' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Experience',
            heading: HeadingLevel.HEADING_2,
          }),
          ...expParagraphs.length ? expParagraphs : [new Paragraph({ text: 'No experience listed.' })],
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
};

module.exports = {
  generatePDF,
  generateDOCX,
  generateAISummary
};
