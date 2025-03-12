require('dotenv').config();
const imaps = require('imap-simple');

async function getOTPFromEmail() {
    const config = {
        imap: {
            user: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASS,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false, // Ignore SSL errors
            },
            authTimeout: 3000,
        },
    };

    try {
        console.log("Opening connection...");
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        console.log("Searching for OTP email...");
        const searchCriteria = ["UNSEEN", ["SUBJECT", "Forgot Password OTP"]];
        const fetchOptions = { bodies: ["TEXT"], markSeen: true };
        const messages = await connection.search(searchCriteria, fetchOptions);

        for (let msg of messages) {
            const text = msg.parts.find(part => part.which === "TEXT").body; // ✅ FIXED

            // Extract OTP using regex that matches a 6-digit number
            const otpMatch = text.match(/\b\d{6}\b/);
            if (otpMatch) {
                console.log("✅ OTP Found:", otpMatch[0]);
                return otpMatch[0]; // Return the OTP
            }
        }

        console.log("⚠️ No OTP found.");
        return null;
    } catch (error) {
        console.error("❌ Error fetching OTP:", error);
    }
}

module.exports = getOTPFromEmail;
