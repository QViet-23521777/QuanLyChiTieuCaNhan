import { Request, Response, NextFunction } from 'express';
import { getTransactionById } from '../QuanLyTaiChinh-backend/transactionServices';
import { Transaction } from '../models/types';

export const checkTransactionAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
            const currentUser = req.user;
            const tran = await getTransactionById(req.params.id);

            if (!currentUser) {
                return res.status(401).json({ message: 'Chưa đăng nhập' });
            }
            
            if (!tran) {
                return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
            }

            if( tran?.userId === currentUser.id)
            {
                return next();
            }
            return res.status(403).json({ message: 'Không phải chủ giao dịch nên không có quyền truy cập' });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
}