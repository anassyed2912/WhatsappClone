const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const PAYLOAD_DIR = path.join(__dirname, '../../sample_payloads');
const WEBHOOK_URL = process.env.LOCAL_WEBHOOK || process.env.WEBHOOK_URL || 'http://localhost:4000/webhook';

async function run() {
  const files = fs.existsSync(PAYLOAD_DIR) ? fs.readdirSync(PAYLOAD_DIR) : [];
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    const payload = JSON.parse(fs.readFileSync(path.join(PAYLOAD_DIR, f), 'utf-8'));
    try {
      const res = await axios.post(WEBHOOK_URL, payload);
      console.log('posted', f, '->', res.status);
    } catch (err) {
      console.error('error posting', f, err.message);
    }
  }
}

run();
