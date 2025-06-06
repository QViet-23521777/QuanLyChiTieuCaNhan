import { Request, Response, NextFunction } from 'express';
import { getReviewById } from '../QuanLyTaiChinh-backend/reviewServices';
import { Review, User } from '../models/types';
import { getUserById } from '../QuanLyTaiChinh-backend/userServices';

export const checkReviewAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const re = await getReviewById(req.params.id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!re) {
                    return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
                }
                if( currentUser.id === re.userId)
                {
                    return next();
                }
                if(re.ispublic == true)
                {
                    return next();
                }
                
                return res.status(403).json({ message: 'Không phải người chủ review hoặc không công khai nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}

export const checkReviewUserAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const re = await getReviewById(req.params.id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!re) {
                    return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
                }
                if( currentUser.id === re.userId)
                {
                    return next();
                }
                
                
                return res.status(403).json({ message: 'Không phải người chủ review hoặc không công khai nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}
