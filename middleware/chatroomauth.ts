import { Request, Response, NextFunction } from 'express';
import { getChatRoomById } from '../QuanLyTaiChinh-backend/chatroomServices';
import { ChatRoom } from '../models/types';

export const checkChatroomAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const chatroom = await getChatRoomById(req.params.id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!chatroom) {
                    return res.status(404).json({ message: 'Không tìm thấy phòng chat' });
                }

                 if (currentUser.role === 'admin') {
                    return next();
                }

                if( chatroom.members.includes(currentUser.id) )
                {
                    return next();
                }
                return res.status(403).json({ message: 'Không phải người trong phòng chat nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}

export const checkAdminAccess = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const chatroom = await getChatRoomById(req.params.id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!chatroom) {
                    return res.status(404).json({ message: 'Không tìm thấy phòng chat' });
                }
                
                if( chatroom.createdBy === currentUser.id && currentUser.role === 'admin' )
                {
                    return next();
                }
                return res.status(403).json({ message: 'Không phải người tạo đoạn chat nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}