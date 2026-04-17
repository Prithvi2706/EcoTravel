const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const facts = {
  1: { alt: "Sidemen Valley", trans: "Electric Scooter rentals", peak: "July & August (Dry Season)" },
  2: { alt: "The Westfjords Region", trans: "Carpooling and Public EV Buses", peak: "Summer (June to August)" },
  3: { alt: "Fuvahmulah Biosphere", trans: "Solar-powered ferries", peak: "December to April" },
  4: { alt: "Osa Peninsula", trans: "Local hybrid shuttles", peak: "December to April" },
  5: { alt: "Ohara & Kurama", trans: "Kyoto Municipal Subway", peak: "Cherry Blossom Season (April)" },
  6: { alt: "Appenzell District", trans: "SBB Electric Train Net", peak: "Ski Season (December to February)" },
  7: { alt: "Madidi National Park", trans: "River kayaks & community boats", peak: "Dry Season (June to November)" },
  8: { alt: "Aysén Region", trans: "Shared trekking shuttles", peak: "Summer (January to February)" },
  9: { alt: "Kavvayi Backwaters", trans: "Traditional punting boats", peak: "Winter (December to January)" },
  10: { alt: "Kolukkumalai Tea Estate", trans: "Walking trails & shared jeeps", peak: "September to March" },
  11: { alt: "Nanda Devi Biosphere", trans: "Strictly walking only", peak: "Monsoon blooming (July-August)" },
  12: { alt: "Nongriat Village", trans: "Trekking by foot", peak: "Autumn (October-November)" },
  13: { alt: "Dibru-Saikhowa", trans: "Bicycle rentals & ferries", peak: "Winter (November to March)" }
};

for (let i = 1; i <= 13; i++) {
  const regex = new RegExp(`(id:\\s*${i},\\s*)([\\s\\S]*?)(lat:\\s*-?\\d+\\.\\d+,\\s*lng:\\s*-?\\d+\\.\\d+)`);
  code = code.replace(regex, (match, p1, p2, p3) => {
    // avoid double injection if run twice
    if(p2.includes("lessCrowdedAlternative")) return match;
    return p1 + p2 + `lessCrowdedAlternative: "${facts[i].alt}",\n        ecoTransport: "${facts[i].trans}",\n        peakTimes: "${facts[i].peak}",\n        ` + p3;
  });
}

fs.writeFileSync('server.js', code);
console.log("Injected Eco Data successfully!");
