import { Request, Response, NextFunction } from 'express';
import { getPostBySocialPostId } from '../QuanLyTaiChinh-backend/socialPost';
import { SocialPost, User } from '../models/types';
import { getUserById } from '../QuanLyTaiChinh-backend/userServices';
import { getFamilybyId } from '../QuanLyTaiChinh-backend/familyService';

export const checkPostAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const post = await getPostBySocialPostId(req.params.id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!post) {
                    return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
                }
                const user = await getUserById(currentUser.id);
                const family = await getFamilybyId(post.familyId);
                if(!user! || !family)
                {
                    return res.status(404).json({ message: 'Không tìm thấy người dùng hoặc gia đình' });
                }
                
                if( post.createdBy === currentUser.id )
                {
                    return next();
                }
                if(post.isPublic === true)
                {
                    return next();
                }
                if(family.membersId.includes(user?.Id))
                {
                    return next();
                }
                return res.status(403).json({ message: 'Không phải người nhắn hoặc không có trong đoạn chat nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}

export const checkPostCreatorAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const post = await getPostBySocialPostId(req.params.id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!post) {
                    return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
                }
                const user = await getUserById(currentUser.id);
                if(!user)
                {
                    return res.status(404).json({ message: 'Không tìm thấy người dùng' });
                }
                if( post.createdBy === currentUser.id )
                {
                    return next();
                }
                return res.status(403).json({ message: 'Không phải người nhắn hoặc không có trong đoạn chat nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}

export const checkFamilyPostAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const post = await getPostBySocialPostId(req.params.id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!post) {
                    return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
                }
                const user = await getUserById(currentUser.id);
                const family = await getFamilybyId(post.familyId);
                if(!user! || !family)
                {
                    return res.status(404).json({ message: 'Không tìm thấy người dùng hoặc gia đình' });
                }
                if(family.membersId.includes(user?.Id))
                {
                    return next();
                }
                return res.status(403).json({ message: 'Không phải người nhắn hoặc không có trong đoạn chat nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}

