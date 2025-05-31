import { Request, Response, NextFunction } from 'express';
import { getAccountById } from '../QuanLyTaiChinh-backend/accountServices';
import { Account } from '../models/types';


export const checkAccountAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
            const currentUser = req.user;
            const account = await getAccountById(req.params.id);

            if (!currentUser) {
                return res.status(401).json({ message: 'Chưa đăng nhập' });
            }
            
            if (!account) {
                return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
            }

            if( account?.userId === currentUser.id)
            {
                return next();
            }
            return res.status(403).json({ message: 'Không phải chủ tài khoản nên không có quyền truy cập' });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
}