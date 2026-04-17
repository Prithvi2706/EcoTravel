const nodemailer = require('nodemailer');

const EMAIL_USER = 'ecotravel192@gmail.com';
const EMAIL_PASS = 'mvwu fbcl rijc wbdt';

console.log("Testing with:", EMAIL_USER, EMAIL_PASS);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

async function testEmail() {
    try {
        console.log("Verifying connection to Gmail SMTP...");
        await transporter.verify();
        console.log("Connection verified. Attempting to send test email...");
        
        const info = await transporter.sendMail({
            from: `"EcoTravel Security" <${EMAIL_USER}>`,
            to: EMAIL_USER,
            subject: "Test Email from Node.js",
            text: "This is a test email.",
        });
        
        console.log("Success! Message sent:", info.messageId);
    } catch (e) {
        console.error("Error occurred:", e);
    }
}

testEmail();
