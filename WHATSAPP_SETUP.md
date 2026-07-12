# Setup WhatsApp Booking Notifications - Gupshup

Booking akan langsung terkirim ke WhatsApp nomor Anda **082249533901** via Gupshup API (gratis, tanpa server).

## Quick Setup (5 menit)

### Step 1: Daftar Gupshup (Gratis)
1. Buka https://www.gupshup.io/
2. Klik **"Sign Up"** → pilih **"Business"**
3. Isi email dan password
4. Verifikasi email
5. Login ke dashboard

### Step 2: Setup WhatsApp Channel
1. Di dashboard, klik **"Channels"** 
2. Klik **"Add Channel"**
3. Pilih **"WhatsApp"**
4. Klik **"Set up WhatsApp"**
5. Pilih **"Try Sandbox"** (gratis, untuk testing)
6. Klik **"Start Sandbox"**
7. Ikuti instruksi untuk verify nomor WhatsApp Anda

### Step 3: Get API Credentials
1. Di dashboard Gupshup, klik **"API Keys"** atau **"Settings"**
2. Copy **API Key** (contoh: `GupshupAPIKey123456789`)
3. Di WhatsApp channel settings, copy **Source Phone Number** (contoh: 919999999999)

### Step 4: Update Website
1. Buka `index.html` dengan editor
2. Cari line ini (sekitar line 800):
```javascript
formData.append('source', '919xxxxxxxxx');
```
Ganti dengan nomor WhatsApp Gupshup Anda:
```javascript
formData.append('source', '919999999999');
```

3. Cari line ini:
```javascript
'Authorization': 'Bearer YOUR_GUPSHUP_API_KEY',
```
Ganti dengan API Key Anda:
```javascript
'Authorization': 'Bearer GupshupAPIKey123456789',
```

### Step 5: Test
1. Buka website di browser
2. Isi form booking lengkap
3. Submit
4. Tunggu 5 detik, cek WhatsApp Anda
5. Pesan booking akan muncul dari nomor Gupshup

## Contoh WhatsApp yang Diterima

```
*BOOKING BARU - KUPI Society Ground*

*Nama:* Budi Santoso
*Nomor HP:* 081234567890
*Tanggal:* Kamis, 10 Juli 2026
*Jam:* 14:30
*Jumlah Tamu:* 3 Tamu
*Catatan:* Meja dekat jendela

_Pesan otomatis dari website KUPI_
```

## Pricing

- **Free Sandbox**: Unlimited messages ke nomor yang sudah di-whitelist
- **Upgrade**: Rp 0 - Rp 100K/bulan untuk unlimited
- **No credit card** diperlukan untuk sandbox

## Troubleshooting

**Error: "Authorization failed"**
- Pastikan API Key benar
- Cek di console browser (F12 → Console)

**Pesan tidak terkirim**
- Pastikan nomor WhatsApp sudah di-whitelist
- Cek di Gupshup dashboard apakah ada error logs
- Pastikan format nomor benar (62XXXXXXXXX atau 919999999999)

**Error: "Invalid source phone"**
- Gunakan nomor Gupshup yang diberikan, bukan nomor personal

## Tips

- Gupshup sandbox cocok untuk testing, bisa unlimited
- Customer bisa reply langsung ke pesan booking
- Notifikasi real-time (langsung masuk WhatsApp)
- Bisa upgrade ke paid tier kapan saja

## Support

- Gupshup Docs: https://www.gupshup.io/developer/docs/
- WhatsApp API: https://www.gupshup.io/developer/docs/send-whatsapp-messages/
