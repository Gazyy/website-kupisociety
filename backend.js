const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Twilio credentials (set in .env or environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., whatsapp:+14155552671
const managerNumber = 'whatsapp:+6282249533901'; // Manager WhatsApp number

const client = twilio(accountSid, authToken);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📞 Notifications will be sent to: ${managerNumber}`);
});
