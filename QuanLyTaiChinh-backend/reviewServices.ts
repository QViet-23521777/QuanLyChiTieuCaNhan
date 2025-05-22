import { Review, User } from '../models/types';
import {
    addDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    queryDocuments,
    getDocument,
    listenDocument
} from './firestoreservices';
import { RealtimeListenerService  } from './RealtimeListenerService';
const COLLECTION_NAME = 'Review';
// Hàm lấy trường cho Review
export const getReviewField = async <K extends keyof Review>(
    reviewId: string,
    field: K
  ): Promise<Review[K] | null> => {
    try {
      
      const review = await getDocument<Review>(COLLECTION_NAME, reviewId);
      if (!review) {
        return null;
      }
      return review[field];
    } catch (error) {
      console.error(`Lỗi khi lấy trường ${String(field)} từ đánh giá ${reviewId}:`, error);
      throw error;
    }
};
//tạo review
export const addReview = async(reviewDta: Omit<Review, 'Id'|'createdAt' | 'updatedAt'>) =>
{
    return await addDocument(COLLECTION_NAME,reviewDta);
};
//lấy review bằng Id 
export const getReviewById = async ( reviewId: string) : Promise<Review | null> =>
{
  return await getDocument<Review>(COLLECTION_NAME, reviewId);
}
//tìm kiếm review theo người dùng
export const getReviewByUserId = async ( userId: string) =>
{
    return await queryDocuments(COLLECTION_NAME, [{
        field: 'userId', operator: '==', value: userId
    }]);
};
//cập nhật review
export const updateReview = async (reviewId: string, reviewData: Partial<Review>) =>{
    return await updateDocument(COLLECTION_NAME, reviewId, reviewData);
};
//xóa review
export const deleteReview = async ( reviewID : string) =>{
    return await deleteDocument(COLLECTION_NAME, reviewID);
};
//lắng nghe thay đổi
export const listenToFamily = async(userId: string,callback: (user: Review | null) => void ) =>
{ 
  const realtimeService = new RealtimeListenerService()
  return realtimeService.listenToDocument<Review>(COLLECTION_NAME, userId, callback);
}


