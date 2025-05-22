// services/realtimeListenerService.ts
import { db } from '../BE/firebase';
import { 
  doc, collection, onSnapshot, query, where, orderBy, 
  QueryConstraint, DocumentData, Query
} from 'firebase/firestore';

type ListenerCallback = (data: DocumentData) => void;
type CollectionListenerCallback = (data: DocumentData[]) => void;

export class RealtimeListenerService {
  private activeListeners: Map<string, () => void> = new Map();

  // Lắng nghe một document cụ thể
  listenToDocument<T = DocumentData>(
  collectionName: string,
  documentId: string,
  callback: (data: T | null) => void
): string {
  const listenerId = `${collectionName}_${documentId}`;
  
  // Kiểm tra nếu đã có listener cho document này
  if (this.activeListeners.has(listenerId)) {
    console.warn(`Listener for ${listenerId} already exists. Replacing...`);
    this.removeListener(listenerId);
  }
  
  const docRef = doc(db, collectionName, documentId);
  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as unknown as T);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Lỗi khi lắng nghe document ${collectionName}/${documentId}:`, error);
    // Tùy chọn: callback(null) khi có lỗi
  });
  
  this.activeListeners.set(listenerId, unsubscribe);
  return listenerId;
}
  // Lắng nghe một collection với nhiều điều kiện lọc
  listenToCollection<T = DocumentData>(
    collectionName: string,
    conditions?: {
      field: string;
      operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "array-contains";
      value: any;
    }[],
    callback?: CollectionListenerCallback,
    orderByField?: string,
    orderDirection?: 'asc' | 'desc'
  ): string {
    // Tạo ID duy nhất cho listener này
    const listenerId = `${collectionName}_${conditions ? JSON.stringify(conditions) : 'all'}_${orderByField || ''}`;

    // Hủy listener cũ nếu tồn tại
    if (this.activeListeners.has(listenerId)) {
      this.removeListener(listenerId);
    }

    // Tạo query
    let collectionRef = collection(db, collectionName);
    let queryRef: Query = collectionRef;

    // Thêm các điều kiện where nếu có
    if (conditions && conditions.length > 0) {
      const queryConstraints: QueryConstraint[] = conditions.map(condition =>
        where(condition.field, condition.operator, condition.value)
      );
      queryRef = query(queryRef, ...queryConstraints);
    }

    // Thêm sắp xếp nếu có
    if (orderByField) {
      queryRef = query(queryRef, orderBy(orderByField, orderDirection || 'asc'));
    }
    

    // Lắng nghe thay đổi
    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (callback) callback(items);
    }, (error) => {
      console.error(`Lỗi khi lắng nghe collection ${collectionName}:`, error);
    });

    // Lưu trữ listener
    this.activeListeners.set(listenerId, unsubscribe);
    return listenerId;
  }

 
  removeListener(listenerId: string): boolean {
    const unsubscribe = this.activeListeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.activeListeners.delete(listenerId);
      return true;
    }
    return false;
  }

 
  removeAllListeners(): void {
    for (const [id, unsubscribe] of this.activeListeners.entries()) {
      unsubscribe();
      this.activeListeners.delete(id);
    }
  }
}

export default new RealtimeListenerService();