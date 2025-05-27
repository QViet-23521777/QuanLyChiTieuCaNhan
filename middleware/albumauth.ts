import { Request, Response, NextFunction } from 'express';
import { getAlbumById } from '../QuanLyTaiChinh-backend/albumServices';
import { Album } from '../models/types';
import { AuthenticatedRequest } from './auth';
import { getUserById, getUserField} from '../QuanLyTaiChinh-backend/userServices';

export const checkTransactionAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
{
    try {
            const currentUser = req.user;
            const targetFamilyId = req.params.familyId;
            const album = await getAlbumById(req.params.Id);

            if (!currentUser) {
                return res.status(401).json({ message: 'Chưa đăng nhập' });
            }
            
            if (!album) {
                return res.status(404).json({ message: 'Không tìm thấy album' });
            }
            const userFamilyId = await getUserField(currentUser.id, 'familyId');
            if( album.familyId === targetFamilyId && userFamilyId== album.familyId)
            {
                return next();
            }
            return res.status(403).json({ message: 'Bạn không có quyền truy cập vào album này' });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
}