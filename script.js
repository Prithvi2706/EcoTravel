// AUTH GUARD
(function () {
  const isAuthPage = window.location.pathname.includes('auth.html');
  const userStr = sessionStorage.getItem("user");
  if (!userStr && !isAuthPage) {
    window.location.href = 'auth.html';
  }
})();

const API_BASE = 'http://localhost:5500';

// SIGNUP
async function signup() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  let pattern = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
  if (!pattern.test(password)) {
    showToast("Password must contain 8 characters, a number and uppercase letter", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      showToast("Signup successful! You can now log in.", "success");
      if (document.getElementById("authPopup")) {
        window.closePopup();
        setTimeout(() => window.openLogin(), 1500);
      } else {
        setTimeout(() => window.location.href = "login.html", 1500);
      }
    } else {
      showToast(data.message || "Signup failed.", "error");
    }
  } catch (err) {
    console.warn("Offline fallback", err);
    showToast("Signup successful! You can now log in. (Offline Mode)", "success");
    if (document.getElementById("authPopup")) {
      window.closePopup();
      setTimeout(() => window.openLogin(), 1500);
    } else {
      setTimeout(() => window.location.href = "login.html", 1500);
    }
  }
}

// LOGIN
async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      showToast("Login successful!", "success", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80");
      sessionStorage.setItem("user", JSON.stringify({ email }));
      if (document.getElementById("authPopup")) {
        window.closePopup();
        updateAuthState();
      } else {
        setTimeout(() => window.location.href = "index.html", 1000);
      }
    } else {
      showToast(data.message || "Login failed.", "error");
    }
  } catch (err) {
    console.warn("Offline fallback", err);
    showToast("Login successful! (Offline Mode)", "success", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80");
    sessionStorage.setItem("user", JSON.stringify({ email }));
    if (document.getElementById("authPopup")) {
      window.closePopup();
      updateAuthState();
    } else {
      setTimeout(() => window.location.href = "index.html", 1000);
    }
  }
}

const fallbackDestinations = [
  {
    id: 1,
    title: "Bali Eco Retreat",
    description: "Sustainable jungle stays and nature tours.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2"
    ],
    category: "eco-stay",
    score: 95,
    lessCrowdedAlternative: "Sidemen Valley",
    ecoTransport: "Electric Scooter rentals",
    peakTimes: "July & August (Dry Season)",
    lat: -8.409518, lng: 115.188919
  },
  {
    id: 2,
    title: "Iceland Nature Trails",
    description: "Low-impact travel experiences in nature.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b"
    ],
    category: "trekking",
    score: 98,
    lessCrowdedAlternative: "The Westfjords Region",
    ecoTransport: "Carpooling and Public EV Buses",
    peakTimes: "Summer (June to August)",
    lat: 64.128288, lng: -21.827774
  },
  {
    id: 3,
    title: "Maldives Coral Tours",
    description: "Support coral reef conservation efforts while enjoying crystal clear waters.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
      "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992"
    ],
    category: "conservation",
    score: 92,
    lessCrowdedAlternative: "Fuvahmulah Biosphere",
    ecoTransport: "Solar-powered ferries",
    peakTimes: "December to April",
    lat: 3.2028, lng: 73.2207
  },
  {
    id: 4,
    title: "Costa Rica Rainforest",
    description: "Immersive biodiversity tours with zero carbon footprint.",
    image: "https://picsum.photos/seed/1465146344425-aa76ce914902/800/600",
    images: [
      "https://picsum.photos/seed/1465146344425-aa76ce914902/800/600",
      "https://picsum.photos/seed/1426604908110-61424bcb4ea3/800/600",
      "https://picsum.photos/seed/1464822759023-fea09fc08803/800/600"
    ],
    category: "eco-stay",
    score: 99,
    lessCrowdedAlternative: "Osa Peninsula",
    ecoTransport: "Local hybrid shuttles",
    peakTimes: "December to April",
    lat: 9.7489, lng: -83.7534
  },
  {
    id: 5,
    title: "Kyoto Heritage",
    description: "Experience ancient temples while supporting local artisans.",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3",
    images: [
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338"
    ],
    category: "culture",
    score: 94,
    lessCrowdedAlternative: "Ohara & Kurama",
    ecoTransport: "Kyoto Municipal Subway",
    peakTimes: "Cherry Blossom Season (April)",
    lat: 35.0116, lng: 135.7681
  },
  {
    id: 6,
    title: "Swiss Alps Cabins",
    description: "Solar-powered lodges embedded deep in the snowy peaks.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
    images: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
      "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b",
      "https://picsum.photos/seed/1447752809965-92682f520512/800/600"
    ],
    category: "eco-stay",
    score: 97,
    lessCrowdedAlternative: "Appenzell District",
    ecoTransport: "SBB Electric Train Net",
    peakTimes: "Ski Season (December to February)",
    lat: 46.5600, lng: 7.9800
  },
  {
    id: 7,
    title: "Amazon Conservation",
    description: "Volunteer to protect the rainforest and its diverse wildlife.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
    images: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
      "https://picsum.photos/seed/1470071131384-001b85f55cb8/800/600",
      "https://picsum.photos/seed/1473773508681-bc015fbe8e45/800/600"
    ],
    category: "conservation",
    score: 96,
    lessCrowdedAlternative: "Madidi National Park",
    ecoTransport: "River kayaks & community boats",
    peakTimes: "Dry Season (June to November)",
    lat: -3.4653, lng: -62.2159
  },
  {
    id: 8,
    title: "Patagonia Trails",
    description: "Hike the majestic glaciers leaving nothing but footprints.",
    image: "https://images.unsplash.com/photo-1519120944692-1a8d8cfc107f",
    images: [
      "https://images.unsplash.com/photo-1519120944692-1a8d8cfc107f",
      "https://picsum.photos/seed/1455215664188-66270b201a43/800/600",
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd"
    ],
    category: "trekking",
    score: 98,
    lessCrowdedAlternative: "Aysén Region",
    ecoTransport: "Shared trekking shuttles",
    peakTimes: "Summer (January to February)",
    lat: -50.9423, lng: -73.4068
  },
  {
    id: 9,
    title: "Kerala Backwaters, India",
    description: "Float through the serene interconnected canals supporting local village life.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e"
    ],
    category: "culture",
    score: 96,
    lessCrowdedAlternative: "Kavvayi Backwaters",
    ecoTransport: "Traditional punting boats",
    peakTimes: "Winter (December to January)",
    lat: 9.4981, lng: 76.3388
  },
  {
    id: 10,
    title: "Munnar Tea Gardens, Kerala",
    description: "Lush green rolling hills with community-run sustainable farming tours.",
    image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e",
    images: [
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e",
      "https://picsum.photos/seed/1447752809965-92682f520512/800/600",
      "https://picsum.photos/seed/1470071131384-001b85f55cb8/800/600"
    ],
    category: "eco-stay",
    score: 94,
    lessCrowdedAlternative: "Kolukkumalai Tea Estate",
    ecoTransport: "Walking trails & shared jeeps",
    peakTimes: "September to March",
    lat: 10.0889, lng: 77.0595
  },
  {
    id: 11,
    title: "Valley of Flowers, Uttarakhand",
    description: "Hike a pristine, UNESCO-protected alpine valley accessible only by foot.",
    image: "https://picsum.photos/seed/1473773508681-bc015fbe8e45/800/600",
    images: [
      "https://picsum.photos/seed/1473773508681-bc015fbe8e45/800/600",
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd",
      "https://picsum.photos/seed/1455215664188-66270b201a43/800/600"
    ],
    category: "trekking",
    score: 99,
    lessCrowdedAlternative: "Nanda Devi Biosphere",
    ecoTransport: "Strictly walking only",
    peakTimes: "Monsoon blooming (July-August)",
    lat: 30.7280, lng: 79.6053
  },
  {
    id: 12,
    title: "Mawlynnong, Meghalaya",
    description: "Known as Asia's cleanest village, entirely community-managed with living root bridges.",
    image: "https://picsum.photos/seed/1426604908110-61424bcb4ea3/800/600",
    images: [
      "https://picsum.photos/seed/1426604908110-61424bcb4ea3/800/600",
      "https://picsum.photos/seed/1464822759023-fea09fc08803/800/600",
      "https://picsum.photos/seed/1465146344425-aa76ce914902/800/600"
    ],
    category: "culture",
    score: 100,
    lessCrowdedAlternative: "Nongriat Village",
    ecoTransport: "Trekking by foot",
    peakTimes: "Autumn (October-November)",
    lat: 25.2017, lng: 91.9168
  },
  {
    id: 13,
    title: "Majuli Island, Assam",
    description: "The world's largest river island, pioneering bamboo eco-resorts and tribal art.",
    image: "https://picsum.photos/seed/1447752809965-92682f520512/800/600",
    images: [
      "https://picsum.photos/seed/1447752809965-92682f520512/800/600",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b"
    ],
    category: "conservation",
    score: 98,
    lessCrowdedAlternative: "Dibru-Saikhowa",
    ecoTransport: "Bicycle rentals & ferries",
    peakTimes: "Winter (November to March)",
    lat: 26.9535, lng: 94.1714
  }
];

// GLOBALS
let currentDestId = null;
let currentMap = null;
let allDestinations = [];

// DESTINATIONS FETCH
async function loadDestinations() {
  const grid = document.getElementById("destinations-grid");
  if (!grid) return;

  try {
    grid.innerHTML = "<p>Loading eco-friendly destinations...</p>";
    const res = await fetch(`${API_BASE}/api/destinations`);
    if (!res.ok) throw new Error("Fallback");
    allDestinations = await res.json();
  } catch (err) {
    console.warn("Backend unreachable. Using fallback destinations.");
    allDestinations = fallbackDestinations;
  }

  grid.innerHTML = "";
  allDestinations.forEach(dest => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";
    card.onclick = () => window.location.href = 'destination-info.html?id=' + dest.id;
    card.innerHTML = `
        <img src="${dest.image}" alt="${dest.title}">
        <h3>${dest.title}</h3>
        <p>${dest.description}</p>
        <span class="score-badge">Eco Score: ${dest.score}</span>
      `;
    grid.appendChild(card);
  });
}

// DESTINATION DETAILS PAGE LOGIC
async function loadDestinationDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const destId = urlParams.get('id');
  if (!destId) return;

  let dest;
  try {
    const res = await fetch(`${API_BASE}/api/destinations/` + destId);
    if (!res.ok) throw new Error("Fallback");
    dest = await res.json();
  } catch (err) {
    console.warn("Backend unreachable. Using fallback destination info.");
    dest = fallbackDestinations.find(d => d.id == destId);
  }

  if (!dest) return;

  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";

  const content = document.getElementById("dest-content");
  if (content) content.style.display = "block";

  document.getElementById("detail-hero-img").src = dest.image;
  document.getElementById("detail-title").innerText = dest.title;
  document.getElementById("detail-score").innerText = "Eco Score: " + dest.score;
  document.getElementById("detail-desc").innerText = dest.description;

  const lessCrowded = document.getElementById("detail-less-crowded");
  if (lessCrowded) lessCrowded.innerText = dest.lessCrowdedAlternative ? "Instead of the main hotspots, consider visiting " + dest.lessCrowdedAlternative + " for a quieter and more sustainable experience." : "No alternative listed.";

  const peakTimes = document.getElementById("detail-peak-times");
  if (peakTimes) peakTimes.innerText = dest.peakTimes ? "Avoid traveling during " + dest.peakTimes + ". It is typically overcrowded and stresses local resources." : "Travel year-round.";

  const ecoTrans = document.getElementById("detail-eco-transport");
  if (ecoTrans) ecoTrans.innerText = dest.ecoTransport ? "Try " + dest.ecoTransport + " as a low-carbon transport alternative." : "Walk or cycle when possible.";

  const gallery = document.getElementById("detail-gallery");
  if (dest.images && gallery) {
    dest.images.forEach(img => {
      gallery.innerHTML += `<img src="${img}" alt="gallery image" style="cursor: pointer;" onclick="openLightbox('${img}')">`;
    });
  }

  const userStr = sessionStorage.getItem("user");
  const mapSection = document.getElementById("map-section");
  if (userStr && mapSection) {
    mapSection.style.display = "block";
    const currentMap = L.map('info-map-container').setView([dest.lat, dest.lng], 11);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(currentMap);

    L.circleMarker([dest.lat, dest.lng], {
      color: '#10b981', radius: 12, fillOpacity: 0.8
    }).addTo(currentMap);
  }

  loadPosts(destId);
}

// LIGHTBOX LOGIC
function openLightbox(src) {
  let lightbox = document.getElementById("lightboxOverlay");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightboxOverlay";
    lightbox.className = "lightbox";
    lightbox.onclick = closeLightbox;
    lightbox.innerHTML = `
      <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
      <img class="lightbox-content" id="lightboxImg">
    `;
    document.body.appendChild(lightbox);
  }
  document.getElementById("lightboxImg").src = src;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightboxOverlay");
  if (lightbox) lightbox.style.display = "none";
}

async function loadPosts(destId) {
  const container = document.getElementById("reviewsContainer");
  if (!container) return;
  container.innerHTML = "Loading reviews...";
  try {
    const res = await fetch(`${API_BASE}/api/destinations/${destId}/posts`);
    const posts = await res.json();
    if (posts.length === 0) {
      container.innerHTML = "<p>No reviews yet. Be the first to share your experience!</p>";
      return;
    }

    container.innerHTML = "";
    posts.forEach(p => {
      const ratingStr = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
      let imgHtml = p.image ? `<img src="${p.image}" style="width: 100%; border-radius: 12px; margin-top: 10px;" alt="Review Image">` : '';
      container.innerHTML += `
        <div class="review-card" style="margin-bottom: 20px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
          <h4 style="color: var(--accent-primary);">👤 ${p.author}</h4>
          <div class="rating" style="color: gold; margin-bottom: 10px;">${ratingStr}</div>
          <p style="color: var(--text-muted); line-height: 1.5;">${p.text}</p>
          ${imgHtml}
        </div>
      `;
    });
  } catch (e) {
    console.warn("Offline fallback for reviews.");
    container.innerHTML = "";
    const p = { author: "Guest Traveler", text: "Amazing experience! Very green and beautiful.", rating: 5, image: null };
    const ratingStr = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
    container.innerHTML += `
        <div class="review-card" style="margin-bottom: 20px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
          <h4 style="color: var(--accent-primary);">👤 ${p.author}</h4>
          <div class="rating" style="color: gold; margin-bottom: 10px;">${ratingStr}</div>
          <p style="color: var(--text-muted); line-height: 1.5;">${p.text}</p>
        </div>
    `;
  }
}

function injectGlobalFAB() {
  const userStr = sessionStorage.getItem("user");
  let fab = document.getElementById("globalFabBtn");
  let postModal = document.getElementById("globalPostModal");

  if (userStr) {
    if (!fab) {
      fab = document.createElement("button");
      fab.id = "globalFabBtn";
      fab.className = "global-fab-plus";
      fab.innerText = "+";
      fab.onclick = openPostForm;
      document.body.appendChild(fab);
    }
    fab.style.display = "flex";

    if (!postModal) {
      postModal = document.createElement("div");
      postModal.id = "globalPostModal";
      postModal.className = "popup";
      postModal.innerHTML = `
        <div class="popup-box ultra-glass-modal" style="width: 500px; max-width: 90vw; position: relative; overflow: hidden; padding: 40px; border-radius: 24px;">
          <!-- Glowing Orbs -->
          <div class="glow-orb orb-1"></div>
          <div class="glow-orb orb-2"></div>
          
          <div style="position: relative; z-index: 2;">
            <h2 class="animated-gradient-text" style="text-align:center; font-size: 28px; margin-bottom: 25px;">✨ Share Your Journey</h2>
            
            <div class="input-group">
              <span class="input-icon">📍</span>
              <select id="postDestSelect" class="sleek-input"><option value="">Loading destinations...</option></select>
            </div>
            
            <div class="input-group">
              <span class="input-icon">👤</span>
              <input type="text" id="postAuthor" class="sleek-input" placeholder="Your Name" readonly>
            </div>
            
            <div class="input-group" style="align-items: flex-start;">
              <span class="input-icon" style="margin-top: 12px;">📝</span>
              <textarea id="postText" class="sleek-input sleek-textarea" placeholder="Describe the vibe... What made it unforgettable?" rows="4"></textarea>
            </div>

            <!-- Custom Stars -->
            <div style="margin-bottom: 20px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 15px;">
              <span style="font-weight: 500; color: var(--text-muted);">Rate:</span>
              <div class="interactive-stars" id="interactiveStars">
                <!-- Stars rendered by JS -->
              </div>
              <input type="hidden" id="postRating" value="5">
            </div>

            <!-- Custom Dropzone -->
            <div class="file-dropzone" id="fileDropzone" onclick="document.getElementById('postImage').click()">
              <div class="dropzone-content" id="dropzoneContent">
                <span style="font-size: 32px; display: block; margin-bottom: 10px;">📸</span>
                <span class="dropzone-text">Click or Drag Photos Here</span>
              </div>
              <input type="file" id="postImage" accept="image/*" style="display: none;">
              <img id="postImagePreview" style="display: none; width: 100%; height: 200px; object-fit: cover; border-radius: 12px;">
            </div>

            <button class="btn primary glowing-btn" style="width:100%; margin-top: 25px;" onclick="submitPost()">Post to Community</button>
            <button class="btn secondary minimalist-btn" style="width:100%; margin-top: 10px; border:none; background:transparent;" onclick="closePostForm()">Cancel</button>
          </div>
        </div>`;
      document.body.appendChild(postModal);

      document.getElementById('postImage').addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            const img = document.getElementById('postImagePreview');
            const content = document.getElementById('dropzoneContent');
            img.src = evt.target.result;
            img.style.display = 'block';
            content.style.display = 'none';
            document.getElementById('fileDropzone').classList.add('has-image');
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      });

      renderInteractiveStars();
    }
  } else {
    if (fab) fab.style.display = "none";
  }
}

async function openPostForm() {
  const userStr = sessionStorage.getItem("user");
  if (!userStr) return;
  const user = JSON.parse(userStr);

  const destSelect = document.getElementById("postDestSelect");
  if (allDestinations.length === 0) {
    const res = await fetch(`${API_BASE}/api/destinations`);
    allDestinations = await res.json();
  }
  destSelect.innerHTML = allDestinations.map(d => `<option value="${d.id}">${d.title}</option>`).join('');

  const urlParams = new URLSearchParams(window.location.search);
  const destId = urlParams.get('id');
  if (destId) destSelect.value = destId;

  document.getElementById("postAuthor").value = user.email.split('@')[0];
  document.getElementById("postText").value = "";
  document.getElementById("postRating").value = "5";
  updateStars(5);
  const img = document.getElementById('postImagePreview');
  const content = document.getElementById('dropzoneContent');
  if (img) { img.style.display = 'none'; img.src = ''; }
  if (content) { content.style.display = 'block'; }
  const dz = document.getElementById('fileDropzone');
  if (dz) dz.classList.remove('has-image');


  const modal = document.getElementById("globalPostModal");
  modal.style.display = "flex";
  setTimeout(() => {
    modal.querySelector('.ultra-glass-modal').classList.add('active');
  }, 10);
}

function closePostForm() {
  const modal = document.getElementById("globalPostModal");
  modal.querySelector('.ultra-glass-modal').classList.remove('active');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function renderInteractiveStars() {
  const container = document.getElementById("interactiveStars");
  if (!container) return;
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = "★";
    star.className = "interactive-star";
    star.onclick = () => updateStars(i);

    star.onmouseover = () => mockStars(i);
    star.onmouseout = () => resetStars();
    container.appendChild(star);
  }
  updateStars(5);
}

function updateStars(rating) {
  document.getElementById("postRating").value = rating;
  resetStars();
}

function mockStars(rating) {
  const stars = document.querySelectorAll('.interactive-star');
  stars.forEach((s, idx) => {
    if (idx < rating) {
      s.style.color = '#fbbf24';
      s.style.textShadow = '0 0 10px rgba(251, 191, 36, 0.8)';
    } else {
      s.style.color = 'var(--surface-border)';
      s.style.textShadow = 'none';
    }
  });
}

function resetStars() {
  const rating = parseInt(document.getElementById("postRating").value || 5);
  mockStars(rating);
}

async function submitPost() {
  const destId = document.getElementById("postDestSelect").value;
  const author = document.getElementById("postAuthor").value;
  const text = document.getElementById("postText").value;
  const rating = document.getElementById("postRating").value;

  const imgPreview = document.getElementById("postImagePreview");
  const imageBase64 = imgPreview.style.display === 'block' ? imgPreview.src : null;

  if (!text) return showToast("Please write a review text", "error");

  try {
    const res = await fetch(`${API_BASE}/api/destinations/${destId}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, text, rating, image: imageBase64 })
    });
    if (!res.ok) throw new Error("Fallback");
    const data = await res.json();
    if (data.success) {
      showToast("<span style='color: black;'>Post added successfully!</span>", "success");
      closePostForm();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('id') == destId) {
        loadPosts(destId);
      }
      if (window.location.pathname.includes('posts.html') && window.loadGlobalPosts) window.loadGlobalPosts();
      if (window.location.pathname.includes('myposts.html') && window.loadMyPosts) window.loadMyPosts();
    } else {
      showToast("Failed to add post", "error");
    }
  } catch (err) {
    console.warn("Offline mode - mocking successful post.");
    showToast("<span style='color: black;'>Post added successfully! (Offline Mode)</span>", "success");
    closePostForm();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('id') == destId) {
      loadPosts(destId);
    }
    if (window.location.pathname.includes('posts.html') && window.loadGlobalPosts) window.loadGlobalPosts();
    if (window.location.pathname.includes('myposts.html') && window.loadMyPosts) window.loadMyPosts();
  }
}

// TOAST UI
function showToast(message, type = "success", imageUrl = null) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  let iconHtml = '';

  if (imageUrl) {
    iconHtml = `<img src="${imageUrl}" alt="popup icon" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid ${type === 'success' ? '#10b981' : '#ef4444'}; flex-shrink: 0;">`;
  } else {
    const svgPaths = type === "success"
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>';

    const iconColor = type === "success" ? "#10b981" : "#ef4444";
    const iconBg = type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)";

    iconHtml = `<div style="background: ${iconBg}; color: ${iconColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">${svgPaths}</svg>
    </div>`;
  }

  toast.innerHTML = `
    ${iconHtml}
    <span style="font-weight: 500; font-size: 15px;">${message}</span>
  `;

  toast.classList.remove("show");
  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// AUTH STATE
function updateAuthState() {
  const userStr = sessionStorage.getItem("user");
  const authContainer = document.querySelector(".auth-buttons");
  const myPostsNavList = document.querySelectorAll(".nav-my-posts");

  const postsDropdownContentList = document.querySelectorAll(".posts-dropdown-content");

  if (userStr) {
    if (authContainer) {
      const user = JSON.parse(userStr);
      const username = user.email.split('@')[0];
      authContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-weight: 500; font-size: 1rem; color: #10b981; display: flex; align-items: center; gap: 6px;">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                ${username}
            </span>
            <button class="btn secondary" onclick="logout()" style="margin: 0; padding: 10px 20px;">Logout</button>
        </div>
      `;
    }
    myPostsNavList.forEach(nav => { nav.style.display = "block"; });
    postsDropdownContentList.forEach(d => { d.style.display = ""; });
  } else {
    myPostsNavList.forEach(nav => { nav.style.display = "none"; });
    postsDropdownContentList.forEach(d => { d.style.display = "none"; });
  }
  injectGlobalFAB();
}

function logout() {
  sessionStorage.removeItem("user");
  window.location.reload();
}

// MAKE FUNCTIONS GLOBAL
window.signup = signup;
window.login = login;
window.logout = logout;
window.updateAuthState = updateAuthState;
window.showToast = showToast;
window.loadDestinationDetails = loadDestinationDetails;
window.openPostForm = openPostForm;
window.closePostForm = closePostForm;
window.submitPost = submitPost;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

// GLOBAL POSTS
async function loadGlobalPosts() {
  const grid = document.getElementById("global-posts-grid");
  if (!grid) return;
  grid.innerHTML = "<p>Loading posts...</p>";
  try {
    const res = await fetch(`${API_BASE}/api/posts`);
    const posts = await res.json();
    renderPostsGrid(grid, posts);
  } catch (err) {
    grid.innerHTML = "<p>Failed to load posts offline.</p>";
  }
}

async function loadMyPosts() {
  const grid = document.getElementById("my-posts-grid");
  if (!grid) return;
  const userStr = sessionStorage.getItem("user");
  if (!userStr) {
    grid.innerHTML = "<p>Please login to view your posts.</p>";
    return;
  }
  const user = JSON.parse(userStr);
  const userPrefix = user.email.split('@')[0];

  grid.innerHTML = "<p>Loading your posts...</p>";
  try {
    const res = await fetch(`${API_BASE}/api/posts`);
    let posts = await res.json();
    posts = posts.filter(p => p.author === userPrefix);
    renderPostsGrid(grid, posts, { isMyPosts: true });
  } catch (err) {
    grid.innerHTML = "<p>Failed to load posts offline.</p>";
  }
}

function renderPostsGrid(container, posts, options = {}) {
  const { isMyPosts = false } = options;
  if (posts.length === 0) {
    container.innerHTML = "<p>No posts to display.</p>";
    return;
  }
  container.innerHTML = "";
  posts.forEach(p => {
    const ratingStr = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
    let imgHtml = p.image ? `<img src="${p.image}" alt="Post Image" style="cursor:pointer;" onclick="openLightbox('${p.image}')">` : '';

    let deleteHtml = isMyPosts ? `
      <div class="post-options-dropdown" style="position: absolute; top: 15px; right: 15px; z-index: 10;">
        <div style="cursor: pointer; color: var(--text-main); background: rgba(0,0,0,0.5); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'; event.stopPropagation();">
          <svg fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          </svg>
        </div>
        <div style="display: none; position: absolute; right: 0; top: 100%; margin-top: 5px; background: var(--surface-color); border: 1px solid var(--surface-border); border-radius: 8px; padding: 5px 0; min-width: 120px; box-shadow: 0 4px 15px rgba(0,0,0,0.6); backdrop-filter: blur(10px);">
          <div style="padding: 10px 15px; cursor: pointer; color: #ef4444; font-weight: 500;" onclick="deletePost(${p.id})">Delete Post</div>
        </div>
      </div>` : '';

    container.innerHTML += `
      <div class="pin-card" style="position: relative;">
        ${deleteHtml}
        ${imgHtml}
        <div class="pin-author">👤 ${p.author}</div>
        <div class="pin-rating">${ratingStr}</div>
        <p style="color: var(--text-muted); line-height: 1.5; font-size: 15px;">${p.text}</p>
      </div>
    `;
  });
}

window.deletePost = function (postId) {
  let modal = document.getElementById('deleteConfirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'deleteConfirmModal';
    modal.className = 'popup';
    modal.innerHTML = `
            <div class="popup-box ultra-glass-modal" style="width: 400px; text-align: center; padding: 40px; border-radius: 24px; position: relative; overflow: hidden; max-width: 90vw;">
                <div class="glow-orb orb-1" style="background: #ef4444; width: 150px; height: 150px; top: -30px; left: -30px;"></div>
                <div class="glow-orb orb-2" style="background: #f97316; width: 180px; height: 180px; bottom: -50px; right: -50px;"></div>
                
                <div style="position: relative; z-index: 2;">
                    <div style="background: rgba(239, 68, 68, 0.2); color: #ef4444; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </div>
                    <h2 style="font-size: 24px; margin-bottom: 12px; color: var(--text-main);">Delete Post?</h2>
                    <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 15px; line-height: 1.6;">This action cannot be undone. Are you sure you want to permanently delete this post?</p>
                    
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button class="btn secondary minimalist-btn" style="flex: 1; border: 1px solid var(--surface-border); background: rgba(0,0,0,0.2);" onclick="closeDeleteModal()">Cancel</button>
                        <button class="btn primary" style="flex: 1; background: #ef4444; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);" id="confirmDeleteBtn">Delete</button>
                    </div>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  }

  modal.style.display = 'flex';
  setTimeout(() => modal.querySelector('.ultra-glass-modal').classList.add('active'), 10);

  document.getElementById('confirmDeleteBtn').onclick = async function () {
    closeDeleteModal();
    await executeDelete(postId);
  };
};

window.closeDeleteModal = function () {
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    modal.querySelector('.ultra-glass-modal').classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
  }
};

async function executeDelete(postId) {
  try {
    const res = await fetch(`${API_BASE}/api/posts/${postId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast("<span style='color: black;'>Post deleted successfully!</span>", "success");
      loadMyPosts();
      if (window.location.pathname.includes('posts.html') && window.loadGlobalPosts) window.loadGlobalPosts();
    } else {
      showToast("Failed to delete post", "error");
    }
  } catch (e) {
    showToast("Offline mode - post cannot be deleted", "error");
  }
}

window.loadGlobalPosts = loadGlobalPosts;
window.loadMyPosts = loadMyPosts;

// GLOBAL SEARCH
window.handleGlobalSearch = async function (query) {
  const resultsDiv = document.getElementById("searchResults");
  if (!resultsDiv) return;

  if (!query || query.trim() === "") {
    resultsDiv.style.display = "none";
    return;
  }

  if (allDestinations.length === 0) {
    try {
      const res = await fetch(`${API_BASE}/api/destinations`);
      if (!res.ok) throw new Error("Fallback");
      allDestinations = await res.json();
    } catch (err) {
      allDestinations = fallbackDestinations;
    }
  }

  const qStr = query.toLowerCase();
  const matched = allDestinations.filter(d => d.title.toLowerCase().includes(qStr) || d.description.toLowerCase().includes(qStr));

  if (matched.length > 0) {
    resultsDiv.innerHTML = matched.map(d => `
       <div style="padding: 10px; border-bottom: 1px solid var(--surface-border); cursor: pointer;" 
            onmouseover="this.style.background='rgba(16, 185, 129, 0.2)'" 
            onmouseout="this.style.background='transparent'" 
            onclick="window.location.href='destination-info.html?id=${d.id}'">
         <strong style="color: var(--accent-primary);">${d.title}</strong>
       </div>
     `).join('');
    resultsDiv.style.display = "block";
  } else {
    resultsDiv.innerHTML = `<div style="padding: 10px; color: var(--text-muted);">No matching destinations</div>`;
    resultsDiv.style.display = "block";
  }
};

document.addEventListener("click", (e) => {
  const resultsDiv = document.getElementById("searchResults");
  if (resultsDiv && e.target.id !== "globalSearchInput") {
    resultsDiv.style.display = "none";
  }
});

// INIT
document.addEventListener("DOMContentLoaded", () => {
  updateAuthState();
  loadDestinations();

  // COUNTERS (safe check)
  const counters = document.querySelectorAll(".stat");
  if (counters.length > 0) {
    counters.forEach(counter => {
      const update = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;
        const inc = target / 200;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(update, 10);
        } else {
          counter.innerText = target;
        }
      };
      update();
    });
  }

  // FAQ
  document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("click", () => {
      const ans = item.querySelector(".faq-answer");
      if (ans) {
        ans.style.display = ans.style.display === "block" ? "none" : "block";
      }
    });
  });
});
