const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const EMAIL_USER = 'ecotravel192@gmail.com';
const EMAIL_PASS = 'mvwu fbcl rijc wbdt';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, 'ecotravel-website-main')));

// ===================================
// SYSTEM DATABASE SETUP
// ===================================
const usersFile = path.join(__dirname, 'users.json');
let users = [];

if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
} else {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

function saveUsers() {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

const postsFile = path.join(__dirname, 'posts.json');
let posts = [];

if (fs.existsSync(postsFile)) {
    posts = JSON.parse(fs.readFileSync(postsFile));
} else {
    fs.writeFileSync(postsFile, JSON.stringify([]));
}

if (posts.length === 0) {
    const indianNames = ["Aarav Patel", "Priya Sharma", "Rahul Gupta", "Neha Desai"];
    const detailedReviews = [
        "My trip to the backwaters was absolutely magical. The serene environment, combined with the eco-friendly houseboat experience, made it an unforgettable journey. Waking up to the sound of birds and navigating through the calm waters was deeply rejuvenating. The local community was incredibly welcoming, sharing their sustainable fishing methods.",
        "Visiting the Western Ghats changed my perspective on nature conservation. The dense forests are home to an incredible variety of flora and fauna. I spent days trekking through the hidden trails, guided by indigenous tribes who imparted their vast knowledge of the ecosystem. Beautiful picturesque landscapes with rich biodiversity.",
        "The eco-retreat in the Himalayas exceeded all my expectations. Not only were the views of the snow-capped peaks breathtaking, but the resort's commitment to zero-waste and solar energy was truly inspiring. We engaged in tree-planting activities and learned about organic farming from the villagers.",
        "Exploring the heritage sites of Rajasthan while staying in restored havelis was a fantastic blend of history and sustainability. The attention to preserving water and promoting traditional crafts among the locals showcased a perfect model of responsible tourism. The intricate architecture was stunning, and the vibrant culture was mesmerizing."
    ];
    const reviewImages = [
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e",
        "https://picsum.photos/seed/1473773508681-bc015fbe8e45/800/600",
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2"
    ];

    for (let i = 0; i < indianNames.length; i++) {
        posts.push({
            id: Date.now() + i,
            destinationId: Math.floor(Math.random() * 13) + 1,
            author: indianNames[i],
            text: detailedReviews[i],
            rating: 5,
            image: reviewImages[i],
            date: new Date().toISOString()
        });
    }
    savePosts();
}

function savePosts() {
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

// ===================================
// AUTHENTICATION API
// ===================================
const otpStore = {};

app.post('/api/auth/signup', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const exists = users.find(u => u.email === email);
    if (exists) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    users.push({ email, password });
    saveUsers();
    return res.json({ success: true, message: "Signup successful" });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid Email or Password" });
    }

    return res.json({ success: true, message: "Login successful" });
});

app.post('/api/auth/forgot', async (req, res) => {
    const { email } = req.body;
    const userExists = users.find(u => u.email === email);
    if (!userExists) return res.status(404).json({ success: false, message: "No account found with that email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { code: otp, expires: Date.now() + 10 * 60 * 1000 };

    try {

        const mailOptions = {
            from: `"EcoTravel Security" <${EMAIL_USER}>`,
            to: email,
            subject: 'EcoTravel: Your Password Reset Verification Code',
            text: `Hello,\n\nWe received a request to reset the password for your EcoTravel account.\n\nYour One-Time Password (OTP) is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you didn't request this, you can safely ignore this email.\n\nBest,\nThe EcoTravel Team`,
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #10b981; padding: 25px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .content p { margin: 0 0 15px; font-size: 16px; }
        .otp-box { background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center; padding: 20px; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: 700; color: #0f172a; letter-spacing: 8px; margin: 0; }
        .warning { font-size: 14px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>EcoTravel</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset the password for the EcoTravel account associated with this email address.</p>
            <p>Please use the following One-Time Password (OTP) to complete the process:</p>
            
            <div class="otp-box">
                <p class="otp-code">${otp}</p>
            </div>
            
            <p>This code will expire in <strong>10 minutes</strong>. For your security, please do not share this code with anyone.</p>
            
            <div class="warning">
                <p><strong>Didn't request a password reset?</strong><br>
                If you didn't initiate this request, you can safely ignore this email. Your account remains completely secure.</p>
            </div>
        </div>
        <div class="footer">
            &copy; 2026 EcoTravel. All rights reserved.<br>
            This is an automated message, please do not reply.
        </div>
    </div>
</body>
</html>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent via email: %s", info.messageId);
        return res.json({ success: true, message: "OTP sent successfully to your email!" });
    } catch (error) {
        console.error("Nodemailer error:", error);
        return res.status(500).json({ success: false, message: "Failed to send email. Check server terminal logs." });
    }
});

app.post('/api/auth/reset', (req, res) => {
    const { email, otp, newPassword } = req.body;
    const store = otpStore[email];

    if (!store) return res.status(400).json({ success: false, message: "OTP not requested or expired." });
    if (Date.now() > store.expires) {
        delete otpStore[email];
        return res.status(400).json({ success: false, message: "OTP expired." });
    }
    if (store.code !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP code." });
    }

    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers();
        delete otpStore[email];
        return res.json({ success: true, message: "Password successfully updated. You can now login!" });
    } else {
        return res.status(404).json({ success: false, message: "User not found." });
    }
});

// ===================================
// DESTINATIONS API & DATA
// ===================================
const destinationsData = [
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

app.get('/api/destinations', (req, res) => {
    res.json(destinationsData);
});

app.get('/api/destinations/:id', (req, res) => {
    const destId = parseInt(req.params.id);
    const dest = destinationsData.find(d => d.id === destId);
    if (!dest) {
        return res.status(404).json({ success: false, message: "Destination not found" });
    }
    res.json(dest);
});

// ===================================
// COMMUNITY POSTS API
// ===================================
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.get('/api/destinations/:id/posts', (req, res) => {
    const destId = parseInt(req.params.id);
    const destPosts = posts.filter(p => p.destinationId === destId);
    res.json(destPosts);
});

app.post('/api/destinations/:id/posts', (req, res) => {
    const destId = parseInt(req.params.id);
    const { author, text, rating, image } = req.body;

    if (!author || !text || !rating) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newPost = {
        id: Date.now(),
        destinationId: destId,
        author,
        text,
        rating: parseInt(rating),
        image: image || null,
        date: new Date().toISOString()
    };

    posts.push(newPost);
    savePosts();

    res.json({ success: true, post: newPost });
});

app.delete('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ success: false, message: "Post not found" });
    }
    posts.splice(postIndex, 1);
    savePosts();
    res.json({ success: true, message: "Post deleted" });
});

// ===================================
// ROUTER FALLBACK & SERVER START
// ===================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'ecotravel-website-main', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
