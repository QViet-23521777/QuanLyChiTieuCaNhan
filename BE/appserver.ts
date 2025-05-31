import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { 
  corsOptions,
  securityMiddleware,
  generalLimiter,
  authLimiter, 
  sanitizeInput,
  validateContentType,
  requestSizeLimit,
  simpleExpenseCache,
  apiVersion
} from '../middleware/index';
import admin from './firebase';
import { errorHandler } from '../middleware/errorHandler';

// Import routers
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import userrouters from '../routers/userRouter';
import familyrouters from '../routers/familyRouter';
import accountrouters from '../routers/accountRouter';
import transactionrouters from '../routers/transactionRouter';
import albumrouters from '../routers/albumRouter';
import photorouters from '../routers/photoRouter';
import chatroomrouters from '../routers/chatroomRouter';
import messagerouters from '../routers/messageRouter';
import socialpostrouters from '../routers/socialpostRouter';
import reviewrouters from '../routers/reviewRouter';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Apply middleware (thứ tự quan trọng!)
app.use(corsOptions);
app.use(securityMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);
app.use(sanitizeInput);
app.use(validateContentType);
app.use(requestSizeLimit);
// COMMENT TẠM để test
// app.use(simpleExpenseCache);
// app.use(apiVersion('1.0.0'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Middleware loaded successfully');

// ============================================
// API routers - DEBUG TỪNG BƯỚC
// ============================================

// Wrapper function for middleware
const wrapMiddleware = (middleware: any) => {
  return (req: Request, res: Response, next: express.NextFunction) => {
    const result = middleware(req, res, next);
    if (result && typeof result.then === 'function') {
      result.catch(next);
    }
  };
};

// COMMENT TẤT CẢ ROUTES để test
console.log('About to load routes...');

// Test với chỉ 1 route đơn giản nhất
try {
  console.log('Loading users router...');
  app.use('/api/users', userrouters);
  console.log('✅ Users router loaded');
} catch (error) {
  console.log('❌ Error loading users router:', error);
}

// COMMENT TẤT CẢ ROUTES KHÁC để test
/*
try {
  console.log('Loading families router...');
  app.use('/api/families', familyrouters);
  console.log('✅ Families router loaded');
} catch (error) {
  console.log('❌ Error loading families router:', error);
}

try {
  console.log('Loading accounts router...');
  app.use('/api/accounts', accountrouters);
  console.log('✅ Accounts router loaded');
} catch (error) {
  console.log('❌ Error loading accounts router:', error);
}

try {
  console.log('Loading transactions router...');
  app.use('/api/transactions', transactionrouters);
  console.log('✅ Transactions router loaded');
} catch (error) {
  console.log('❌ Error loading transactions router:', error);
}

try {
  console.log('Loading albums router...');
  app.use('/api/albums', albumrouters);
  console.log('✅ Albums router loaded');
} catch (error) {
  console.log('❌ Error loading albums router:', error);
}

try {
  console.log('Loading photos router...');
  app.use('/api/photos', photorouters);
  console.log('✅ Photos router loaded');
} catch (error) {
  console.log('❌ Error loading photos router:', error);
}

try {
  console.log('Loading chatrooms router...');
  app.use('/api/chatrooms', chatroomrouters);
  console.log('✅ Chatrooms router loaded');
} catch (error) {
  console.log('❌ Error loading chatrooms router:', error);
}

try {
  console.log('Loading messages router...');
  app.use('/api/messages', messagerouters);
  console.log('✅ Messages router loaded');
} catch (error) {
  console.log('❌ Error loading messages router:', error);
}

try {
  console.log('Loading social posts router...');
  app.use('/api/social-posts', socialpostrouters);
  console.log('✅ Social posts router loaded');
} catch (error) {
  console.log('❌ Error loading social posts router:', error);
}

try {
  console.log('Loading reviews router...');
  app.use('/api/reviews', reviewrouters);
  console.log('✅ Reviews router loaded');
} catch (error) {
  console.log('❌ Error loading reviews router:', error);
}

// Admin routes
try {
  console.log('Loading admin reviews router...');
  app.use('/api/admin/reviews', 
    wrapMiddleware(authenticateToken),
    wrapMiddleware(authorizeRoles('admin')),
    reviewrouters
  );
  console.log('✅ Admin reviews router loaded');
} catch (error) {
  console.log('❌ Error loading admin reviews router:', error);
}
*/

console.log('All routes loaded successfully');

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});

// Global error handler (phải để cuối cùng)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔥 Firebase initialized successfully`);
});

export default app;