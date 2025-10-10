import puppeteer from 'puppeteer';
import Story from '../models/Story.model.js';

// This function generates the HTML content for the PDF
const generateStoryHTML = (stories, familyName) => {
  let storiesHtml = '';
  stories.forEach(story => {
    storiesHtml += `
      <div class="story">
        <h2>${story.title}</h2>
        <p class="author">By ${story.author.name}</p>
        <p class="date">${new Date(story.createdAt).toLocaleDateString()}</p>
        <div class="content">${story.content.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  });

  // This is the full HTML document for the PDF
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 1in; }
        .story { page-break-before: always; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
        .story:first-of-type { page-break-before: auto; }
        h1 { text-align: center; font-size: 36px; margin-bottom: 1in; }
        h2 { font-size: 24px; color: #333; }
        .author, .date { color: #777; font-style: italic; }
        .content { margin-top: 20px; text-align: justify; }
      </style>
    </head>
    <body>
      <h1>Stories from the ${familyName} Family</h1>
      ${storiesHtml}
    </body>
    </html>
  `;
};

export const exportStoriesAsPDF = async (req, res) => {
  try {
    const user = req.user;
    if (!user.familyCircle) {
      return res.status(400).json({ message: 'User is not in a family circle.' });
    }

    // 1. Fetch all stories for the family
    const stories = await Story.find({ familyCircle: user.familyCircle })
      .populate('author', 'name')
      .sort({ createdAt: 'asc' });

    if (stories.length === 0) {
      return res.status(404).json({ message: 'No stories found to export.' });
    }

    // 2. Generate HTML from the stories
    const familyName = user.familyCircle.name || 'Legacy'; // You might need to populate this
    const htmlContent = generateStoryHTML(stories, familyName);

    // 3. Launch Puppeteer
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // 4. Create PDF from HTML
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    // 5. Send PDF as a download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=family-stories.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error exporting PDF:", error);
    res.status(500).json({ message: 'Failed to export PDF.' });
  }
};