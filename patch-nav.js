const fs = require('fs');
const path = require('path');

const dir = './ecotravel-website-main';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (let f of files) {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('<div class="menu">') && !content.includes('education.html')) {
    content = content.replace(
      /<a href="destinations\.html">Destinations<\/a>/g, 
      '<a href="destinations.html">Destinations</a>\n<a href="education.html">Education</a>'
    );
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + f);
  }
}
