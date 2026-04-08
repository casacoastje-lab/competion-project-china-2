const fs = require('fs');
const path = require('path');

const contentDataPath = 'c:/Users/Administrator/Desktop/china project competion/content_data.md';
const contentJsonPath = 'c:/Users/Administrator/Desktop/china project competion/apps/web/data/content.json';

const contentData = fs.readFileSync(contentDataPath, 'utf8');
const contentJson = JSON.parse(fs.readFileSync(contentJsonPath, 'utf8'));

// Helper to extract story between LANDMARK markers
function extractStory(idNum) {
    const startMarker = `### LANDMARK ${idNum.toString().padStart(2, '0')}`;
    const nextMarker = `### LANDMARK ${(idNum + 1).toString().padStart(2, '0')}`;
    const sectionStart = contentData.indexOf(startMarker);
    let sectionEnd = contentData.indexOf(nextMarker);
    if (sectionEnd === -1) sectionEnd = contentData.indexOf('# SECTION 2');
    
    const section = contentData.substring(sectionStart, sectionEnd);
    
    // Extract EN Story
    // Look for **Full Story (EN):** followed by text until **Full Story (ZH):**
    const enStart = section.indexOf('**Full Story (EN):**');
    const zhStart = section.indexOf('**Full Story (ZH):**');
    const enStory = enStart !== -1 ? section.substring(enStart + 20, zhStart).trim() : '';
    
    // Extract ZH Story
    // Look for **Full Story (ZH):** followed by text until --- or next landmark
    const zhStory = zhStart !== -1 ? section.substring(zhStart + 20).split('---')[0].trim() : '';
    
    return {
        en: enStory,
        zh: zhStory
    };
}

contentJson.landmarks = contentJson.landmarks.map((landmark, index) => {
    const stories = extractStory(index + 1);
    console.log(`Updating ${landmark.id}...`);
    return {
        ...landmark,
        en: { ...landmark.en, fullStory: stories.en },
        zh: { ...landmark.zh, fullStory: stories.zh }
    };
});

fs.writeFileSync(contentJsonPath, JSON.stringify(contentJson, null, 2));
console.log('Successfully updated content.json with 10 full stories.');
