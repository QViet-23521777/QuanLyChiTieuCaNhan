import { Request, Response } from 'express';
import { Message } from '../models/types';
import * as messageServices from '../QuanLyTaiChinh-backend/messageServices';

export const getMessageField = async (req: Request, res: Response) => {
    try {
        const messageId = req.params.id;
        const field = req.body.field as keyof Message;

        const value = await messageServices.getMessageField(messageId, field);
        if (!value) {
            res.status(404).json({ error: "Message or field not found" });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error("Error getting message field:", error);
        res.status(500).json({ error: "Failed to get message field" });
    }
};

export const addMessage = async (req: Request, res: Response) => {
    try {
        const messageData = req.body as Omit<Message, 'Id' | 'createdAt' | 'updatedAt'>;

        if (!messageData.text || !messageData.senderId || !messageData.senderName || !messageData.chatroomId) {
            res.status(400).json({ error: "Invalid message data" });
            return;
        }

        const messageId = await messageServices.addMessage(messageData);
        res.status(201).json({ message: "Message created successfully", messageId });
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ error: "Failed to create message" });
    }
};

export const getMessageById = async (req: Request, res: Response) => {
    try {
        const messageId = req.params.id;
        const message = await messageServices.getMessageById(messageId);

        if (!message) {
            res.status(404).json({ error: "Message not found" });
            return;
        }

        res.json(message);
    } catch (error) {
        console.error("Error getting message by ID:", error);
        res.status(500).json({ error: "Failed to get message" });
    }
};

export const getMessagesBySenderId = async (req: Request, res: Response) => {
    try {
        const senderId = req.params.senderId;
        const messages = await messageServices.getMessageBySenderId(senderId);
        res.json(messages);
    } catch (error) {
        console.error("Error getting messages by sender ID:", error);
        res.status(500).json({ error: "Failed to get messages" });
    }
};

export const getMessagesBySenderName = async (req: Request, res: Response) => {
    try {
        const senderName = req.params.senderName;
        const messages = await messageServices.getMessageBySenderName(senderName);
        res.json(messages);
    } catch (error) {
        console.error("Error getting messages by sender name:", error);
        res.status(500).json({ error: "Failed to get messages" });
    }
};

export const getMessagesByChatRoom = async (req: Request, res: Response) => {
    try {
        const chatRoomId = req.params.chatRoomId;
        const messages = await messageServices.getMessageByChatRoom(chatRoomId);
        res.json(messages);
    } catch (error) {
        console.error("Error getting messages by chat room:", error);
        res.status(500).json({ error: "Failed to get messages" });
    }
};

export const updateMessage = async (req: Request, res: Response) => {
    try {
        const messageId = req.params.id;
        const updateData = req.body as Partial<Message>;

        await messageServices.updateMessage(messageId, updateData);
        res.json({ message: "Message updated", messageId });
    } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).json({ error: "Failed to update message" });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const messageId = req.params.id;

        await messageServices.deleteMesage(messageId);
        res.json({ message: "Message deleted", messageId });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Failed to delete message" });
    }
};
