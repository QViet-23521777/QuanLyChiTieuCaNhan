import { Request, Response, NextFunction } from 'express';
import { checkMember, getFamilybyId } from '../QuanLyTaiChinh-backend/familyService';
import { getUserById } from '../QuanLyTaiChinh-backend/userServices';
import { User, Family } from '../models/types';

export const checkAccountAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.user;
        if (!currentUser) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }
        
        if( await checkMember(req.params.id, currentUser?.id) == true )
        {
            return next();
        }
        return res.status(403).json({ message: 'Không trong gia đình nên không có quyền truy cập' });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};