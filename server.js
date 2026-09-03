import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CommercePilot AI Enterprise Node.js Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'production'
  });
});

// Dynamic UPI QR Payment Intent Generator
app.post('/api/payment/generate-qr', (req, res) => {
  const { amount, orderId, merchantVpa } = req.body;
  const txnId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const vpa = merchantVpa || 'commercepilot@hdfcbank';
  const cleanAmount = Number(amount || 0).toFixed(2);
  
  // Standard NPCI UPI Intent URL
  const upiIntent = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=CommercePilot%20AI&tr=${txnId}&am=${cleanAmount}&cu=INR&tn=Order%20${orderId || 'Purchase'}`;

  res.json({
    success: true,
    transactionId: txnId,
    amount: cleanAmount,
    merchantVpa: vpa,
    merchantName: 'CommercePilot AI Enterprise Retail',
    upiIntent,
    expiresInSeconds: 300,
    validUntil: new Date(Date.now() + 300000).toISOString()
  });
});

// Secure PIN / OTP Verification Endpoint
app.post('/api/payment/verify-pin', (req, res) => {
  const { pin, paymentMethod, amount, orderId } = req.body;

  if (!pin || pin.length < 4) {
    return res.status(400).json({
      success: false,
      error: 'Invalid PIN length. 4 or 6-digit PIN required.'
    });
  }

  // Simulated bank authorization logic
  const authCode = `AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const rrn = `RRN${Date.now().toString().slice(-8)}`;

  setTimeout(() => {
    res.json({
      success: true,
      message: 'Payment authorized successfully by issuer bank.',
      authorizationCode: authCode,
      retrievalReferenceNumber: rrn,
      paymentMethod: paymentMethod || 'upi',
      authorizedAmount: amount,
      orderId,
      timestamp: new Date().toISOString()
    });
  }, 800);
});

// Serve compiled static files in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, { maxAge: '1d', etag: true }));

// Return 404 JSON for unhandled API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Client-side routing fallback for React Router in Express
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>CommercePilot AI Node.js Service</title></head>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2>CommercePilot AI Node.js Backend Active</h2>
            <p>Port: ${PORT} | Health: <a href="/api/health">/api/health</a></p>
            <p>Run <code>npm run build</code> to generate the client bundle for production serving.</p>
          </body>
        </html>
      `);
    }
  });
});

const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`🚀 CommercePilot AI Node.js Server Active on http://${HOST}:${PORT}`);
  console.log(`👉 API Health: http://${HOST}:${PORT}/api/health`);
  console.log(`👉 Web Interface: http://${HOST}:${PORT}/`);
  console.log(`====================================================`);
});
