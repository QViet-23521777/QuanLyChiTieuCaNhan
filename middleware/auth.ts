import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request
{
    user?:
    {
        id: string;
        email: string;
        role: string;
    }
};

export const authenticateToken = ( req: AuthenticatedRequest, res: Response, next: NextFunction) =>
{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Không có token xác thực' 
    });
  }
    jwt.verify(token,process.env.JWT_SECRET || 'your-secret-key', (err: any, decoded: any) =>
    {
        if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      });
    }
        req.user = decoded;
        next();
    });
};

export const authorizeRoles = (...roles: string[]) =>
{
    return (req: AuthenticatedRequest, res:Response, next: NextFunction) =>
    {
        if(!req.user || !roles.includes(req.user.role))
        {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập tính năng này'
            });
        }
        next();
    }
}