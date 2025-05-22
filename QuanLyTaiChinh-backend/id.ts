import { Timestamp } from 'firebase/firestore';
import { db } from '../BE/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
//tạo ID duy nhất tuần tự
export const generateSequentialId = (prefix?: string): string => {
    const timestamp = Date.now();
    const timestampHex = timestamp.toString(16);
    const randomPart = Math.random().toString(36).substring(2,6);
    return prefix ? `${prefix}_${timestampHex}${randomPart}` : `${timestampHex}${randomPart}`;
}
//tạo ID duy nhất với loại đối tượng 
export const generateEntitySequentialId = (type: 
    'user' | 
    'family' | 
    'account' | 
    'category' | 
    'transaction' | 
    'album' | 
    'photo' | 
    'comment' | 
    'chatroom' | 
    'message' | 
    'socialpost' | 
    'review'
  ): string => {
    const prefixMap = {
      user: 'usr',
      family: 'fam',
      account: 'acc',
      category: 'cat',
      transaction: 'trx',
      album: 'alb',
      photo: 'pht',
      comment: 'cmt',
      chatroom: 'cht',
      message: 'msg',
      socialpost: 'pst',
      review: 'rev'
    };
    
    return generateSequentialId(prefixMap[type]);
  };
  //lấy ID lớn nhất
  export const getLastId = async (collectionName: string, idFieldName: string = 'Id'): Promise<string | null> => {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, orderBy(idFieldName, 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const lastDoc = querySnapshot.docs[0];
        return lastDoc.data()[idFieldName];
      }
      
      return null;
    } catch (error) {
      console.error(`Lỗi khi lấy ID cuối cùng từ ${collectionName}:`, error);
      return null;
    }
  };
