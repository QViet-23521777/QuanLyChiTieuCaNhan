import { Request, Response, NextFunction } from 'express';
import { getPhotoById } from '../QuanLyTaiChinh-backend/photoServices';
import { Photo, Album, User } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';
import { getUserById, getUserField} from '../QuanLyTaiChinh-backend/userServices';
import { getAlbumByFamilyId, getAlbumField, getAlbumByPhotoId } from '../QuanLyTaiChinh-backend/albumServices';

export const checkPhotoAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
{
    try {
            const currentUser = req.user;
            const photo = await getPhotoById(req.params.Id);

            if (!currentUser) {
                return res.status(401).json({ message: 'Chưa đăng nhập' });
            }
            
            if (!photo) {
                return res.status(404).json({ message: 'Không tìm thấy ảnh' });
            }

            if( photo?.createdBy === currentUser.id)
            {
                return next();
            }
            return res.status(403).json({ message: 'Không phải người chụp nên không có quyền truy cập' });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
}

export const checkAlbumPhotoAccess= async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
{
    try{
        const currentUser = req.user;
        const photo = await getPhotoById(req.params.Id);
        const album = await getAlbumByPhotoId(req.params.Id);
        const pId = photo?.createdBy as string;
        const famId = await getUserField(pId, 'familyId');
        if (!currentUser) {
                return res.status(401).json({ message: 'Chưa đăng nhập' });
            }
            
            if (!photo) {
                return res.status(404).json({ message: 'Không tìm thấy ảnh' });
            }
        if( photo?.createdBy === currentUser.id && famId === photo.albumId)
        {
            return next();
        }
        return res.status(403).json({ message: 'Không phải người chụp nên không có quyền truy cập vào album tương ứng' });
    }
    catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
}