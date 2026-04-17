const fs = require('fs');
const path = require('path');
const dir = './ecotravel-website-main';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldDropdown = /<div class="dropdown dropdown-posts-wrapper">[\s\S]*?<\/div>\s*<\/div>/g;

const newPostsLink = `<a href="posts.html" id="nav-posts-link">Posts</a>`;

const searchInputRegex = /<input type="text" id="globalSearchInput" placeholder="Search destinations"([^>]*)>/g;
const newSearchInput = `<svg width="18" height="18" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); z-index: 10;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      <input type="text" id="globalSearchInput" placeholder="Search destinations" style="padding-left: 45px;"$1>`;

for (let f of files) {
  let p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  let original = content;

  content = content.replace(oldDropdown, newPostsLink);
  
  if (content.match(searchInputRegex) && !content.includes('viewBox="0 0 24 24" style="position: absolute; left: 16px;')) {
    content = content.replace(searchInputRegex, newSearchInput);
  }

  if (content !== original) {
    fs.writeFileSync(p, content);
    console.log('Updated', f);
  }
}
