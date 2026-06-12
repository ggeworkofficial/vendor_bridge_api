const fs = require('fs');
const path = require('path');

const envContent = `PORT=5000
BASE_URL=http://localhost:5000

DB_HOST=YOUR_DB_HOST
DB_PORT=5432
DB_NAME=YOUR_DB_NAME
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD

REDIS_URL=redis://YOUR_REDIS_HOST:6379
`;

const configContent = `require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },

  test: {
    username: 'YOUR_TEST_DB_USER',
    password: 'YOUR_TEST_DB_PASSWORD',
    database: 'YOUR_TEST_DB_NAME',
    host: 'YOUR_TEST_DB_HOST',
    dialect: 'postgres'
  },

  production: {
    username: 'YOUR_PROD_DB_USER',
    password: 'YOUR_PROD_DB_PASSWORD',
    database: 'YOUR_PROD_DB_NAME',
    host: 'YOUR_PROD_DB_HOST',
    dialect: 'postgres'
  }
};
`;

try {
    // Create .env
    fs.writeFileSync(path.join(process.cwd(), '.env'), envContent, 'utf8');

    // Create config directory if it doesn't exist
    const configDir = path.join(process.cwd(), 'config');

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    // Create config.js
    fs.writeFileSync(
        path.join(configDir, 'config.js'),
        configContent,
        'utf8'
    );

    console.log('✅ .env created');
    console.log('✅ config/config.js created');
} catch (error) {
    console.error('❌ Setup failed:', error.message);
}