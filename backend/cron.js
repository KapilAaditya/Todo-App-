require("dotenv").config();

const { CronJob } = require("cron");
const http = require("node:http");
const https = require("node:https");

const job = new CronJob(
    "*/15 * * * *",
    () => {
        const base = process.env.BACKEND_URL;

        if (!base) {
            console.log("❌ BACKEND_URL is not set in .env");
            return;
        }

        const url = new URL("/health", base).href;
        const client = url.startsWith("https:") ? https : http;

        client
            .get(url, (res) => {
                res.resume();

                if (res.statusCode === 200) {
                    console.log(`✅ Health check successful (${res.statusCode})`);
                } else {
                    console.log(`❌ Health check failed (${res.statusCode})`);
                }
            })
            .on("error", (err) => {
                console.error("❌ Health check error:", err.message);
            });
    },
    null,
    true,
    "Asia/Kolkata"
);

module.exports = job;