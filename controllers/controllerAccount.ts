import { Request, Response } from 'express';
import { Account } from '../../models/types';
import * as accountServices from '../../services/accountServices';
export const getAccountField = async (req: Request, res: Response) =>
{
    try {
        const aId = req.params.Id;
        const field = req.body.field as keyof Account;
        const value = await accountServices.getAccountField(aId, field);
        if(!value)
        {
            res.status(404).json({ error: "Account or field not found" });
            return;
        }
        res.json({[field]: value});
    }catch (error) {
        console.error("Error getting account field:", error);
        res.status(500).json({ error: "Failed to get account field" });
    }
};

export const getAccountById = async (req: Request, res: Response) =>
{
    try{
        const account = await accountServices.getAccountById(req.params.Id);
        if(!account)
        {
            res.status(404).json({ error: "Account not found" });
            return;
        }
        res.json(account);
    }
    catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: "Failed to get user" });
    }
};

export const addAccount = async (req: Request, res: Response) =>
{
    try{
        const data = req.body as Omit<Account, 'Id' | 'createdAt' | 'updatedAt'>;
        if(!data || !data.name)
        {
            res.status(400).json({error: ( 'Invalid user data')});
            return;
        }
        const info = await accountServices.addAccount(data);
        res.status(201).json({ 
            message: "Account created successfully"
        });
    }
    catch (error) {
        console.error("Error creating family:", error);
        res.status(500).json({ error: "Failed to create family" });
    }
};