import { Timestamp } from 'firebase/firestore';
import { Photo, Comment, User } from '../models/types';
import {
    addDocument,
    deleteDocument,
    setDocument,
    updateDocument,
    queryDocuments,
    listenDocument,
    getDocument
} from './firestoreservices';
import { generateSequentialId } from './id';
import { addComment } from './commentServices';
import { RealtimeListenerService  } from './RealtimeListenerService';
const COLLECTION_NAME = 'Photo';
// Hàm lấy trường cho Photo
export const getPhotoField = async <K extends keyof Photo>(
    photoId: string,
    field: K
  ): Promise<Photo[K] | null> => {
    try {
      const COLLECTION_NAME = 'Photo';
      const photo = await getDocument<Photo>(COLLECTION_NAME, photoId);
      if (!photo) {
        return null;
      }
      return photo[field];
    } catch (error) {
      console.error(`Lỗi khi lấy trường ${String(field)} từ ảnh ${photoId}:`, error);
      throw error;
    }
  };
// thêm album
export const addPhoto = async ( phodoData: Omit<Photo, 'Id' | 'createdAt' | 'updatedAt' >)
:Promise<string> =>{
    return await addDocument(COLLECTION_NAME, phodoData);
};
// lấy ảnh bằng Id
export const getPhotoById = async ( photoId: string):
Promise<Photo | null> =>{
    return await getDocument(COLLECTION_NAME, photoId);
};
// lấy ảnh bằng Id gia đình
export const getPhotoByAlbumId = async ( getPhotoByAlbumId: string)
:Promise<Photo[] | null> =>{
    return await queryDocuments<Photo>(COLLECTION_NAME,[{
        field: 'albumId', operator: '==', value: getPhotoByAlbumId
    }]);
};
//lấy hình bằng Id người tạo
export const getPhotoByCreId = async ( creId: string)
:Promise<Photo[] | null> => {
  return await queryDocuments<Photo>(COLLECTION_NAME,[{
    field: 'createdBy', operator: '==', value: creId
  }])
};
//cập nhật hình
export const updatePhoto = async (photoId: string, photoData: Partial<Photo>)
:Promise<void> =>{
    return await updateDocument(COLLECTION_NAME,photoId, photoData);
};
//xóa hình
export const deletePhoto = async (photoId: string)
:Promise<void> =>{
    return await deleteDocument(COLLECTION_NAME,photoId);
};
//thích ảnh
export const likeToPhoto = async (photoId: string,userId: string): Promise<void> => 
{
  const photo = await getPhotoById(photoId);
  if( photo && !photo.likes.includes(userId))
  {
    await updateDocument(COLLECTION_NAME, photoId,{
      likes: [...photo.likes, userId],
      numlike: photo.numlike + 1
    })
  }
};
//gỡ thích ảnh
export const unlikeToPhoto = async (photoId: string,userId: string): Promise<void> => 
{
  const photo = await getPhotoById(photoId);
  if( photo && photo.likes.includes(userId))
  {
    await updateDocument(COLLECTION_NAME, photoId,{
      likes: photo.likes.filter(id => id !== userId),
      numlike: photo.numlike - 1
    })
  }
};
//thêm bình luận 
export const addCommentToPhoto = async (photoId: string, commentData: Omit<Comment, 'Id' | 'createdAt' | 'updatedAt'>): Promise<string> =>
{
  const photo = await getPhotoById(photoId);
  if(photo)
  {
    const commentId = generateSequentialId();
    const newComment: Comment = {
    Id: commentId,
    ...commentData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
    }
      await updateDocument<Photo>(COLLECTION_NAME,photoId,{
      comments: [...photo.comments, commentId],
      numcom: photo.numcom + 1
    })
    await addComment(newComment);
    return commentId;
  }
  return 'null';
};
//xóa comment
export const removeCommentFromPhoto = async (photoId: string, commentId: string): Promise<void> => {
  const photo = await getPhotoById(photoId);
  if(photo)
  {
    await updateDocument<Photo>('Photo', photoId, {
      comments: photo.comments.filter(comment => comment !== commentId),
      numcom: photo.numcom - 1
    });
  }
};

//lắng nghe thay đổi
export const listenToFamily = async(userId: string,callback: (user: Photo | null) => void ) =>
{ 
  const realtimeService = new RealtimeListenerService()
  return realtimeService.listenToDocument<Photo>(COLLECTION_NAME, userId, callback);
}