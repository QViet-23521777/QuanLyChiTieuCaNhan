import { Request, Response } from 'express';
import { Transaction } from '../models/types';
import * as transactionServices from '../QuanLyTaiChinh-backend/transactionServices';

export const getTransactionField = async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id;
        const field = req.body.field as keyof Transaction;

        const value = await transactionServices.getTransactionField(transactionId, field);
        if (!value) {
            res.status(404).json({ error: "Transaction or field not found" });
            return;
        }

        res.json({ [field]: value });
    } catch (error) {
        console.error("Error getting transaction field:", error);
        res.status(500).json({ error: "Failed to get transaction field" });
    }
};

export const getTransactionById = async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id;
        const transaction = await transactionServices.getTransactionById(transactionId);

        if (!transaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }

        res.json(transaction);
    } catch (error) {
        console.error("Error getting transaction by ID:", error);
        res.status(500).json({ error: "Failed to get transaction by ID" });
    }
};

export const getTransactionsByAccountId = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.accountId;

        const transactions = await transactionServices.getTransactionsByAccountId(accountId);
        if (!transactions || transactions.length === 0) {
            res.status(404).json({ error: "No transactions found for this account" });
            return;
        }

        res.json(transactions);
    } catch (error) {
        console.error("Error getting transactions by account ID:", error);
        res.status(500).json({ error: "Failed to get transactions by account ID" });
    }
};

export const getTransactionsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const transactions = await transactionServices.getTransactionsByUserId(userId);
        if (!transactions || transactions.length === 0) {
            res.status(404).json({ error: "No transactions found for this user" });
            return;
        }

        res.json(transactions);
    } catch (error) {
        console.error("Error getting transactions by user ID:", error);
        res.status(500).json({ error: "Failed to get transactions by user ID" });
    }
};

export const getTransactionsByCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;

        const transactions = await transactionServices.getTransactionsByCategory(categoryId);
        if (!transactions || transactions.length === 0) {
            res.status(404).json({ error: "No transactions found for this category" });
            return;
        }

        res.json(transactions);
    } catch (error) {
        console.error("Error getting transactions by category ID:", error);
        res.status(500).json({ error: "Failed to get transactions by category ID" });
    }
};

export const getTransactionsByType = async (req: Request, res: Response) => {
    try {
        const type = req.params.type;

        if (!['income', 'expense'].includes(type)) {
            res.status(400).json({ error: "Invalid transaction type" });
            return;
        }

        const transactions = await transactionServices.getTransactionByType(type);
        if (!transactions || transactions.length === 0) {
            res.status(404).json({ error: "No transactions found for this type" });
            return;
        }

        res.json(transactions);
    } catch (error) {
        console.error("Error getting transactions by type:", error);
        res.status(500).json({ error: "Failed to get transactions by type" });
    }
};

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id;
        const updateData = req.body as Partial<Transaction>;

        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({ error: "Update data is required" });
            return;
        }

        const existingTransaction = await transactionServices.getTransactionById(transactionId);
        if (!existingTransaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }

        await transactionServices.updateTransaction(transactionId, updateData);
        res.json({ message: "Transaction updated successfully", transactionId });
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Failed to update transaction" });
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id;

        const existingTransaction = await transactionServices.getTransactionById(transactionId);
        if (!existingTransaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }

        await transactionServices.deleteTransaction(transactionId);
        res.json({ message: "Transaction deleted successfully", transactionId });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
};

export const undoTransaction = async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id;

        const existingTransaction = await transactionServices.getTransactionById(transactionId);
        if (!existingTransaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }

        await transactionServices.undoTransaction(transactionId);
        res.json({ message: "Transaction undone successfully", transactionId });
    } catch (error) {
        console.error("Error undoing transaction:", error);
        res.status(500).json({ error: "Failed to undo transaction" });
    }
};