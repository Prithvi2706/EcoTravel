const fs = require('fs');
const https = require('https');

let serverFile = fs.readFileSync('server.js', 'utf8');

const regex = /"https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)"/g;
let match;
let urls = [];
while ((match = regex.exec(serverFile)) !== null) {
  urls.push(match[1]); 
}

urls = [...new Set(urls)];

async function checkUrl(id) {
  return new Promise(resolve => {
    https.request({
      hostname: 'images.unsplash.com',
      path: '/photo-' + id,
      method: 'HEAD'
    }, (res) => {
      resolve({ id, status: res.statusCode });
    }).on('error', () => resolve({ id, status: 500 })).end();
  });
}

(async () => {
    let broken = [];
    console.log("Checking " + urls.length + " distinct images...");
    for (let id of urls) {
        let res = await checkUrl(id);
        if (res.status !== 200 && res.status !== 302 && res.status !== 301) {
            broken.push(id);
        }
    }
    console.log(`Found ${broken.length} broken un-fetchable images.`);
    
    broken.forEach((id, idx) => {
        let replacement = `"https://picsum.photos/seed/${id}/800/600"`;
        let brokenUrlStr = `"https://images.unsplash.com/photo-${id}"`;
        serverFile = serverFile.split(brokenUrlStr).join(replacement);
    });
    
    fs.writeFileSync('server.js', serverFile);
    console.log("Saved patched server.js");

    // Fix index.html hero image statically just to be perfectly safe
    let indexHtml = fs.readFileSync('./ecotravel-website-main/index.html', 'utf8');
    indexHtml = indexHtml.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+(\?auto[^"]+)?/, 'https://picsum.photos/seed/keralatrip/1200/800');
    fs.writeFileSync('./ecotravel-website-main/index.html', indexHtml);
    console.log("Patched hero banner!");
})();
