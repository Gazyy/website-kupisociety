const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Twilio credentials (set in .env or environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., whatsapp:+14155552671
const managerNumber = 'whatsapp:+6282249533901'; // Manager WhatsApp number

let client = null;
let twilioEnabled = false;
if (accountSid && authToken && twilioNumber) {
  client = twilio(accountSid, authToken);
  twilioEnabled = true;
} else {
  console.warn('⚠️ Twilio credentials not configured. /api/send-booking will be disabled until you set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER.');
}

// API endpoint to send booking notification
app.post('/api/send-booking', async (req, res) => {
  try {
    const { fullName, phone, date, time, guests, notes, timestamp } = req.body;

    // Validate required fields
    if (!fullName || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format message
    const message = `*BOOKING BARU - KUPI Society Ground*\n\n` +
      `*Nama:* ${fullName}\n` +
      `*Nomor HP:* ${phone}\n` +
      `*Tanggal:* ${date}\n` +
      `*Jam:* ${time}\n` +
      `*Jumlah Tamu:* ${guests}\n` +
      `${notes ? `*Catatan:* ${notes}\n` : ''}` +
      `\n_Diterima: ${timestamp}_`;

    if (!twilioEnabled) {
      return res.status(503).json({
        success: false,
        error: 'Booking API tidak aktif karena Twilio belum dikonfigurasi'
      });
    }

    // Send via Twilio WhatsApp API
    const result = await client.messages.create({
      from: twilioNumber,
      to: managerNumber,
      body: message
    });

    console.log(`✓ Booking notification sent. SID: ${result.sid}`);
    
    res.status(200).json({
      success: true,
      message: 'Booking notification sent to WhatsApp',
      messageSid: result.sid
    });

  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend running' });
});

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Email tidak valid' });
    }

    const filePath = path.join(__dirname, 'newsletter-subscribers.json');
    let subscribers = [];
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      subscribers = JSON.parse(raw || '[]');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    if (subscribers.includes(email)) {
      return res.status(200).json({ success: true, message: 'Email sudah terdaftar' });
    }

    subscribers.push(email);
    await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), 'utf8');

    res.status(200).json({ success: true, message: 'Email berhasil didaftarkan' });
  } catch (error) {
    console.error('Error newsletter:', error);
    res.status(500).json({ success: false, error: 'Terjadi kesalahan saat menyimpan email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📞 Notifications will be sent to: ${managerNumber}`);
});
