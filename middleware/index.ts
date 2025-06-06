import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from 'firebase-functions/v2';

export const corsOptions = cors ({
    origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

export const securityMiddleware = helmet({
    contentSecurityPolicy:
    {
        directives:
        {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:","blob:"],
            objectSrc: ["'none'"], 
            frameSrc: ["'none'"],
            frameAncestors: ["'none'"],
            connectSrc: [
                "'self'",
                // Thêm API endpoints 
            ],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        url: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent')
      });
      
      res.status(429).json({
        success: false,
        message
      });
    }
  });
};

export const generalLimiter = createRateLimit(
    15 * 60 * 1000, //15 phút
    100, //100 request
    'Quá nhiều yêu cầu, vui lòng thử lại sau'
);//có thể sửa

export const authLimiter = createRateLimit(
  15 * 60 * 1000, 
  5, 
  'Quá nhiều lần đăng nhập, vui lòng thử lại sau 15 phút'
);

export const apiLimiter = createRateLimit(
  1 * 60 * 1000, 
  30, 
  'API rate limit exceeded'
);

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    const sanitize = (obj: any): any => {
        if (typeof obj === 'string') {
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe[^>]*>/gi, '')
                .replace(/<object[^>]*>/gi, '')
                .replace(/<embed[^>]*>/gi, '')
                .replace(/<link[^>]*>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/data:text\/html[^"'>]*/gi, '');
        }
        
        // Xử lý object
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                return obj.map(item => sanitize(item));
            } else {
                const sanitized: any = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        sanitized[key] = sanitize(obj[key]);
                    }
                }
                return sanitized;
            }
        }
        
        // Trả về giá trị gốc nếu không phải string hoặc object
        return obj;
    };

    // ✅ CÁCH SỬA: Sửa đổi từng thuộc tính thay vì gán lại toàn bộ object
    if (req.body) {
        req.body = sanitize(req.body);
    }
    
    // ✅ SỬA req.query - không gán trực tiếp
    if (req.query) {
        for (const key in req.query) {
            if (req.query.hasOwnProperty(key)) {
                req.query[key] = sanitize(req.query[key]);
            }
        }
    }
    
    // ✅ SỬA req.params - không gán trực tiếp  
    if (req.params) {
        for (const key in req.params) {
            if (req.params.hasOwnProperty(key)) {
                req.params[key] = sanitize(req.params[key]);
            }
        }
    }
    
    console.log('Input sanitized for:', req.method, req.originalUrl);
    next();
};

export const validateContentType = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
       res.status(400).json({
        success: false,
        message: 'Content-Type phải là application/json'
      });
      return;
    }
  }
  next();
};

export const requestSizeLimit = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = req.get('content-length');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength && parseInt(contentLength) > maxSize) {
    res.status(413).json({
      success: false,
      message: 'Request quá lớn. Giới hạn 10MB'
    });
    return;
  }
  next();
};

export const simpleExpenseCache = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'private, no-cache');
  }
  else if (req.path.match(/\.(css|js|png|jpg|gif|ico)$/)) {
    res.set('Cache-Control', 'public, max-age=86400'); // 1 day
  }
  next();
};

export const apiVersion = (version: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.set('API-Version', version);
    next();
  };
};