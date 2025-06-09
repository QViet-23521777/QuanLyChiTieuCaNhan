// services/categoryService.ts
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, 'Category'));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const addCategory = async (categoryName: string) => {
    await addDoc(collection(db, 'Category'), {
        name: categoryName,
        type: 'expense',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};