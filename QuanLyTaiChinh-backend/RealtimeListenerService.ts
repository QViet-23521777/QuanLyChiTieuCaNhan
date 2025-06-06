// services/realtimeListenerService.ts
import { firestore } from '../BE/firebase'; // Import firestore từ cấu hình Firebase Admin SDK

type ListenerCallback<T> = (data: T | null) => void;
type CollectionListenerCallback<T> = (data: T[]) => void;

export class RealtimeListenerService {
  private activeListeners: Map<string, () => void> = new Map();

  // Lắng nghe một document cụ thể
  listenToDocument<T>(
    collectionName: string,
    documentId: string,
    callback: ListenerCallback<T>
  ): string {
    const listenerId = `${collectionName}_${documentId}`;

    // Kiểm tra nếu đã có listener cho document này
    if (this.activeListeners.has(listenerId)) {
      console.warn(`Listener for ${listenerId} already exists. Replacing...`);
      this.removeListener(listenerId);
    }

    const docRef = firestore.collection(collectionName).doc(documentId);
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        callback({ id: doc.id, ...doc.data() } as T);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error(`Lỗi khi lắng nghe document ${collectionName}/${documentId}:`, error);
      // Tùy chọn: callback(null) khi có lỗi
      callback(null);
    });

    this.activeListeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Lắng nghe một collection với nhiều điều kiện lọc
  listenToCollection<T>(
    collectionName: string,
    conditions?: {
      field: string;
      operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "array-contains" | "array-contains-any" | "in" | "not-in";
      value: any;
    }[],
    callback?: CollectionListenerCallback<T>,
    orderByField?: string,
    orderDirection?: 'asc' | 'desc'
  ): string {
    // Tạo ID duy nhất cho listener này
    const listenerId = `${collectionName}_${conditions ? JSON.stringify(conditions) : 'all'}_${orderByField || ''}`;

    // Hủy listener cũ nếu tồn tại
    if (this.activeListeners.has(listenerId)) {
      this.removeListener(listenerId);
    }

    // Tạo query - sử dụng Firebase Admin SDK
    let query: FirebaseFirestore.Query = firestore.collection(collectionName);

    // Thêm các điều kiện where nếu có
    if (conditions && conditions.length > 0) {
      for (const condition of conditions) {
        query = query.where(condition.field, condition.operator as any, condition.value);
      }
    }

    // Thêm sắp xếp nếu có
    if (orderByField) {
      query = query.orderBy(orderByField, orderDirection || 'asc');
    }

    // Lắng nghe thay đổi
    const unsubscribe = query.onSnapshot((snapshot) => {
      const items: T[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as T);
      });
      if (callback) callback(items);
    }, (error) => {
      console.error(`Lỗi khi lắng nghe collection ${collectionName}:`, error);
      if (callback) callback([]);
    });

    // Lưu trữ listener
    this.activeListeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Lắng nghe collection với query phức tạp hơn (có limit)
  listenToCollectionWithLimit<T>(
    collectionName: string,
    conditions?: {
      field: string;
      operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "array-contains" | "array-contains-any" | "in" | "not-in";
      value: any;
    }[],
    callback?: CollectionListenerCallback<T>,
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number
  ): string {
    // Tạo ID duy nhất cho listener này
    const listenerId = `${collectionName}_${conditions ? JSON.stringify(conditions) : 'all'}_${orderByField || ''}_${limitCount || ''}`;

    // Hủy listener cũ nếu tồn tại
    if (this.activeListeners.has(listenerId)) {
      this.removeListener(listenerId);
    }

    // Tạo query - sử dụng Firebase Admin SDK
    let query: FirebaseFirestore.Query = firestore.collection(collectionName);

    // Thêm các điều kiện where nếu có
    if (conditions && conditions.length > 0) {
      for (const condition of conditions) {
        query = query.where(condition.field, condition.operator as any, condition.value);
      }
    }

    // Thêm sắp xếp nếu có
    if (orderByField) {
      query = query.orderBy(orderByField, orderDirection || 'asc');
    }

    // Thêm limit nếu có
    if (limitCount) {
      query = query.limit(limitCount);
    }

    // Lắng nghe thay đổi
    const unsubscribe = query.onSnapshot((snapshot) => {
      const items: T[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as T);
      });
      if (callback) callback(items);
    }, (error) => {
      console.error(`Lỗi khi lắng nghe collection ${collectionName}:`, error);
      if (callback) callback([]);
    });

    // Lưu trữ listener
    this.activeListeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Hủy một listener cụ thể
  removeListener(listenerId: string): boolean {
    const unsubscribe = this.activeListeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.activeListeners.delete(listenerId);
      console.log(`Đã hủy listener: ${listenerId}`);
      return true;
    }
    console.warn(`Không tìm thấy listener: ${listenerId}`);
    return false;
  }

  // Hủy tất cả listeners
  removeAllListeners(): void {
    console.log(`Đang hủy ${this.activeListeners.size} listeners...`);
    for (const [id, unsubscribe] of this.activeListeners.entries()) {
      unsubscribe();
      console.log(`Đã hủy listener: ${id}`);
    }
    this.activeListeners.clear();
  }

  // Lấy danh sách các listener đang hoạt động
  getActiveListeners(): string[] {
    return Array.from(this.activeListeners.keys());
  }

  // Kiểm tra xem một listener có đang hoạt động không
  isListenerActive(listenerId: string): boolean {
    return this.activeListeners.has(listenerId);
  }
}

// Export singleton instance
export default new RealtimeListenerService();