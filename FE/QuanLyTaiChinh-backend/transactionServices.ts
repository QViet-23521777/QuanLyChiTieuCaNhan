import { Transaction, Account } from '../models/types';
import { 
  addDocument, 
  getDocument, 
  queryDocuments, 
  executeTransaction, 
  updateDocument,
  deleteDocument, listenDocument,
  getCollection
} from './firestoreservices';
import { getAccountById, updateAccountBalance } from './accountServices';
import { doc, serverTimestamp, collection, Timestamp } from 'firebase/firestore';
import { RealtimeListenerService  } from './RealtimeListenerService';
import { db } from '../firebaseConfig';
const COLLECTION_NAME = 'Transaction';
const COLLECTION_NAME1 = 'Account';
// Hàm lấy trường cho Transaction
export const getTransactionField = async <K extends keyof Transaction>(
  transactionId: string,
  field: K
): Promise<Transaction[K] | null> => {
  try {
    const transaction = await getDocument<Transaction>(COLLECTION_NAME, transactionId);
    if (!transaction) {
      return null;
    }
    return transaction[field];
  } catch (error) {
    console.error(`Lỗi khi lấy trường ${String(field)} từ giao dịch ${transactionId}:`, error);
    throw error;
  }
};
// tạo giao dịch
export const createTransaction = async (transactionData: Omit< Transaction, 'Id' | 'createdAt' | 'updatedAt'>)
:Promise<string> =>{
    return executeTransaction<string>(async (Transaction) =>{
        const accountRef = doc(db, 'Account', transactionData.accountId);
        const accountDoc = await Transaction.get(accountRef);
        if(!accountDoc.exists())
        {
            throw new Error('Tài khoản không tồn tại');
        }
        const account = accountDoc.data() as Account;
        let newBalance = account.balance;
        if (transactionData.type === 'income') {
            newBalance += transactionData.amount;
          } else if (transactionData.type === 'expense') {
            newBalance -= transactionData.amount;
        }
        Transaction.update(accountRef, { balance: newBalance, updatedAt: serverTimestamp()});
        const transactionRef = doc(collection(db, COLLECTION_NAME));
        Transaction.set(transactionRef,{
            ...transactionData,
            createdAt: serverTimestamp()
        });
        return transactionRef.id;
    })
};
// lấy thông tin giao dịch bằng Id
export const getTransactionById = async (transactionId: string): Promise<Transaction | null> => {
  return await getDocument<Transaction>(COLLECTION_NAME, transactionId);
};

export const getTransactionsByAccountId = async (accountId: string): Promise<Transaction[]> => {
  return await queryDocuments<Transaction>(
    COLLECTION_NAME, 
    [{ field: 'accountId', operator: '==', value: accountId }],
    
  );
};
//lấy thông tin giao dịch bằng Id người dùng
export const getTransactionsByUserId = async (userId: string): Promise<Transaction[]> => {
  return await queryDocuments<Transaction>(
    COLLECTION_NAME, 
    [{ field: 'userId', operator: '==', value: userId }],
    'date',
   'asc'
  );
};
//lấy thông tin giao dịch bằng Id loại
export const getTransactionsByCategory = async (categoryId: string): Promise<Transaction[]> => {
  return await queryDocuments<Transaction>(
    COLLECTION_NAME, 
    [{ field: 'categoryId', operator: '==', value: categoryId }],
    
  );
};
//lấy thông tin giao dịch theo loại
export const getTransactionByType = async ( typep: string): Promise<Transaction[]> =>{
  return await queryDocuments<Transaction>(
    COLLECTION_NAME, 
    [{ field: 'type', operator: '==', value: typep }],
    
  );
};

//cập nhật giao dịch
export const updateTransaction = async ( transactionId: string, transactionData: Partial<Transaction>)
:Promise<void> => {
  return await updateDocument(COLLECTION_NAME,transactionId,transactionData);
};
//xóa giao dịch
export const deleteTransaction = async ( transactionId: string) => {
  return await deleteDocument(COLLECTION_NAME, transactionId);
};
export const undoTransaction = async ( transactionId: string )
:Promise<void> =>{
  return executeTransaction(async(transaction) =>{
    const transactionRef = doc(db, COLLECTION_NAME, transactionId);
    const transactionDoc = await transaction.get(transactionRef);
    if (!transactionDoc.exists()) {
      throw new Error('Giao dịch không tồn tại');
    }
    const transactionData = transactionDoc.data() as Transaction;
    const accountRef = doc(db, COLLECTION_NAME1, transactionData.accountId);
    const accountDoc = await transaction.get(accountRef);
    if (!accountDoc.exists()) {
      throw new Error('Tài khoản không tồn tại');
    }
    const account = accountDoc.data() as Account;
    let nbalance = account.balance;
    if(transactionData.type == 'income')
    {
      nbalance -= transactionData.amount; 
    }else if (transactionData.type === 'expense') {
      nbalance += transactionData.amount;
    }
    transaction.update(accountRef,{
      balance: nbalance,
      updatedAt: serverTimestamp()
    });
    transaction.delete(transactionRef);
  });
};
//lắng nghe sự thay đổi 
export const listenToFamily = async(userId: string,callback: (user: Transaction | null) => void ) =>
{ 
  const realtimeService = new RealtimeListenerService()
  return realtimeService.listenToDocument<Transaction>(COLLECTION_NAME, userId, callback);
}
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    return await getCollection<Transaction>(COLLECTION_NAME);
  } catch (error) {
    console.error('Lỗi khi lấy tất cả Transaction:', error);
    throw error;
  }
};
// Lọc giao dịch theo ngày cụ thể
export const getTransactionsByDate = async (
  userId: string,
  date: string | Date
): Promise<Transaction[]> => {
  try {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await queryDocuments<Transaction>(
      COLLECTION_NAME,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'date', operator: '>=', value: startOfDay },
        { field: 'date', operator: '<=', value: endOfDay }
      ],
      'date',
      'desc'
    );
  } catch (error) {
    console.error('Lỗi khi lọc giao dịch theo ngày:', error);
    throw error;
  }
};

// Lọc giao dịch theo tháng và năm
export const getTransactionsByMonth = async (
  userId: string,
  month: number,
  year: number
): Promise<Transaction[]> => {
  try {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    return await queryDocuments<Transaction>(
      COLLECTION_NAME,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'date', operator: '>=', value: startOfMonth },
        { field: 'date', operator: '<=', value: endOfMonth }
      ],
      'date',
      'desc'
    );
  } catch (error) {
    console.error('Lỗi khi lọc giao dích theo tháng:', error);
    throw error;
  }
};

// Lọc giao dịch theo năm
export const getTransactionsByYear = async (
  userId: string,
  year: number
): Promise<Transaction[]> => {
  try {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    return await queryDocuments<Transaction>(
      COLLECTION_NAME,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'date', operator: '>=', value: startOfYear },
        { field: 'date', operator: '<=', value: endOfYear }
      ],
      'date',
      'desc'
    );
  } catch (error) {
    console.error('Lỗi khi lọc giao dịch theo năm:', error);
    throw error;
  }
};

// Lọc giao dịch trong khoảng thời gian
export const getTransactionsByDateRange = async (
  userId: string,
  startDate: string | Date,
  endDate: string | Date
): Promise<Transaction[]> => {
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    // Set time cho start date là đầu ngày
    start.setHours(0, 0, 0, 0);
    // Set time cho end date là cuối ngày
    end.setHours(23, 59, 59, 999);

    return await queryDocuments<Transaction>(
      COLLECTION_NAME,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'date', operator: '>=', value: start },
        { field: 'date', operator: '<=', value: end }
      ],
      'date',
      'desc'
    );
  } catch (error) {
    console.error('Lỗi khi lọc giao dịch theo khoảng thời gian:', error);
    throw error;
  }
};

// Lọc giao dịch theo tuần (7 ngày gần nhất)
export const getTransactionsByWeek = async (
  userId: string,
  weekStartDate?: string | Date
): Promise<Transaction[]> => {
  try {
    const startDate = weekStartDate 
      ? (typeof weekStartDate === 'string' ? new Date(weekStartDate) : weekStartDate)
      : new Date();
    
    // Tìm ngày đầu tuần (Chủ nhật)
    const dayOfWeek = startDate.getDay();
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Tìm ngày cuối tuần (Thứ 7)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return await queryDocuments<Transaction>(
      COLLECTION_NAME,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'date', operator: '>=', value: startOfWeek },
        { field: 'date', operator: '<=', value: endOfWeek }
      ],
      'date',
      'desc'
    );
  } catch (error) {
    console.error('Lỗi khi lọc giao dịch theo tuần:', error);
    throw error;
  }
};

// Hàm tiện ích: Lấy giao dịch hôm nay
export const getTodayTransactions = async (userId: string): Promise<Transaction[]> => {
  return await getTransactionsByDate(userId, new Date());
};

// Hàm tiện ích: Lấy giao dịch tháng hiện tại
export const getCurrentMonthTransactions = async (userId: string): Promise<Transaction[]> => {
  const now = new Date();
  return await getTransactionsByMonth(userId, now.getMonth() + 1, now.getFullYear());
};

// Hàm tiện ích: Lấy giao dịch năm hiện tại
export const getCurrentYearTransactions = async (userId: string): Promise<Transaction[]> => {
  const now = new Date();
  return await getTransactionsByYear(userId, now.getFullYear());
};