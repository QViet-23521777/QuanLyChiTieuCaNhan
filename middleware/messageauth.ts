import { Request, Response, NextFunction } from 'express';
import { getMessageById } from '../QuanLyTaiChinh-backend/messageServices';
import { Message } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';
import { getChatRoomByMemberId, getChatRoomById } from '../QuanLyTaiChinh-backend/chatroomServices'

export const checkMessageAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const message = await getMessageById(req.params.Id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!message) {
                    return res.status(404).json({ message: 'Không tìm thấy tin nhắn' });
                }
                const chatroom = await getChatRoomById(message.chatroomId);
                if( message.senderId === currentUser.id && chatroom?.members.includes(message.senderId))
                {
                    return next();
                }
                return res.status(403).json({ message: 'Không phải người nhắn hoặc không có trong đoạn chat nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}

export const checkMemberMessageAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
{
    try {
                const currentUser = req.user;
                const message = await getMessageById(req.params.Id);
    
                if (!currentUser) {
                    return res.status(401).json({ message: 'Chưa đăng nhập' });
                }
                
                if (!message) {
                    return res.status(404).json({ message: 'Không tìm thấy tin nhắn' });
                }
                const chatroom = await getChatRoomById(message.chatroomId);
                if( chatroom?.members.includes(currentUser.id))
                {
                    return next();
                }
                return res.status(403).json({ message: 'Không phải người nhắn hoặc không có trong đoạn chat nên không có quyền truy cập' });
            } catch (error) {
                console.error('Lỗi:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
}
