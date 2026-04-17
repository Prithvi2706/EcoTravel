const fs = require('fs');
const path = require('path');
const dir = './ecotravel-website-main';
const files = ['posts.html', 'myposts.html'];

const newNav = `<div class="dropdown dropdown-posts-wrapper">
        <a href="posts.html">Posts</a>
        <div class="dropdown-content posts-dropdown-content" style="display: none;">
          <a href="myposts.html" class="nav-my-posts" style="display:none; text-align: left; padding: 12px 16px;">My Posts</a>
        </div>
      </div>`;

for (let f of files) {
  let p = path.join(dir, f);
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8');
  let original = content;

  const r = /<a href="posts\.html"[^>]*>.*?<\/a>\s*<a href="myposts\.html"[^>]*>.*?<\/a>/gs;
  content = content.replace(r, newNav);
  
  if (content !== original) {
    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
  } else {
    console.log('No match for ' + f);
  }
}
