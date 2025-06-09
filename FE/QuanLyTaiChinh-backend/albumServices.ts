import { Album, Photo } from '../models/types';
import {
    addDocument,
    deleteDocument,
    setDocument,
    updateDocument,
    queryDocuments,
    listenDocument,
    getDocument
} from './firestoreservices';
import { RealtimeListenerService  } from './RealtimeListenerService';
const COLLECTION_NAME = 'Album';
// Hàm lấy trường cho Album
export const getAlbumField = async <K extends keyof Album>(
    albumId: string,
    field: K
  ): Promise<Album[K] | null> => {
    try {
      const COLLECTION_NAME = 'Album';
      const album = await getDocument<Album>(COLLECTION_NAME, albumId);
      if (!album) {
        return null;
      }
      return album[field];
    } catch (error) {
      console.error(`Lỗi khi lấy trường ${String(field)} từ album ${albumId}:`, error);
      throw error;
    }
  };
// thêm album
export const addAlbum = async ( albumData: Omit<Album, 'Id' | 'createdAt' | 'updatedAt'>)
:Promise<string> =>{
    return await addDocument(COLLECTION_NAME,albumData);
}
//lấy album bằng Id
export const getAlbumById = async ( albumById: string)
:Promise<Album | null> =>{
    return await getDocument<Album>(COLLECTION_NAME,albumById);
}
//cập nhật album
export const updateAlbum = async ( albumId: string, albumData: Partial<Album>)
:Promise<void> =>{
    return await updateDocument(COLLECTION_NAME,albumId,albumData);
}
// thêm ảnh vào album
export const addPictureToAlbum = async ( almbumId: string, photoId: string )
:Promise<void> =>{
    const album = await getAlbumById(almbumId);
    if(album)
    {
        const updateAlbum = [...album.picturesId,photoId];
        await updateDocument(COLLECTION_NAME, almbumId, {picturesId: updateAlbum});
    }
    else
    {
        const newAlbum: Omit<Album, 'createdAt' | 'updatedAt'> ={
            Id: almbumId,
            name:"New album",
            description: "",
            familyId: "",
            picturesId: [photoId],
            createdBy:""
        }
        await setDocument(COLLECTION_NAME, almbumId, newAlbum);
    }
};
//lấy thông tin album bằng thông familyId
export const getAlbumByFamilyId = async ( familyId: string):
Promise<Album[]> => {
    return await queryDocuments<Album>(COLLECTION_NAME,[{
        field: 'familyId', operator: '==', value: familyId
    }])
};
//lấy thông tin album bằng id hình
export const getAlbumByPhotoId = async ( photoId: string)
:Promise<Album[]> => {
    return await queryDocuments<Album>(COLLECTION_NAME,[{
        field: 'photoId', operator: '==', value: photoId
    }])
};
//xóa album
export const deleteAlbum = async (albumId: string)
:Promise<void> => {
    return await deleteAlbum(albumId);
};
// loại bỏ hình
export const deletePhoto = async ( albumId: string, photoId: string):
Promise<void> =>
{
    const album = await getAlbumById(albumId);
    if(album){
        const updateAlbum = album.picturesId.filter(id => id!== photoId);
        await updateDocument(COLLECTION_NAME, albumId, {picturesId: updateAlbum});
    }
};
//lắng nghe thay đổi
export const listenToFamily = async(userId: string,callback: (user: Album | null) => void ) =>
{ 
  const realtimeService = new RealtimeListenerService()
  return realtimeService.listenToDocument<Album>(COLLECTION_NAME, userId, callback);
}