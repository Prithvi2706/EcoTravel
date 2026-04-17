const fs = require('fs');
const path = require('path');
const dir = './ecotravel-website-main';

const postsPath = path.join(dir, 'posts.html');
const mypostsPath = path.join(dir, 'myposts.html');

if(fs.existsSync(postsPath)) {
    const content = fs.readFileSync(postsPath, 'utf8');
    const tabHTML = `
<div style="display: flex; justify-content: center; gap: 20px; z-index: 10; position: relative; margin-top: -30px; margin-bottom: 30px;">
  <a href="posts.html" class="btn primary" style="box-shadow: 0 10px 20px rgba(0,0,0,0.5); margin: 0;">Global Feed</a>
  <a href="myposts.html" class="btn secondary" style="background: rgba(30, 41, 59, 0.8); margin: 0;">My Posts</a>
</div>
<div class="pin-grid"`;
    if (!content.includes('Global Feed</a>')) {
        fs.writeFileSync(postsPath, content.replace('<div class="pin-grid"', tabHTML));
        console.log('posts updated');
    }
}

if(fs.existsSync(mypostsPath)) {
    const content = fs.readFileSync(mypostsPath, 'utf8');
    const tabHTML = `
<div style="display: flex; justify-content: center; gap: 20px; z-index: 10; position: relative; margin-top: -30px; margin-bottom: 30px;">
  <a href="posts.html" class="btn secondary" style="background: rgba(30, 41, 59, 0.8); margin: 0;">Global Feed</a>
  <a href="myposts.html" class="btn primary" style="box-shadow: 0 10px 20px rgba(0,0,0,0.5); margin: 0;">My Posts</a>
</div>
<div class="pin-grid"`;
    if (!content.includes('Global Feed</a>')) {
        fs.writeFileSync(mypostsPath, content.replace('<div class="pin-grid"', tabHTML));
        console.log('myposts updated');
    }
}
