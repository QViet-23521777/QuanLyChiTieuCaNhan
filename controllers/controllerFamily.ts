import { Request, Response } from 'express';
import { Family } from '../models/types';
import * as familyServices from '../QuanLyTaiChinh-backend/familyService';
export const getFamilyField = async ( req: Request, res: Response) => 
{
    try{
        const fId = req.params.id;
        const field = req.params.field as keyof Family;
        const value = await familyServices.getFamilyField(fId, field);
        if(!value)
        {
            res.status(404).json({ error: "Family or field not found" });
            return;
        }
        res.json({[field]: value});
    }catch (error) {
        console.error("Error getting family field:", error);
        res.status(500).json({ error: "Failed to get family field" });
    }
};

export const getFamilybyId = async ( req: Request, res: Response) =>
{
    try{
        const family = await familyServices.getFamilybyId(req.params.id);
        if(!family)
        {
            res.status(404).json({ error: "Family not found" });
            return;
        }
        res.json(family);
    }
    catch (error) {
    console.error("Error getting family:", error);
    res.status(500).json({ error: "Failed to get family" });
  }
};

export const getFamilyIdByMemberId = async ( req: Request, res: Response) =>
{
    try{
        const family = await familyServices.getFamilyIdByMemberId(req.params.memberId);
        if(!family)
        {
            res.status(404).json({ error: "Family not found" });
            return;
        }
        res.json(family);
    }
    catch (error) {
    console.error("Error getting family:", error);
    res.status(500).json({ error: "Failed to get family" });
  }
};

export const addFaimly = async ( req: Request, res: Response) =>
{
    try{
        const data = req.body as Omit<Family,'Id' | 'createdAt' | 'updatedAt'>;
        if(!data || !data.name)
        {
            res.status(400).json({error: ( 'Invalid user data')});
            return; 
        }
    }catch (error) {
    console.error("Error creating family:", error);
    res.status(500).json({ error: "Failed to create family" });
  }
};

export const addMember = async ( req: Request, res: Response) =>
{
    try{
        const fId = req.params.id;
        const uId = req.body.memberId;
        if(!uId)
        {
            res.status(400).json({ error: "Member ID is required" });
            return;   
        }
        await familyServices.addMember(fId, uId);
        res.status(200).json({
            message: "Member added to family successfully"
        });
    }catch (error) {
        console.error("Error adding member to family:", error);
        res.status(500).json({ error: "Failed to add member to family" });
    }
};

export const deleteUser = async ( req: Request, res: Response) =>
{
    try{
        const fId = req.params.id;
        const uId = req.body.memberId;

        if (!uId) {
            res.status(400).json({ error: "Member ID is required" });
            return;
        }

        const family = await familyServices.getFamilybyId(uId);
        if (!family) {
            res.status(404).json({ error: "Family not found" });
            return;
        }

        if (!family.membersId.includes(uId)) {
            res.status(404).json({ error: "Member not found in the family" });
            return;
        }

        await familyServices.removeMembers(fId, uId);
        res.status(200).json({
            message: "Member removed from family successfully",
        });
    }
    catch (error) {
        console.error("Error removing member from family:", error);
        res.status(500).json({ error: "Failed to remove member from family" });
  }
};

export const updateFamily = async ( req: Request, res: Response) =>
{
    try{
        const data = req.body as Partial<Family>;
        if(!familyServices.getFamilybyId(req.params.id))
        {
            res.status(404).json({error :'Family is undefined'});
            return;
        }
        await familyServices.updateFamily(req.params.id,data);
        res.json({ message: "Family updated successfully" });
    }
    catch (error) {
        console.error("Error updating family:", error);
        res.status(500).json({ error: "Failed to update family" });
    }
};

export const deleteFamily = async ( req: Request, res: Response) =>
{
    try{
        const fId = req.params.id;
        const family = await familyServices.getFamilybyId(fId);
        if(!family || !fId)
        {
            res.status(404).json({ error: "Family not found" });
            return;
        }
        await familyServices.deleteFamily(fId);
    }
    catch (error) {
        console.error("Error deleting family:", error);
        res.status(500).json({ error: "Failed to delete family" });
    }
};