import { db } from '../BE/firebase'; // Import db từ cấu hình Firebase
import { 
  collection, addDoc, getDoc, doc, updateDoc, deleteDoc,getDocs,
  query, where, Timestamp, orderBy, limit, serverTimestamp, 
  setDoc,
  QueryConstraint, CollectionReference,QueryDocumentSnapshot,
  Query,
  onSnapshot,
  QuerySnapshot,
  writeBatch,
  Transaction,
  runTransaction
} from 'firebase/firestore';
//thêm doc
export const addDocument = async <T extends Record<string, any>> 
(collectionName: string, data: T): Promise<string> =>{
  try{
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef,{
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }
  catch(error){
    console.error(`Lỗi khi thêm dữ liệu vào ${collectionName}:`, error);
    throw error;
  }
};
//thêm doc theo id
export const setDocument = async< T extends Record<string, any>>
(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = true
): Promise<void> =>{
  try{
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef,{
      ...data,
      updatedAt: serverTimestamp()
    })
  }
  catch (error) {
    console.error(`Lỗi khi thiết lập dữ liệu cho ${collectionName}/${docId}:`, error);
    throw error;
  }
};
// lấy thông tin 1
export const getDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try{
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists())
    {
      return { Id: docSnap.id, ...docSnap.data()} as T;
    }
    return null;
  }catch (error) {
    console.error(`Lỗi khi lấy dữ liệu từ ${collectionName}/${docId}:`, error);
    throw error;
  }
};
// lấy thông tin tất cả
export const getCollection = async <T>(
  collectionName: string
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return results;
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu từ collection ${collectionName}:`, error);
    throw error;
  }
};
// thực hiện truy vấn theo điều kiện
export const queryDocuments = async <T>(
  collectionName: string,
  conditions: {
    field: string;
    operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "array-contains";
    value: any;
  }[],
  orderByField?: string,
  orderDirection?: 'asc' | 'desc',
  limitCount?: number
): Promise<T[]> => {
  try {
    let collectionRef: CollectionReference = collection(db, collectionName);
    
   
    let q: Query = collectionRef;
    
    if (conditions && conditions.length > 0) {
      const queryConstraints = conditions.map(condition => 
        where(condition.field, condition.operator, condition.value)
      );
      q = query(q, ...queryConstraints);
    }
    
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || 'asc'));
    }
    
   
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const results: T[] = [];
    
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return results;
  } catch (error) {
    console.error(`Lỗi khi truy vấn dữ liệu từ ${collectionName}:`, error);
    throw error;
  }
};
export const updateDocument = async <T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> =>{
  try{
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef,{
      ...data,
      updatedAt: serverTimestamp()
    });
  }catch (error) {
    console.error(`Lỗi khi cập nhật dữ liệu cho ${collectionName}/${docId}:`, error);
    throw error;
  }
};
export const deleteDocument = async(
  collectionName: string,
  docId: string
): Promise<void> =>{
  try{
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  }
  catch (error) {
    console.error(`Lỗi khi xóa dữ liệu từ ${collectionName}/${docId}:`, error);
    throw error;
  }
};
export const listenDocument = <T>(
  collectionName: string,
  docId: string,
  callback: (data: T| null) => void
)=>{
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (docSanp) =>{
    if(docSanp.exists()){
      callback({id: docSanp.id, ...docSanp.data()} as T);
    }
    else{
      callback(null);
    }
  },(error)=>{
    console.error(`Lỗi khi lắng nghe document ${collectionName}/${docId}:`, error);
  })
};
export const listenQuery = <T> (
  collectionName: string,
  conditions:{
    field: string;
    operator: "==" | "!=" | ">" | ">=" | "<" | "<=";
    value: any;
  }[],
  callback: (data: T[])=> void,
  orderByField?: string,
  orderDirection?: 'asc' | 'desc'
)=>{
  let collectionRef: CollectionReference = collection(db, collectionName);
  let q: Query = collectionRef;
  if(conditions && conditions.length > 0)
  {
    const queryConstraints = conditions.map(condition =>
      where(condition.field, condition.operator, condition.value)
    );
    q = query(q,...queryConstraints);
  }
  if(orderByField)
  {
    q = query(q, orderBy(orderByField, orderDirection || 'asc'));
  }
  return onSnapshot(q,(querySnapshot) =>{
    const results: T[] = [];
    querySnapshot.forEach((doc) =>{
      results.push({id: doc.id, ...doc.data()} as T);
    });
    callback(results);
  }, (error) => {
    console.error(`Lỗi khi lắng nghe collection ${collectionName}:`, error);
  });
};
// ghi cùng lúc
export const bactchOperation = async(
  operations:{
    type:  'set' | 'update' | 'delete';
    collectionName: string;
    docId: string;
    data?: Record<string, any>
  }[]
):Promise<void> =>{
  try{
    const batch = writeBatch(db);
    for(const op of operations){
      const docRef = doc(db, op.collectionName, op.docId);
      if(op.type == 'set' && op.data)
      {
        batch.set(docRef,{
          ...op.data,
          updatedAt: serverTimestamp()
        });
      }
      else if (op.type == 'update' && op.data)
      {
        batch.update(docRef, {
          ...op.data,
          updatedAt: serverTimestamp()
        });
      }else if (op.type === 'delete') {
        batch.delete(docRef);
      }
      await batch.commit();
    }
  }
  catch (error) {
    console.error('Lỗi khi thực hiện batch operation:', error);
    throw error;
  }
}
//thao tác đọc và ghi an toàn
export const executeTransaction = async <T>(
  transactionFn: (Transaction: any) => Promise<T>
): Promise<T> =>{
  try{
    return await runTransaction(db, transactionFn);
  }catch (error) {
    console.error('Lỗi khi thực hiện transaction:', error);
    throw error;
  }
};
