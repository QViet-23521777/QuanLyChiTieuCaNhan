import { firestore } from '../BE/firebase'; // Import firestore từ cấu hình Firebase
import admin from 'firebase-admin';

// Thêm document
export const addDocument = async <T extends Record<string, any>>(
  collectionName: string, 
  data: T
): Promise<string> => {
  try {
    const docRef = await firestore.collection(collectionName).add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Lỗi khi thêm dữ liệu vào ${collectionName}:`, error);
    throw error;
  }
};

// Thêm document theo ID
export const setDocument = async <T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = true
): Promise<void> => {
  try {
    await firestore.collection(collectionName).doc(docId).set({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge });
  } catch (error) {
    console.error(`Lỗi khi thiết lập dữ liệu cho ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// Lấy thông tin 1 document
export const getDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const doc = await firestore.collection(collectionName).doc(docId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu từ ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// Lấy thông tin tất cả documents
export const getCollection = async <T>(
  collectionName: string
): Promise<T[]> => {
  try {
    const snapshot = await firestore.collection(collectionName).get();
    const results: T[] = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    return results;
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu từ collection ${collectionName}:`, error);
    throw error;
  }
};

// Thực hiện truy vấn theo điều kiện
export const queryDocuments = async <T>(
  collectionName: string,
  conditions: {
    field: string;
    operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "array-contains" | "array-contains-any" | "in" | "not-in";
    value: any;
  }[],
  orderByField?: string,
  orderDirection?: 'asc' | 'desc',
  limitCount?: number
): Promise<T[]> => {
  try {
    let query: FirebaseFirestore.Query = firestore.collection(collectionName);
    
    // Áp dụng điều kiện where
    if (conditions && conditions.length > 0) {
      for (const condition of conditions) {
        query = query.where(condition.field, condition.operator as any, condition.value);
      }
    }
    
    // Áp dụng order by
    if (orderByField) {
      query = query.orderBy(orderByField, orderDirection || 'asc');
    }
    
    // Áp dụng limit
    if (limitCount) {
      query = query.limit(limitCount);
    }
    
    const snapshot = await query.get();
    const results: T[] = [];
    
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return results;
  } catch (error) {
    console.error(`Lỗi khi truy vấn dữ liệu từ ${collectionName}:`, error);
    throw error;
  }
};

// Cập nhật document
export const updateDocument = async <T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    await firestore.collection(collectionName).doc(docId).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error(`Lỗi khi cập nhật dữ liệu cho ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// Xóa document
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    await firestore.collection(collectionName).doc(docId).delete();
  } catch (error) {
    console.error(`Lỗi khi xóa dữ liệu từ ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// Lắng nghe thay đổi document (Real-time)
export const listenDocument = <T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
) => {
  const docRef = firestore.collection(collectionName).doc(docId);
  return docRef.onSnapshot((docSnap) => {
    if (docSnap.exists) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Lỗi khi lắng nghe document ${collectionName}/${docId}:`, error);
  });
};

// Lắng nghe thay đổi query (Real-time)
export const listenQuery = <T>(
  collectionName: string,
  conditions: {
    field: string;
    operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "array-contains" | "array-contains-any" | "in" | "not-in";
    value: any;
  }[],
  callback: (data: T[]) => void,
  orderByField?: string,
  orderDirection?: 'asc' | 'desc'
) => {
  let query: any = firestore.collection(collectionName);
  
  if (conditions && conditions.length > 0) {
    for (const condition of conditions) {
      query = query.where(condition.field, condition.operator, condition.value);
    }
  }
  
  if (orderByField) {
    query = query.orderBy(orderByField, orderDirection || 'asc');
  }
  
  return query.onSnapshot((querySnapshot: any) => {
    const results: T[] = [];
    querySnapshot.forEach((doc: any) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    callback(results);
  }, (error: any) => {
    console.error(`Lỗi khi lắng nghe collection ${collectionName}:`, error);
  });
};

// Batch operations (ghi cùng lúc)
export const batchOperation = async (
  operations: {
    type: 'set' | 'update' | 'delete';
    collectionName: string;
    docId: string;
    data?: Record<string, any>;
  }[]
): Promise<void> => {
  try {
    const batch = firestore.batch();
    
    for (const op of operations) {
      const docRef = firestore.collection(op.collectionName).doc(op.docId);
      
      if (op.type === 'set' && op.data) {
        batch.set(docRef, {
          ...op.data,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else if (op.type === 'update' && op.data) {
        batch.update(docRef, {
          ...op.data,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else if (op.type === 'delete') {
        batch.delete(docRef);
      }
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Lỗi khi thực hiện batch operation:', error);
    throw error;
  }
};

// Transaction (thao tác đọc và ghi an toàn)
export const executeTransaction = async <T>(
  transactionFn: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> => {
  try {
    return await firestore.runTransaction(transactionFn);
  } catch (error) {
    console.error('Lỗi khi thực hiện transaction:', error);
    throw error;
  }
};

// Helper function: Tạo timestamp
export const createTimestamp = () => {
  return admin.firestore.FieldValue.serverTimestamp();
};

// Helper function: Tạo document reference
export const getDocumentRef = (collectionName: string, docId: string) => {
  return firestore.collection(collectionName).doc(docId);
};

// Helper function: Tạo collection reference
export const getCollectionRef = (collectionName: string) => {
  return firestore.collection(collectionName);
};