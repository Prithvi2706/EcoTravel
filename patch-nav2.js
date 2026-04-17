const fs = require('fs');
const path = require('path');
const dir = './ecotravel-website-main';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const regex = /<a href="posts\.html">\s*Posts\s*<\/a>\s*<a href="myposts\.html"\s+class="nav-my-posts"\s*style="display:\s*none;?">\s*My Posts\s*<\/a>/gi;
const regex2 = /<a href="posts\.html">\s*Posts\s*<\/a>\s*<a href="myposts\.html"\s+class="nav-my-posts"\s*style="display:none;">\s*My Posts\s*<\/a>/gi;

const newNav = `<div class="dropdown dropdown-posts-wrapper">
        <a href="posts.html">Posts</a>
        <div class="dropdown-content posts-dropdown-content" style="display: none;">
          <a href="myposts.html" class="nav-my-posts" style="display:none; text-align: left; padding: 12px 16px;">My Posts</a>
        </div>
      </div>`;

let updated = 0;
for (let f of files) {
  let p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  let original = content;
  
  content = content.replace(regex, newNav);
  
  // Also fix education if patch-nav wasn't fully run
  // But strictly just myposts
  if (content === original) {
      content = content.replace(regex2, newNav);
  }
  
  if (content !== original) {
    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
    updated++;
  }
}
console.log('Total files updated:', updated);
