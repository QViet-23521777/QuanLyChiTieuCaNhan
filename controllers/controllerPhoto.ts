import { Request, Response } from 'express';
import { Photo, Comment } from '../models/types';
import * as photoServices from '../QuanLyTaiChinh-backend/photoServices';

export const getPhotoField = async (req: Request, res: Response) => {
    try {
        const photoId = req.params.Id;
        const field = req.body.field as keyof Photo;

        const value = await photoServices.getPhotoField(photoId, field);
        if (!value) {
            res.status(404).json({ error: "Photo or field not found" });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error("Error getting photo field:", error);
        res.status(500).json({ error: "Failed to get photo field" });
    }
};

export const addPhoto = async (req: Request, res: Response) => {
    try {
        const data = req.body as Omit<Photo, 'Id' | 'createdAt' | 'updatedAt'>;

        if (!data || !data.albumId || !data.createdBy || !data.url) {
            res.status(400).json({ error: "Invalid photo data" });
            return;
        }

        const id = await photoServices.addPhoto(data);
        res.status(201).json({ message: "Photo created successfully", photoId: id });
    } catch (error) {
        console.error("Error creating photo:", error);
        res.status(500).json({ error: "Failed to create photo" });
    }
};

export const getPhotoById = async (req: Request, res: Response) => {
    try {
        const photoId = req.params.Id;
        const photo = await photoServices.getPhotoById(photoId);

        if (!photo) {
            res.status(404).json({ error: "Photo not found" });
            return;
        }

        res.json(photo);
    } catch (error) {
        console.error("Error getting photo by ID:", error);
        res.status(500).json({ error: "Failed to get photo by ID" });
    }
};

export const getPhotosByAlbumId = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.albumId;

        const photos = await photoServices.getPhotoByAlbumId(albumId);
        res.json(photos || []);
    } catch (error) {
        console.error("Error getting photos by album ID:", error);
        res.status(500).json({ error: "Failed to get photos" });
    }
};

export const getPhotosByCreatorId = async (req: Request, res: Response) => {
    try {
        const creatorId = req.params.creatorId;

        const photos = await photoServices.getPhotoByCreId(creatorId);
        res.json(photos || []);
    } catch (error) {
        console.error("Error getting photos by creator ID:", error);
        res.status(500).json({ error: "Failed to get photos" });
    }
};

export const updatePhoto = async (req: Request, res: Response) => {
    try {
        const photoId = req.params.Id;
        const updateData = req.body as Partial<Photo>;

        await photoServices.updatePhoto(photoId, updateData);
        res.json({ message: "Photo updated successfully", photoId });
    } catch (error) {
        console.error("Error updating photo:", error);
        res.status(500).json({ error: "Failed to update photo" });
    }
};

export const deletePhoto = async (req: Request, res: Response) => {
    try {
        const photoId = req.params.Id;

        await photoServices.deletePhoto(photoId);
        res.json({ message: "Photo deleted successfully", photoId });
    } catch (error) {
        console.error("Error deleting photo:", error);
        res.status(500).json({ error: "Failed to delete photo" });
    }
};

export const likePhoto = async (req: Request, res: Response) => {
    try {
        const { photoId, userId } = req.body;

        if (!photoId || !userId) {
            res.status(400).json({ error: "photoId and userId are required" });
            return;
        }

        await photoServices.likeToPhoto(photoId, userId);
        res.json({ message: "Photo liked", photoId, userId });
    } catch (error) {
        console.error("Error liking photo:", error);
        res.status(500).json({ error: "Failed to like photo" });
    }
};

export const unlikePhoto = async (req: Request, res: Response) => {
    try {
        const { photoId, userId } = req.body;

        if (!photoId || !userId) {
            res.status(400).json({ error: "photoId and userId are required" });
            return;
        }

        await photoServices.unlikeToPhoto(photoId, userId);
        res.json({ message: "Photo unliked", photoId, userId });
    } catch (error) {
        console.error("Error unliking photo:", error);
        res.status(500).json({ error: "Failed to unlike photo" });
    }
};

export const addCommentToPhoto = async (req: Request, res: Response) => {
    try {
        const photoId = req.params.Id;
        const commentData = req.body as Omit<Comment, 'Id' | 'createdAt' | 'updatedAt'>;

        if (!commentData || !commentData.text || !commentData.userId) {
            res.status(400).json({ error: "Invalid comment data" });
            return;
        }

        const commentId = await photoServices.addCommentToPhoto(photoId, commentData);
        if (commentId === 'null') {
            res.status(404).json({ error: "Photo not found" });
            return;
        }

        res.status(201).json({ message: "Comment added", commentId });
    } catch (error) {
        console.error("Error adding comment to photo:", error);
        res.status(500).json({ error: "Failed to add comment to photo" });
    }
};

export const removeCommentFromPhoto = async (req: Request, res: Response) => {
    try {
        const photoId = req.params.Id;
        const commentId = req.body.commentId;

        if (!commentId) {
            res.status(400).json({ error: "commentId is required" });
            return;
        }

        await photoServices.removeCommentFromPhoto(photoId, commentId);
        res.json({ message: "Comment removed", commentId });
    } catch (error) {
        console.error("Error removing comment from photo:", error);
        res.status(500).json({ error: "Failed to remove comment" });
    }
};
