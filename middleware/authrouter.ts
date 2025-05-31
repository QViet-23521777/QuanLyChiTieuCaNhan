import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
// Import your auth controllers here
// import { login, register, refreshToken, logout } from '../controllers/authController';

const router = express.Router();

// Auth routes
router.post('/register', /* register controller */);
router.post('/login', /* login controller */);
router.post('/refresh-token', /* refreshToken controller */);
router.post('/logout', authenticateToken, /* logout controller */);

// Protected route example
router.get('/profile', authenticateToken, /* getProfile controller */);

// Admin only route example  
router.get('/admin/users', authenticateToken, authorizeRoles('admin'), /* getUsers controller */);

export default router;