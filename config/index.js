require("dotenv").config();
const pkg = require("package.json");

const config = {
  app: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    port: Number(process.env.PORT) || 3000,
  },
  rateLimit: {
    requests: process.env.RATE_LIMIT_REQUESTS,
    duration: process.env.RATE_LIMIT_DURATION,
  },
};

module.exports = config;
