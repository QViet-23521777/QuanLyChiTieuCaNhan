import { Transaction, Account } from '../models/types';
import { 
  addDocument, 
  getDocument, 
  queryDocuments, 
  executeTransaction, 
  updateDocument,
  deleteDocument, listenDocument
} from './firestoreservices';
import { getAccountById, updateAccountBalance } from './accountServices';
import { doc, serverTimestamp, collection, Timestamp } from 'firebase/firestore';
import { RealtimeListenerService  } from './RealtimeListenerService';
import { db } from '../BE/firebase';
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