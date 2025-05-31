import { Request, Response, NextFunction } from 'express';
import { getCommentById } from '../QuanLyTaiChinh-backend/commentServices';
import { Comment } from '../models/types';

export const checkCommentAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const comment = await getCommentById(req.params.id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!comment) {
                    return res.status(404).json({ message: 'Không tìm thấy bình luận' });
                }
                if( comment.userId === currentUser.id )
                {
                    return next();
                }
                return res.status(403).json({ message: 'Không phải người bình luận nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}