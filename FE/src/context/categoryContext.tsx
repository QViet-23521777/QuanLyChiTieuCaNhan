import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const CategoryContext = createContext<any>(null);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // 📌 Query đến collection "Category"
        const q = query(collection(db, "Category"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const items = snapshot.docs.map((doc) => ({
                    Id: doc.id,
                    ...doc.data(),
                }));
                setCategories(items);
                setLoading(false);
            },
            (error) => {
                console.error("Lỗi khi theo dõi Category:", error);
                setLoading(false);
            }
        );

        // ✅ Cleanup listener khi unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setLoading(true);

        // 📌 Query đến collection "Transaction"
        const q = query(collection(db, "Transaction"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const items = snapshot.docs.map((doc) => ({
                    Id: doc.id,
                    ...doc.data(),
                }));
                setTransactions(items);
                setLoading(false);
            },
            (error) => {
                console.error("Lỗi khi theo dõi Transaction:", error);
                setLoading(false);
            }
        );

        // ✅ Cleanup listener khi unmount
        return () => unsubscribe();
    }, []);

    return (
        <CategoryContext.Provider value={{ transactions, categories, loading }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);
