import { Request, Response } from 'express';
import { Comment } from '../models/types';
import * as commentServices from '../QuanLyTaiChinh-backend/commentServices';

export const getCommentField = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        const field = req.body.field as keyof Comment;

        const value = await commentServices.getCommentField(commentId, field);
        if (!value) {
            res.status(404).json({ error: "Comment or field not found" });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error("Error getting comment field:", error);
        res.status(500).json({ error: "Failed to get comment field" });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const commentData = req.body as Omit<Comment, 'Id' | 'createdAt' | 'updatedAt'>;

        if (!commentData.text || !commentData.userId || !commentData.userName) {
            res.status(400).json({ error: "Invalid comment data" });
            return;
        }

        const commentId = await commentServices.addComment(commentData);
        res.status(201).json({ message: "Comment created successfully", commentId });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Failed to create comment" });
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        const comment = await commentServices.getCommentById(commentId);

        if (!comment) {
            res.status(404).json({ error: "Comment not found" });
            return;
        }

        res.json(comment);
    } catch (error) {
        console.error("Error getting comment by ID:", error);
        res.status(500).json({ error: "Failed to get comment" });
    }
};

export const getCommentsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const comments = await commentServices.getCommentByUserId(userId);
        res.json(comments);
    } catch (error) {
        console.error("Error getting comments by user ID:", error);
        res.status(500).json({ error: "Failed to get comments" });
    }
};

export const getCommentsByUserName = async (req: Request, res: Response) => {
    try {
        const userName = req.params.userName;

        const comments = await commentServices.getCommentByUserName(userName);
        res.json(comments);
    } catch (error) {
        console.error("Error getting comments by username:", error);
        res.status(500).json({ error: "Failed to get comments" });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        const updateData = req.body as Partial<Comment>;

        await commentServices.updateComment(commentId, updateData);
        res.json({ message: "Comment updated", commentId });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Failed to update comment" });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;

        await commentServices.deleteComment(commentId);
        res.json({ message: "Comment deleted", commentId });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};
