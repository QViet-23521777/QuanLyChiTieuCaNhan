import { Request, Response } from 'express';
import { Category } from '../models/types';
import * as categoryServices from '../QuanLyTaiChinh-backend/categoryServices';

export const getCategoryField = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const field = req.body.field as keyof Category;

        const value = await categoryServices.getCategoryField(categoryId, field);
        if (!value) {
            res.status(404).json({ error: "Category or field not found" });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error("Error getting category field:", error);
        res.status(500).json({ error: "Failed to get category field" });
    }
};

export const addCategory = async (req: Request, res: Response) => {
    try {
        const data = req.body as Omit<Category, 'Id' | 'createdAt' | 'updatedAt'>;
        
        if (!data || !data.name || !data.type || !data.familyId) {
            res.status(400).json({ error: "Invalid category data" });
            return;
        }

        const id = await categoryServices.addCategory(data);
        res.status(201).json({
            message: "Category created successfully",
            categoryId: id
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryServices.getCategoryById(categoryId);

        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        res.json(category);
    } catch (error) {
        console.error("Error getting category by ID:", error);
        res.status(500).json({ error: "Failed to get category by ID" });
    }
};

export const getCategoryByFamilyId = async (req: Request, res: Response) => {
    try {
        const familyId = req.params.familyId;
        
        if (!familyId) {
            res.status(400).json({ error: "Family ID is required" });
            return;
        }

        const categories = await categoryServices.getCategoryByFamilyId(familyId);
        if (!categories || categories.length === 0) {
            res.status(404).json({ error: "No categories found for this family" });
            return;
        }

        res.json(categories);
    } catch (error) {
        console.error("Error getting categories by family ID:", error);
        res.status(500).json({ error: "Failed to get categories by family ID" });
    }
};

export const getCategoryByType = async (req: Request, res: Response) => {
    try {
        const familyId = req.params.familyId;
        const type = req.params.type as 'income' | 'expense';

        if (!['income', 'expense'].includes(type)) {
            res.status(400).json({ error: "Invalid category type" });
            return;
        }

        const categories = await categoryServices.getCategoryByType(familyId, type);
        res.json(categories);
    } catch (error) {
        console.error("Error getting categories by type:", error);
        res.status(500).json({ error: "Failed to get categories by type" });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const updateData = req.body as Partial<Category>;

        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({ error: "Update data is required" });
            return;
        }

        const existingCategory = await categoryServices.getCategoryById(categoryId);
        if (!existingCategory) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        await categoryServices.updateCategory(categoryId, updateData);
        res.json({ message: "Category updated successfully", categoryId });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;

        const existingCategory = await categoryServices.getCategoryById(categoryId);
        if (!existingCategory) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        await categoryServices.deleteCategory(categoryId);
        res.json({ message: "Category deleted successfully", categoryId });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
};
