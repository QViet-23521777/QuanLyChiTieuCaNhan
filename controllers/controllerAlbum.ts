import { Request, Response } from 'express';
import { Album } from '../models/types';
import * as albumServices from '../QuanLyTaiChinh-backend/albumServices';

export const getAlbumField = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.Id;
        const field = req.body.field as keyof Album;

        const value = await albumServices.getAlbumField(albumId, field);
        if (!value) {
            res.status(404).json({ error: "Album or field not found" });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error("Error getting album field:", error);
        res.status(500).json({ error: "Failed to get album field" });
    }
};

export const addAlbum = async (req: Request, res: Response) => {
    try {
        const data = req.body as Omit<Album, 'Id' | 'createdAt' | 'updatedAt'>;

        if (!data || !data.name || !data.familyId || !data.createdBy) {
            res.status(400).json({ error: "Invalid album data" });
            return;
        }

        const id = await albumServices.addAlbum(data);
        res.status(201).json({
            message: "Album created successfully",
            albumId: id
        });
    } catch (error) {
        console.error("Error creating album:", error);
        res.status(500).json({ error: "Failed to create album" });
    }
};

export const getAlbumById = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.Id;
        const album = await albumServices.getAlbumById(albumId);

        if (!album) {
            res.status(404).json({ error: "Album not found" });
            return;
        }

        res.json(album);
    } catch (error) {
        console.error("Error getting album by ID:", error);
        res.status(500).json({ error: "Failed to get album by ID" });
    }
};

export const updateAlbum = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.Id;
        const updateData = req.body as Partial<Album>;

        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({ error: "Update data is required" });
            return;
        }

        const existingAlbum = await albumServices.getAlbumById(albumId);
        if (!existingAlbum) {
            res.status(404).json({ error: "Album not found" });
            return;
        }

        await albumServices.updateAlbum(albumId, updateData);
        res.json({ message: "Album updated successfully", albumId });
    } catch (error) {
        console.error("Error updating album:", error);
        res.status(500).json({ error: "Failed to update album" });
    }
};

export const addPictureToAlbum = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.Id;
        const photoId = req.body.photoId;

        if (!photoId) {
            res.status(400).json({ error: "Photo ID is required" });
            return;
        }

        await albumServices.addPictureToAlbum(albumId, photoId);
        res.json({ message: "Photo added to album successfully", albumId, photoId });
    } catch (error) {
        console.error("Error adding picture to album:", error);
        res.status(500).json({ error: "Failed to add picture to album" });
    }
};

export const getAlbumsByFamilyId = async (req: Request, res: Response) => {
    try {
        const familyId = req.params.familyId;

        const albums = await albumServices.getAlbumByFamilyId(familyId);
        if (!albums || albums.length === 0) {
            res.status(404).json({ error: "No albums found for this family" });
            return;
        }

        res.json(albums);
    } catch (error) {
        console.error("Error getting albums by family ID:", error);
        res.status(500).json({ error: "Failed to get albums by family ID" });
    }
};

export const getAlbumsByPhotoId = async (req: Request, res: Response) => {
    try {
        const photoId = req.params.photoId;

        const albums = await albumServices.getAlbumByPhotoId(photoId);
        if (!albums || albums.length === 0) {
            res.status(404).json({ error: "No albums found containing this photo" });
            return;
        }

        res.json(albums);
    } catch (error) {
        console.error("Error getting albums by photo ID:", error);
        res.status(500).json({ error: "Failed to get albums by photo ID" });
    }
};

export const deletePhotoFromAlbum = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.Id;
        const photoId = req.body.photoId;

        if (!photoId) {
            res.status(400).json({ error: "Photo ID is required" });
            return;
        }

        await albumServices.deletePhoto(albumId, photoId);
        res.json({ message: "Photo removed from album", albumId, photoId });
    } catch (error) {
        console.error("Error deleting photo from album:", error);
        res.status(500).json({ error: "Failed to delete photo from album" });
    }
};

export const deleteAlbum = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.Id;

        const existingAlbum = await albumServices.getAlbumById(albumId);
        if (!existingAlbum) {
            res.status(404).json({ error: "Album not found" });
            return;
        }

        await albumServices.deleteAlbum(albumId);
        res.json({ message: "Album deleted successfully", albumId });
    } catch (error) {
        console.error("Error deleting album:", error);
        res.status(500).json({ error: "Failed to delete album" });
    }
};
