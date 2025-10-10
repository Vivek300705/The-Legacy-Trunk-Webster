import puppeteer from 'puppeteer';
import Story from '../models/Story.model.js';
import Media from '../models/Media.model.js';
import Family from '../models/FamilyCircle.model.js'; // 👈 1. Import your Family model

// This function generates the HTML content for the PDF (no changes needed here)
const generateStoryHTML = (stories, familyName, allMedia) => {
  let storiesHtml = '';
  stories.forEach(story => {
    const storyMedia = allMedia.filter(
      (media) => media.associatedStory.toString() === story._id.toString()
    );

    let mediaHtml = '';
    if (storyMedia.length > 0) {
      mediaHtml += '<div class="media-container">';
      storyMedia.forEach(media => {
        if (media.mediaType === 'photo') {
          mediaHtml += `<img src="${media.fileUrl}" alt="Story media">`;
        }
      });
      mediaHtml += '</div>';
    }

    storiesHtml += `
      <div class="story">
        <h2>${story.title}</h2>
        <p class="author">By ${story.author.name}</p>
        <p class="date">${new Date(story.createdAt).toLocaleDateString()}</p>
        ${mediaHtml} 
        <div class="content">${story.content.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  });

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
        .media-container { margin: 20px 0; }
        .media-container img { max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px; }
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

    // 👇 2. Fetch the family circle document to get its name
    const family = await Family.findById(user.familyCircle);

    const stories = await Story.find({ familyCircle: user.familyCircle })
      .populate('author', 'name')
      .sort({ createdAt: 'asc' });

    if (stories.length === 0) {
      return res.status(404).json({ message: 'No stories found to export.' });
    }
    
    const storyIds = stories.map(s => s._id);
    const allMedia = await Media.find({ associatedStory: { $in: storyIds } });

    // 👇 3. Use the dynamic family name (with a fallback)
    const familyName = family ? family.name : 'Legacy';
    const htmlContent = generateStoryHTML(stories, familyName, allMedia);

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=family-stories.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error exporting PDF:", error);
    res.status(500).json({ message: 'Failed to export PDF.' });
  }
};