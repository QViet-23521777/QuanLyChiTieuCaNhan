import { Request, Response } from 'express';
import { ChatRoom } from '../models/types';
import * as chatRoomServices from '../QuanLyTaiChinh-backend/chatroomServices';

export const getChatRoomField = async (req: Request, res: Response) => {
    try {
        const chatRoomId = req.params.Id;
        const field = req.body.field as keyof ChatRoom;

        const value = await chatRoomServices.getChatRoomField(chatRoomId, field);
        if (!value) {
            res.status(404).json({ error: "ChatRoom or field not found" });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error("Error getting chat room field:", error);
        res.status(500).json({ error: "Failed to get chat room field" });
    }
};

export const addChatRoom = async (req: Request, res: Response) => {
    try {
        const chatRoomData = req.body as Omit<ChatRoom, 'Id' | 'createdAt' | 'updatedAt'>;
        const chatRoomId = await chatRoomServices.addChatRoom(chatRoomData);
        res.status(201).json({ message: "ChatRoom created successfully", chatRoomId });
    } catch (error) {
        console.error("Error creating chat room:", error);
        res.status(500).json({ error: "Failed to create chat room" });
    }
};

export const getChatRoomById = async (req: Request, res: Response) => {
    try {
        const chatRoomId = req.params.Id;
        const chatRoom = await chatRoomServices.getChatRoomById(chatRoomId);

        if (!chatRoom) {
            res.status(404).json({ error: "ChatRoom not found" });
            return;
        }

        res.json(chatRoom);
    } catch (error) {
        console.error("Error getting chat room by ID:", error);
        res.status(500).json({ error: "Failed to get chat room" });
    }
};

export const getChatRoomsByMemberId = async (req: Request, res: Response) => {
    try {
        const memberId = req.params.memberId;
        const chatRooms = await chatRoomServices.getChatRoomByMemberId(memberId);
        res.json(chatRooms);
    } catch (error) {
        console.error("Error getting chat rooms by member ID:", error);
        res.status(500).json({ error: "Failed to get chat rooms" });
    }
};

export const updateChatRoom = async (req: Request, res: Response) => {
    try {
        const chatRoomId = req.params.Id;
        const updateData = req.body as Partial<ChatRoom>;

        await chatRoomServices.updateChatRoom(chatRoomId, updateData);
        res.json({ message: "ChatRoom updated", chatRoomId });
    } catch (error) {
        console.error("Error updating chat room:", error);
        res.status(500).json({ error: "Failed to update chat room" });
    }
};

export const deleteChatRoom = async (req: Request, res: Response) => {
    try {
        const chatRoomId = req.params.Id;
        await chatRoomServices.deleteChatRoom(chatRoomId);
        res.json({ message: "ChatRoom deleted", chatRoomId });
    } catch (error) {
        console.error("Error deleting chat room:", error);
        res.status(500).json({ error: "Failed to delete chat room" });
    }
};

export const getAllMessages = async (req: Request, res: Response) => {
    try {
        const chatRoomId = req.params.Id;
        const messages = await chatRoomServices.getAllMessage(chatRoomId);
        res.json({ messages });
    } catch (error) {
        console.error("Error getting all messages:", error);
        res.status(500).json({ error: "Failed to get messages" });
    }
};

export const addMessageToChatRoom = async (req: Request, res: Response) => {
    try {
        const { chatRoomId, messageId } = req.body;
        if (!chatRoomId || !messageId) {
            res.status(400).json({ error: "chatRoomId and messageId are required" });
            return;
        }

        await chatRoomServices.addMessageToChatRoom(chatRoomId, messageId);
        res.json({ message: "Message added to ChatRoom" });
    } catch (error) {
        console.error("Error adding message to chat room:", error);
        res.status(500).json({ error: "Failed to add message to chat room" });
    }
};
