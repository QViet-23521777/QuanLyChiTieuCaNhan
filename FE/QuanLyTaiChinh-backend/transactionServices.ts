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

// ===== PHẦN SỬA LỖI DATE FILTERING - VERSION 2 =====

/**
 * PHƯƠNG PHÁP 1: Lọc tất cả rồi filter phía client (đảm bảo 100% hoạt động)
 * Dùng khi Firestore query bị lỗi hoặc dữ liệu date không consistent
 */

// Hàm helper: Chuẩn hóa date từ Firestore
const normalizeFirestoreDate = (firestoreDate: any): Date => {
  if (!firestoreDate) return new Date();
  
  // Nếu đã là Date object
  if (firestoreDate instanceof Date) {
    return firestoreDate;
  }
  
  // Nếu là Firestore Timestamp
  if (firestoreDate.toDate && typeof firestoreDate.toDate === 'function') {
    return firestoreDate.toDate();
  }
  
  // Nếu là string
  if (typeof firestoreDate === 'string') {
    return new Date(firestoreDate);
  }
  
  // Nếu là number (timestamp)
  if (typeof firestoreDate === 'number') {
    return new Date(firestoreDate);
  }
  
  // Fallback
  return new Date(firestoreDate);
};

// Hàm helper: So sánh 2 ngày (chỉ so sánh ngày, bỏ qua giờ)
const isSameDate = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Hàm helper: Kiểm tra ngày có trong tháng/năm không
const isDateInMonth = (date: Date, month: number, year: number): boolean => {
  return date.getFullYear() === year && (date.getMonth() + 1) === month;
};

const isDateInYear = (date: Date, year: number): boolean => {
  return date.getFullYear() === year;
};

// LỌC THEO NGÀY CỤ THỂ - CLIENT SIDE FILTERING
export const getTransactionsByDate = async (
  userId: string,
  date: string | Date
): Promise<Transaction[]> => {
  try {
    console.log(`🔍 Lọc giao dịch theo ngày (Client-side filtering)`);
    
    // Lấy tất cả giao dịch của user
    const allTransactions = await getTransactionsByUserId(userId);
    console.log(`📊 Tổng số giao dịch của user: ${allTransactions.length}`);
    
    // Chuẩn hóa ngày cần lọc
    const targetDate = typeof date === 'string' ? new Date(date) : new Date(date);
    console.log(`🎯 Ngày cần lọc: ${targetDate.toLocaleDateString('vi-VN')}`);
    
    // Lọc phía client
    const filteredTransactions = allTransactions.filter(transaction => {
      try {
        const transactionDate = normalizeFirestoreDate(transaction.date);
        const isMatch = isSameDate(transactionDate, targetDate);
        
        if (isMatch) {
          console.log(`✅ Khớp: ${transaction.decription} - ${transactionDate.toLocaleDateString('vi-VN')}`);
        }
        
        return isMatch;
      } catch (error) {
        console.error('❌ Lỗi khi xử lý ngày:', error, transaction);
        return false;
      }
    });

    console.log(`✅ Tìm thấy ${filteredTransactions.length} giao dịch`);
    
    // Sắp xếp theo thời gian (mới nhất trước)
    return filteredTransactions.sort((a, b) => {
      const dateA = normalizeFirestoreDate(a.date);
      const dateB = normalizeFirestoreDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi lọc giao dịch theo ngày:', error);
    throw error;
  }
};

// LỌC THEO THÁNG - CLIENT SIDE FILTERING
export const getTransactionsByMonth = async (
  userId: string,
  month: number,
  year: number
): Promise<Transaction[]> => {
  try {
    console.log(`🔍 Lọc giao dịch tháng ${month}/${year} (Client-side filtering)`);
    
    // Lấy tất cả giao dịch của user
    const allTransactions = await getTransactionsByUserId(userId);
    console.log(`📊 Tổng số giao dịch của user: ${allTransactions.length}`);
    
    // Lọc phía client
    const filteredTransactions = allTransactions.filter(transaction => {
      try {
        const transactionDate = normalizeFirestoreDate(transaction.date);
        return isDateInMonth(transactionDate, month, year);
      } catch (error) {
        console.error('❌ Lỗi khi xử lý ngày:', error, transaction);
        return false;
      }
    });

    console.log(`✅ Tìm thấy ${filteredTransactions.length} giao dịch`);
    
    // Sắp xếp theo thời gian (mới nhất trước)
    return filteredTransactions.sort((a, b) => {
      const dateA = normalizeFirestoreDate(a.date);
      const dateB = normalizeFirestoreDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi lọc giao dịch theo tháng:', error);
    throw error;
  }
};

// LỌC THEO NĂM - CLIENT SIDE FILTERING
export const getTransactionsByYear = async (
  userId: string,
  year: number
): Promise<Transaction[]> => {
  try {
    console.log(`🔍 Lọc giao dịch năm ${year} (Client-side filtering)`);
    
    // Lấy tất cả giao dịch của user
    const allTransactions = await getTransactionsByUserId(userId);
    console.log(`📊 Tổng số giao dịch của user: ${allTransactions.length}`);
    
    // Lọc phía client
    const filteredTransactions = allTransactions.filter(transaction => {
      try {
        const transactionDate = normalizeFirestoreDate(transaction.date);
        return isDateInYear(transactionDate, year);
      } catch (error) {
        console.error('❌ Lỗi khi xử lý ngày:', error, transaction);
        return false;
      }
    });

    console.log(`✅ Tìm thấy ${filteredTransactions.length} giao dịch`);
    
    // Sắp xếp theo thời gian (mới nhất trước)
    return filteredTransactions.sort((a, b) => {
      const dateA = normalizeFirestoreDate(a.date);
      const dateB = normalizeFirestoreDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi lọc giao dịch theo năm:', error);
    throw error;
  }
};

// LỌC THEO KHOẢNG THỜI GIAN - CLIENT SIDE FILTERING
export const getTransactionsByDateRange = async (
  userId: string,
  startDate: string | Date,
  endDate: string | Date
): Promise<Transaction[]> => {
  try {
    console.log(`🔍 Lọc giao dịch theo khoảng thời gian (Client-side filtering)`);
    
    const start = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);
    const end = typeof endDate === 'string' ? new Date(endDate) : new Date(endDate);
    
    // Lấy tất cả giao dịch của user
    const allTransactions = await getTransactionsByUserId(userId);
    
    // Lọc phía client
    const filteredTransactions = allTransactions.filter(transaction => {
      try {
        const transactionDate = normalizeFirestoreDate(transaction.date);
        
        // Reset thời gian để chỉ so sánh ngày
        const transDate = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
        const startComp = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endComp = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        
        return transDate >= startComp && transDate <= endComp;
      } catch (error) {
        console.error('❌ Lỗi khi xử lý ngày:', error, transaction);
        return false;
      }
    });

    console.log(`✅ Tìm thấy ${filteredTransactions.length} giao dịch từ ${start.toLocaleDateString('vi-VN')} đến ${end.toLocaleDateString('vi-VN')}`);
    
    // Sắp xếp theo thời gian (mới nhất trước)
    return filteredTransactions.sort((a, b) => {
      const dateA = normalizeFirestoreDate(a.date);
      const dateB = normalizeFirestoreDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi lọc giao dịch theo khoảng thời gian:', error);
    throw error;
  }
};

// LỌC THEO TUẦN - CLIENT SIDE FILTERING
export const getTransactionsByWeek = async (
  userId: string,
  weekStartDate?: string | Date
): Promise<Transaction[]> => {
  try {
    const baseDate = weekStartDate 
      ? (typeof weekStartDate === 'string' ? new Date(weekStartDate) : new Date(weekStartDate))
      : new Date();
    
    // Tìm ngày đầu tuần (Chủ nhật)
    const dayOfWeek = baseDate.getDay();
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - dayOfWeek);
    
    // Tìm ngày cuối tuần (Thứ 7)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    console.log(`🔍 Lọc giao dịch tuần từ ${startOfWeek.toLocaleDateString('vi-VN')} đến ${endOfWeek.toLocaleDateString('vi-VN')}`);

    return await getTransactionsByDateRange(userId, startOfWeek, endOfWeek);
  } catch (error) {
    console.error('❌ Lỗi khi lọc giao dịch theo tuần:', error);
    throw error;
  }
};

// ===== PHƯƠNG PHÁP 2: FIRESTORE QUERY (Backup method) =====

// Hàm tạo Firestore Timestamp
const createFirestoreTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// LỌC THEO NGÀY - FIRESTORE QUERY
export const getTransactionsByDateFirestore = async (
  userId: string,
  date: string | Date
): Promise<Transaction[]> => {
  try {
    const targetDate = typeof date === 'string' ? new Date(date) : new Date(date);
    
    // Tạo khoảng thời gian
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Chuyển đổi thành Firestore Timestamp
    const startTimestamp = createFirestoreTimestamp(startOfDay);
    const endTimestamp = createFirestoreTimestamp(endOfDay);

    console.log(`🔍 Firestore Query - Lọc giao dịch ngày ${targetDate.toLocaleDateString('vi-VN')}`);

    const transactions = await queryDocuments<Transaction>(
      COLLECTION_NAME,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'date', operator: '>=', value: startTimestamp },
        { field: 'date', operator: '<=', value: endTimestamp }
      ],
      'date',
      'desc'
    );

    console.log(`✅ Firestore Query - Tìm thấy ${transactions.length} giao dịch`);
    return transactions;
  } catch (error) {
    console.error('❌ Firestore Query lỗi, chuyển sang Client-side filtering:', error);
    // Fallback to client-side filtering
    return await getTransactionsByDate(userId, date);
  }
};

// ===== CÁC HÀM TIỆN ÍCH =====

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

// Hàm tính tổng thu nhập theo userId
export const getTotalIncome = async (userId: string): Promise<number> => {
  try {
    const incomeTransactions = await queryDocuments<Transaction>(
      COLLECTION_NAME,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'type', operator: '==', value: 'income' }
      ]
    );
    
    return incomeTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  } catch (error) {
    console.error('❌ Lỗi khi tính tổng thu nhập:', error);
    throw error;
  }
};

// Hàm tính tổng chi tiêu theo userId
export const getTotalExpense = async (userId: string): Promise<number> => {
  try {
    const expenseTransactions = await queryDocuments<Transaction>(
      COLLECTION_NAME,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'type', operator: '==', value: 'expense' }
      ]
    );
    
    return expenseTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  } catch (error) {
    console.error('❌ Lỗi khi tính tổng chi tiêu:', error);
    throw error;
  }
};

// ===== HÀM DEBUG =====

// Utility function để debug Firestore timestamp
export const debugFirestoreDate = (firestoreDate: any) => {
  console.log('🔍 Debug Firestore Date:', {
    raw: firestoreDate,
    type: typeof firestoreDate,
    constructor: firestoreDate?.constructor?.name,
    toDate: firestoreDate?.toDate ? firestoreDate.toDate() : 'No toDate method',
    toString: firestoreDate?.toString(),
    toLocaleString: firestoreDate?.toDate ? firestoreDate.toDate().toLocaleString('vi-VN') : 'N/A',
    normalized: normalizeFirestoreDate(firestoreDate).toLocaleString('vi-VN')
  });
};

// Hàm debug tất cả giao dịch của user
export const debugAllUserTransactions = async (userId: string): Promise<void> => {
  try {
    console.log('🔍 === DEBUG ALL USER TRANSACTIONS ===');
    
    const allTransactions = await getTransactionsByUserId(userId);
    console.log(`📊 Tổng số giao dịch: ${allTransactions.length}`);
    
    allTransactions.forEach((transaction, index) => {
      console.log(`\n🏷️  Giao dịch ${index + 1}:`);
      console.log(`   ID: ${transaction.Id}`);
      console.log(`   Mô tả: ${transaction.decription}`);
      console.log(`   Số tiền: ${transaction.amount}`);
      console.log(`   Loại: ${transaction.type}`);
      console.log(`   Raw date:`, transaction.date);
      
      try {
        const normalizedDate = normalizeFirestoreDate(transaction.date);
        console.log(`   Ngày (chuẩn hóa): ${normalizedDate.toLocaleString('vi-VN')}`);
        console.log(`   Ngày (ISO): ${normalizedDate.toISOString()}`);
      } catch (error) {
        console.log(`   ❌ Lỗi khi chuẩn hóa ngày:`, error);
      }
    });
    
    console.log('\n🔍 === END DEBUG ===');
  } catch (error) {
    console.error('❌ Lỗi khi debug:', error);
  }
};

// Test function để kiểm tra filtering
export const testDateFiltering = async (userId: string): Promise<void> => {
  try {
    console.log('🧪 === TEST DATE FILTERING ===');
    
    // Test lọc hôm nay
    const todayTransactions = await getTodayTransactions(userId);
    console.log(`📅 Giao dịch hôm nay: ${todayTransactions.length}`);
    
    // Test lọc tháng hiện tại
    const currentMonthTransactions = await getCurrentMonthTransactions(userId);
    console.log(`📅 Giao dịch tháng này: ${currentMonthTransactions.length}`);
    
    // Test lọc năm hiện tại
    const currentYearTransactions = await getCurrentYearTransactions(userId);
    console.log(`📅 Giao dịch năm này: ${currentYearTransactions.length}`);
    
    console.log('🧪 === END TEST ===');
  } catch (error) {
    console.error('❌ Lỗi khi test:', error);
  }
};