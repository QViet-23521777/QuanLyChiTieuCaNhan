import { Request, Response, NextFunction } from 'express';
import { logger } from 'firebase-functions/v2';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Đã xảy ra lỗi không mong muốn';

  // Handle specific Firebase errors
  if (err.message.includes('auth/user-not-found')) {
    statusCode = 404;
    message = 'Người dùng không tồn tại';
  } else if (err.message.includes('auth/wrong-password')) {
    statusCode = 401;
    message = 'Mật khẩu không chính xác';
  } else if (err.message.includes('auth/email-already-exists')) {
    statusCode = 400;
    message = 'Email đã được sử dụng';
  } else if (err.message.includes('permission-denied')) {
    statusCode = 403;
    message = 'Bạn không có quyền thực hiện hành động này';
  }

  // Handle Firestore errors
  if (err.message.includes('PERMISSION_DENIED')) {
    statusCode = 403;
    message = 'Không có quyền truy cập';
  } else if (err.message.includes('NOT_FOUND')) {
    statusCode = 404;
    message = 'Dữ liệu không tồn tại';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err
    })
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
