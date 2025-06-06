import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Giả sử bạn có User model - thay thế bằng database thực của bạn
import { getUserByEmail, addUser, getUserById } from '../QuanLyTaiChinh-backend/userServices';
import { User } from '../models/types';

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
];

const registerValidation = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải từ 2-50 ký tự'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ')
];

// Hàm tạo JWT token
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || 'admin'
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// LOGIN ENDPOINT
router.post('/login', validateRequest(loginValidation), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Tìm user trong database
    const user = await getUserByEmail(email);
    if (!user || user.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
      return;
    }

    const foundUser = user[0]; // Lấy user đầu tiên từ array
    
    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
      return;
    }

    // Tạo JWT token
    const token = generateToken(foundUser);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: foundUser.Id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// REGISTER ENDPOINT
router.post('/register', validateRequest(registerValidation), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await getUserByEmail(email);
    if (existingUser && existingUser.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const newUser = {
        name,
        email,
        password: hashedPassword,
        familyId: null, // Thay đổi từ 'family' thành 'familyId'
        phone,
        role: 'admin' as "admin" // default role
    };

    const saved = await addUser(newUser);
    const savedUser = await getUserById(saved);
    
    // Tạo token cho user mới
    const token = generateToken(savedUser);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        token,
        user: {
          id: savedUser.Id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role
        }
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// VERIFY TOKEN ENDPOINT (optional)
router.get('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Không có token'
      });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: 'Token không hợp lệ'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Token hợp lệ',
        data: decoded
      });
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

export default router;
