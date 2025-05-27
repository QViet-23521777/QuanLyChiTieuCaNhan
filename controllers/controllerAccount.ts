import { Request, Response } from 'express';
import { Account } from '../models/types';
import * as accountServices from '../QuanLyTaiChinh-backend/accountServices';

export const getAccountField = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.Id;
        const field = req.params.field as keyof Account;
        
        const value = await accountServices.getAccountField(accountId, field);
        
        if (value === null || value === undefined) {
            return res.status(404).json({ 
                success: false,
                message: "Tài khoản hoặc trường không tồn tại" 
            });
        }
        
        res.json({
            success: true,
            data: { [field]: value }
        });
    } catch (error) {
        console.error("Lỗi khi lấy trường tài khoản:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể lấy thông tin trường tài khoản" 
        });
    }
};

export const getAccountById = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.Id;
        const account = await accountServices.getAccountById(accountId);
        
        if (!account) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy tài khoản" 
            });
        }
        
        res.json({
            success: true,
            data: account
        });
    } catch (error) {
        console.error("Lỗi khi lấy tài khoản:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể lấy thông tin tài khoản" 
        });
    }
};

export const getAccountsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const accounts = await accountServices.getAccountByUserId(userId);
        
        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy tài khoản nào cho người dùng này" 
            });
        }
        
        res.json({
            success: true,
            data: accounts,
            count: accounts.length
        });
    } catch (error) {
        console.error("Lỗi khi lấy tài khoản theo userId:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể lấy danh sách tài khoản của người dùng" 
        });
    }
};

export const getAccountsByFamilyId = async (req: Request, res: Response) => {
    try {
        const familyId = req.params.familyId;
        const accounts = await accountServices.getAccountByFamilyId(familyId);
        
        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy tài khoản nào cho gia đình này" 
            });
        }
        
        res.json({
            success: true,
            data: accounts,
            count: accounts.length
        });
    } catch (error) {
        console.error("Lỗi khi lấy tài khoản theo familyId:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể lấy danh sách tài khoản của gia đình" 
        });
    }
};

export const addAccount = async (req: Request, res: Response) => {
    try {
        const accountData = req.body as Omit<Account, 'Id' | 'createdAt' | 'updatedAt'>;
        
        // Validation cơ bản
        if (!accountData || !accountData.name) {
            return res.status(400).json({
                success: false,
                message: 'Tên tài khoản không được để trống'
            });
        }

        if (!accountData.type) {
            return res.status(400).json({
                success: false,
                message: 'Loại tài khoản không được để trống'
            });
        }

        // Cần có ít nhất userId hoặc familyId
        if (!accountData.userId && !accountData.familyId) {
            return res.status(400).json({
                success: false,
                message: 'Tài khoản phải thuộc về một người dùng hoặc gia đình'
            });
        }

        // Set default values
        const accountDataWithDefaults = {
            ...accountData,
            balance: accountData.balance || 0,
            currency: accountData.currency || 'VND',
            isActive: accountData.isActive !== undefined ? accountData.isActive : true
        };

        const newAccountId = await accountServices.addAccount(accountDataWithDefaults);
        
        // Lấy thông tin tài khoản vừa tạo để trả về
        const newAccount = await accountServices.getAccountById(newAccountId);
        
        res.status(201).json({
            success: true,
            message: "Tạo tài khoản thành công",
            data: newAccount
        });
    } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể tạo tài khoản" 
        });
    }
};

export const updateAccount = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.Id;
        const updateData = req.body;

        // Kiểm tra tài khoản có tồn tại không
        const existingAccount = await accountServices.getAccountById(accountId);
        if (!existingAccount) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản"
            });
        }

        // Loại bỏ các trường không được phép cập nhật trực tiếp
        const { Id, createdAt, updatedAt, ...allowedUpdates } = updateData;

        if (Object.keys(allowedUpdates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Không có trường hợp lệ nào để cập nhật"
            });
        }

        await accountServices.updateAccount(accountId, allowedUpdates);
        
        // Lấy thông tin tài khoản sau khi cập nhật
        const updatedAccount = await accountServices.getAccountById(accountId);
        
        res.json({
            success: true,
            message: "Cập nhật tài khoản thành công",
            data: updatedAccount
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật tài khoản:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể cập nhật tài khoản" 
        });
    }
};

export const updateAccountBalance = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.Id;
        const { amount, operation } = req.body; // operation: 'add', 'subtract', 'set'

        if (amount === undefined || amount === null) {
            return res.status(400).json({
                success: false,
                message: "Số tiền không được để trống"
            });
        }

        if (!operation || !['add', 'subtract', 'set'].includes(operation)) {
            return res.status(400).json({
                success: false,
                message: "Thao tác không hợp lệ. Phải là 'add', 'subtract', hoặc 'set'"
            });
        }

        // Kiểm tra tài khoản có tồn tại không
        const existingAccount = await accountServices.getAccountById(accountId);
        if (!existingAccount) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản"
            });
        }

        let newBalance: number;
        const currentBalance = existingAccount.balance || 0;

        switch (operation) {
            case 'add':
                newBalance = currentBalance + amount;
                break;
            case 'subtract':
                newBalance = currentBalance - amount;
                break;
            case 'set':
                newBalance = amount;
                break;
            default:
                throw new Error('Invalid operation');
        }

        // Kiểm tra số dư không được âm (tùy thuộc vào business logic)
        if (newBalance < 0 && existingAccount.type !== 'credit') {
            return res.status(400).json({
                success: false,
                message: "Số dư không được âm đối với loại tài khoản này"
            });
        }

        await accountServices.updateAccountBalance(accountId, newBalance);
        
        res.json({
            success: true,
            message: "Cập nhật số dư thành công",
            data: {
                accountId,
                oldBalance: currentBalance,
                newBalance,
                operation,
                amount
            }
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật số dư:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể cập nhật số dư tài khoản" 
        });
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.Id;

        // Kiểm tra tài khoản có tồn tại không
        const existingAccount = await accountServices.getAccountById(accountId);
        if (!existingAccount) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản"
            });
        }

        // Cảnh báo nếu tài khoản còn số dư
        if (existingAccount.balance && existingAccount.balance !== 0) {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa tài khoản còn số dư. Vui lòng chuyển hết số dư trước khi xóa."
            });
        }

        await accountServices.deleteAccount(accountId);
        
        res.json({
            success: true,
            message: "Xóa tài khoản thành công"
        });
    } catch (error) {
        console.error("Lỗi khi xóa tài khoản:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể xóa tài khoản" 
        });
    }
};

export const deactivateAccount = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.Id;

        // Kiểm tra tài khoản có tồn tại không
        const existingAccount = await accountServices.getAccountById(accountId);
        if (!existingAccount) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản"
            });
        }

        if (!existingAccount.isActive) {
            return res.status(400).json({
                success: false,
                message: "Tài khoản đã được vô hiệu hóa"
            });
        }

        await accountServices.updateAccount(accountId, { isActive: false });
        
        const updatedAccount = await accountServices.getAccountById(accountId);
        
        res.json({
            success: true,
            message: "Vô hiệu hóa tài khoản thành công",
            data: updatedAccount
        });
    } catch (error) {
        console.error("Lỗi khi vô hiệu hóa tài khoản:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể vô hiệu hóa tài khoản" 
        });
    }
};

export const activateAccount = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.Id;

        // Kiểm tra tài khoản có tồn tại không
        const existingAccount = await accountServices.getAccountById(accountId);
        if (!existingAccount) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản"
            });
        }

        if (existingAccount.isActive) {
            return res.status(400).json({
                success: false,
                message: "Tài khoản đã được kích hoạt"
            });
        }

        await accountServices.updateAccount(accountId, { isActive: true });
        
        const updatedAccount = await accountServices.getAccountById(accountId);
        
        res.json({
            success: true,
            message: "Kích hoạt tài khoản thành công",
            data: updatedAccount
        });
    } catch (error) {
        console.error("Lỗi khi kích hoạt tài khoản:", error);
        res.status(500).json({ 
            success: false,
            message: "Không thể kích hoạt tài khoản" 
        });
    }
};