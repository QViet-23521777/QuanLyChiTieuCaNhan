/*import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CHỈ GIỮ MIDDLEWARE CƠ BẢN NHẤT
app.use(cors());
app.use(express.json());

console.log('✅ Basic middleware loaded');

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check called');
  res.json({ 
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple test route
app.get('/test', (req, res) => {
  console.log('🧪 Test route called');
  res.json({ message: 'Test successful' });
});

// ===== DEBUG ROUTER IMPORTS =====
console.log('\n🔍 Starting router import tests...');

// Test 1: Import userRouter

// 404 handler với logging
app.use('*', (req, res) => {
  console.log('🔍 404 Request:', req.method, req.originalUrl);
  console.log('🔍 Headers:', req.headers);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    url: req.originalUrl,
    method: req.method
  });
});

// Error handler với logging chi tiết
app.use((error, req, res, next) => {
  console.log('🚨 ERROR DETAILS:');
  console.log('- Message:', error.message);
  console.log('- Stack:', error.stack);
  console.log('- Request URL:', req.originalUrl);
  console.log('- Request method:', req.method);
  console.log('- Request params:', req.params);
  console.log('- Request query:', req.query);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message,
    url: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
  console.log(`🌐 Test URLs:`);
  console.log(`   - http://localhost:${PORT}/health`);
  console.log(`   - http://localhost:${PORT}/test`);
  console.log(`   - http://localhost:${PORT}/api/users (if mounted)`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;*/