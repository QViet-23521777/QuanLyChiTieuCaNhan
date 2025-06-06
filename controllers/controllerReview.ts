import { Request, Response } from 'express';
import { Review } from '../models/types';
import * as reviewServices from '../QuanLyTaiChinh-backend/reviewServices';

export const getReviewField = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;
        const field = req.body.field as keyof Review;

        const value = await reviewServices.getReviewField(reviewId, field);
        if (!value) {
            res.status(404).json({ error: 'Review or field not found' });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error('Error getting review field:', error);
        res.status(500).json({ error: 'Failed to get review field' });
    }
};

export const addReview = async (req: Request, res: Response) => {
    try {
        const reviewData = req.body as Omit<Review, 'Id' | 'createdAt' | 'updatedAt'>;
        const reviewId = await reviewServices.addReview(reviewData);

        res.status(201).json({ message: 'Review created successfully', reviewId });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};

export const getReviewById = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;
        const review = await reviewServices.getReviewById(reviewId);

        if (!review) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }

        res.json(review);
    } catch (error) {
        console.error('Error getting review by ID:', error);
        res.status(500).json({ error: 'Failed to get review' });
    }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const reviews = await reviewServices.getReviewByUserId(userId);
        res.json(reviews);
    } catch (error) {
        console.error('Error getting reviews by userId:', error);
        res.status(500).json({ error: 'Failed to get reviews' });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;
        const updateData = req.body as Partial<Review>;

        await reviewServices.updateReview(reviewId, updateData);
        res.json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;
        await reviewServices.deleteReview(reviewId);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
