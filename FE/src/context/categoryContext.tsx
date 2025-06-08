import React, { createContext, useContext, useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // đảm bảo đúng đường dẫn
import { Category } from "@/types";

// Kiểu dữ liệu cho Context
interface CategoryContextType {
    categories: Category[];
    loading: boolean;
}

// Context mặc định
const CategoryContext = createContext<CategoryContextType>({
    categories: [],
    loading: true,
});

// Provider
export const CategoryProvider: React.FC<{
    children: React.ReactNode;
    familyId: string; // lọc category theo family nếu cần
}> = ({ children, familyId }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!familyId) return;

        const q = query(
            collection(db, "Categories"),
            where("familyId", "==", familyId)
        );
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetched = snapshot.docs.map((doc) => ({
                    Id: doc.id,
                    ...(doc.data() as Omit<Category, "Id">),
                }));
                setCategories(fetched);
                setLoading(false); // ✅ dữ liệu đã tải xong
            },
            (error) => {
                console.error("Lỗi khi lấy dữ liệu Category:", error);
                setLoading(false); // vẫn phải tắt loading
            }
        );

        return () => unsubscribe(); // cleanup listener
    }, [familyId]);

    return (
        <CategoryContext.Provider value={{ categories, loading }}>
            {children}
        </CategoryContext.Provider>
    );
};

// Hook để dùng trong component
export const useCategory = () => useContext(CategoryContext);
