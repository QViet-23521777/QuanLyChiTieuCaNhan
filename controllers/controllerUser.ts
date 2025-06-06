// controllers/userController.ts
import { Request, Response } from 'express';
import { User } from '../models/types';
import * as userServices from '../QuanLyTaiChinh-backend/userServices';
export const getUserField = async ( req: Request, res: Response) =>
{
  try{
    const field = req.params.field as keyof User;
    const id = req.params.id;
    const value = await userServices.getUserField(id, field);
    if(!value)
    {
      res.status(404).json({ error: "User or field not found" });
      return;
    }
    res.json({[field]: value});
  }catch (error) {
    console.error("Error getting user field:", error);
    res.status(500).json({ error: "Failed to get user field" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userServices.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const getUserByFamilyId = async ( req: Request, res: Response) =>
{
  try
  {
    const user = await userServices.getUserByFamilyId(req.params.id);
    if(!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  }catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const addUser = async ( req: Request, res: Response)=>
{
  try{
    const data = req.body as Omit<User, 'Id' | 'createdAt' | 'updatedAt'>;
    if(!data || !data.name)
    {
      res.status(400).json({error: ( 'Invalid user data')});
      return;
    }
    const info = await userServices.addUser( data );
    res.status(201).json({ 
      message: "User created successfully"
    });
  }catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req: Request, res: Response)  =>
{
  try{
    const data = req.body as Partial<User>;
    if(!userServices.getUserById(req.params.id))
    {
      res.status(404).json({error :'User is undefined'});
      return;
    }
    await userServices.updateUser(req.params.id, data);
    res.json({ message: "User updated successfully" });
  }
   catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Kiểm tra user có tồn tại không
    const existingUser = await userServices.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }
    
    // Xóa user
    await userServices.deleteUser(userId);
    
    // Trả về response thành công
    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ 
      success: false,
      error: "Failed to delete user" 
    });
  }
};

