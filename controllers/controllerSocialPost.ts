import { Request, Response } from 'express';
import { SocialPost } from '../models/types';
import * as socialPostServices from '../QuanLyTaiChinh-backend/socialPost';

export const getSocialField = async (req: Request, res: Response) => {
    try {
        const postId = req.params.Id;
        const field = req.body.field as keyof SocialPost;

        const value = await socialPostServices.getSocialField(postId, field);
        if (!value) {
            res.status(404).json({ error: 'Post or field not found' });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error('Error getting social post field:', error);
        res.status(500).json({ error: 'Failed to get social post field' });
    }
};

export const addSocialPost = async (req: Request, res: Response) => {
    try {
        const postData = req.body as Omit<SocialPost, 'Id' | 'createdAt' | 'updatedAt'>;
        const postId = await socialPostServices.addSocialPost(postData);

        res.status(201).json({ message: 'Post created successfully', postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const postId = req.params.Id;
        const post = await socialPostServices.getPostBySocialPostId(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json(post);
    } catch (error) {
        console.error('Error getting post by ID:', error);
        res.status(500).json({ error: 'Failed to get post' });
    }
};

export const getPostsByPhotoId = async (req: Request, res: Response) => {
    try {
        const photoId = req.params.photoId;
        const posts = await socialPostServices.getPostByPhotoId(photoId);
        res.json(posts);
    } catch (error) {
        console.error('Error getting posts by photoId:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
};

export const getPostsByTransactionId = async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.transactionId;
        const posts = await socialPostServices.getPostBytransactionId(transactionId);
        res.json(posts);
    } catch (error) {
        console.error('Error getting posts by transactionId:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
};

export const getPostsByFamilyId = async (req: Request, res: Response) => {
    try {
        const familyId = req.params.familyId;
        const posts = await socialPostServices.getPostByFamilyId(familyId);
        res.json(posts);
    } catch (error) {
        console.error('Error getting posts by familyId:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.Id;
        const updateData = req.body as Partial<SocialPost>;

        await socialPostServices.updatePost(postId, updateData);
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.Id;
        await socialPostServices.deletePost(postId);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

export const likePost = async (req: Request, res: Response) => {
    try {
        const { postId, userId } = req.body;
        await socialPostServices.likePost(postId, userId);
        res.json({ message: 'Post liked' });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
};

export const unlikePost = async (req: Request, res: Response) => {
    try {
        const { postId, userId } = req.body;
        await socialPostServices.unlikePost(postId, userId);
        res.json({ message: 'Post unliked' });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ error: 'Failed to unlike post' });
    }
};

export const commentPost = async (req: Request, res: Response) => {
    try {
        const { postId, commentId } = req.body;
        await socialPostServices.commentPost(postId, commentId);
        res.json({ message: 'Comment added to post' });
    } catch (error) {
        console.error('Error commenting post:', error);
        res.status(500).json({ error: 'Failed to comment on post' });
    }
};

export const deleteCommentPost = async (req: Request, res: Response) => {
    try {
        const { postId, commentId } = req.body;
        await socialPostServices.deleteCommentPost(postId, commentId);
        res.json({ message: 'Comment removed from post' });
    } catch (error) {
        console.error('Error removing comment from post:', error);
        res.status(500).json({ error: 'Failed to remove comment from post' });
    }
};
