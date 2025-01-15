const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Razorpay ayarları
const razorpay = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID',
  key_secret: 'YOUR_RAZORPAY_KEY_SECRET',
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API: Ödeme oluşturma
app.post('/create-order', async (req, res) => {
  const { amount } = req.body; // Manat cinsinden alınır
  const amountInPaisa = amount * 100; // Razorpay, paisa (kuruş) cinsinden çalışır

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: 'INR', // Razorpay için uygun olan para birimi
      receipt: `order_rcptid_${Date.now()}`,
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
