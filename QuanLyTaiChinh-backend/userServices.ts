import { User } from '../models/types';
import {
    addDocument,
    getCollection,
    updateDocument,
    deleteDocument,
    queryDocuments,
    getDocument
} from './firestoreservices';
import { RealtimeListenerService  } from './RealtimeListenerService';
const COLLECTION_NAME = 'Users';
// Hàm lấy trường cho User
export const getUserField = async <K extends keyof User>(
    userId: string,
    field: K
  ): Promise<User[K] | null> => {
    try {
      const COLLECTION_NAME = 'User';
      const user = await getDocument<User>(COLLECTION_NAME, userId);
      if (!user) {
        return null;
      }
      return user[field];
    } catch (error) {
      console.error(`Lỗi khi lấy trường ${String(field)} từ người dùng ${userId}:`, error);
      throw error;
    }
  };
//thêm user
export const addUser = async( userData: Omit<User, 'Id' | 'createdAt' | 'updatedAt'>)
:Promise<string> =>
{
    return await addDocument(COLLECTION_NAME, userData);
};
//lấy thông tin bằng id
export const getUserById = async(userId: string)
:Promise<User | null> =>{
    return await getDocument<User>(COLLECTION_NAME, userId);
};
//lấy thông tin bằng familyid
export const getUserByFamilyId = async(familyId: string)
:Promise<User[] | null> =>{
    return await queryDocuments<User>(COLLECTION_NAME,[
        { field: 'familyId', operator: '==', value: familyId}
    ]);
};
//cập nhật người dùng
export const updateUser = async(userId: string, userData: Partial<User>):
Promise<void> =>{
    await updateDocument(COLLECTION_NAME,userId,userData);
}
//xóa người dùng
export const deleteUser = async(userId: string):
Promise<void> =>{
    await deleteDocument(COLLECTION_NAME, userId);
}
//lắng nghe thay đổi
export const listenToUser = async(userId: string,callback: (user: User | null) => void ) =>
{ 
  const realtimeService = new RealtimeListenerService()
  return realtimeService.listenToDocument<User>(COLLECTION_NAME, userId, callback);
}