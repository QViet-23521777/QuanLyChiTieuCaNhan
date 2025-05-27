import express from 'express';
import { body, param } from 'express-validator';
import { 
  getPhotoField,
  addPhoto,
  getPhotoById,
  getPhotosByAlbumId,
  getPhotosByCreatorId,
  updatePhoto,
  deletePhoto,
  likePhoto,
  unlikePhoto,
  addCommentToPhoto,
  removeCommentFromPhoto
} from '../controllers/controllerPhoto';
import { 
  authenticateToken,
  authorizeRoles,
  AuthenticatedRequest 
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { checkPhotoAccess, checkAlbumPhotoAccess } from '../middleware/photoauth';

const router = express.Router();

// Validation rules
const photoValidationRules = [
  body('albumId')
    .notEmpty()
    .withMessage('Album ID không được để trống')
    .isString()
    .withMessage('Album ID phải là string'),
  body('url')
    .notEmpty()
    .withMessage('URL không được để trống')
    .isURL()
    .withMessage('URL phải có định dạng hợp lệ'),
  body('caption')
    .optional()
    .isString()
    .withMessage('Caption phải là string')
    .isLength({ max: 500 })
    .withMessage('Caption không được quá 500 ký tự'),
  body('createdBy')
    .notEmpty()
    .withMessage('Created By không được để trống')
    .isString()
    .withMessage('Created By phải là string')
];

const updatePhotoValidationRules = [
  body('albumId')
    .optional()
    .isString()
    .withMessage('Album ID phải là string'),
  body('url')
    .optional()
    .isURL()
    .withMessage('URL phải có định dạng hợp lệ'),
  body('caption')
    .optional()
    .isString()
    .withMessage('Caption phải là string')
    .isLength({ max: 500 })
    .withMessage('Caption không được quá 500 ký tự'),
  body('createdBy')
    .optional()
    .isString()
    .withMessage('Created By phải là string')
];

const likeUnlikeValidationRules = [
  body('photoId')
    .notEmpty()
    .withMessage('Photo ID không được để trống')
    .isString()
    .withMessage('Photo ID phải là string'),
  body('userId')
    .notEmpty()
    .withMessage('User ID không được để trống')
    .isString()
    .withMessage('User ID phải là string')
];

const commentValidationRules = [
  body('commentId')
    .notEmpty()
    .withMessage('Comment ID không được để trống')
    .isString()
    .withMessage('Comment ID phải là string'),
  body('text')
    .notEmpty()
    .withMessage('Nội dung comment không được để trống')
    .isString()
    .withMessage('Nội dung comment phải là string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Nội dung comment phải từ 1-1000 ký tự'),
  body('userId')
    .notEmpty()
    .withMessage('User ID không được để trống')
    .isString()
    .withMessage('User ID phải là string')
];

const removeCommentValidationRules = [
  body('commentId')
    .notEmpty()
    .withMessage('Comment ID không được để trống')
    .isString()
    .withMessage('Comment ID phải là string')
];

const idValidationRule = [
  param('Id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const albumIdValidationRule = [
  param('albumId')
    .notEmpty()
    .withMessage('Album ID không được để trống')
    .isString()
    .withMessage('Album ID phải là string')
];

const creatorIdValidationRule = [
  param('creatorId')
    .notEmpty()
    .withMessage('Creator ID không được để trống')
    .isString()
    .withMessage('Creator ID phải là string')
];

const fieldValidationRule = [
  param('field')
    .isIn(['albumId', 'url', 'caption', 'createdBy', 'createdAt', 'updatedAt', 'likes', 'comments', 'numlike', 'numcom'])
    .withMessage('Field không hợp lệ')
];

function checkPhotoPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetPhotoId = req.params.Id;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể truy cập tất cả
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // Family admin và member chỉ có thể truy cập photo của gia đình mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập photo này không
    checkPhotoAccess(req,res,next);
    // Cần check xem photo có thuộc về album của family user không
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập photo này'
  });
}

function checkAlbumAccessPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetAlbumId = req.params.albumId;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể truy cập tất cả
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể xem photo của album trong family mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập albumId này không
    checkAlbumPhotoAccess(req,res,next);
    // if (!canAccessAlbum(currentUser.id, targetAlbumId)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền truy cập album này'
    //   });
    // }
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập album này'
  });
}

/*function checkCreatorAccessPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetCreatorId = req.params.creatorId;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể truy cập tất cả
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể xem photo của mình hoặc family member
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập creatorId này không
    // if (currentUser.id !== targetCreatorId && !isInSameFamily(currentUser.id, targetCreatorId)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền truy cập photo của user này'
    //   });
    // }
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập photo của user này'
  });
}*/

const wrapHandler = (handler: any): express.RequestHandler => {
  return (req, res, next) => {
    const result = handler(req, res, next);
    if (result && typeof result.then === 'function') {
      result.catch(next);
    }
  };
};

// GET /api/photos/:Id/field/:field - Lấy một field cụ thể của photo
// Chỉ admin hoặc member của family có photo mới được xem
router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkPhotoPermission),
  wrapHandler(getPhotoField)
);

// GET /api/photos/:Id - Lấy photo theo ID
// Chỉ admin hoặc member của family có photo mới được xem
router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkPhotoPermission),
  wrapHandler(getPhotoById)
);

// GET /api/photos/album/:albumId - Lấy tất cả photo trong album
// Chỉ admin hoặc member của family có album mới được xem
router.get('/album/:albumId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(albumIdValidationRule)),
  wrapHandler(checkAlbumAccessPermission),
  wrapHandler(getPhotosByAlbumId)
);

// GET /api/photos/creator/:creatorId - Lấy tất cả photo của creator
// Chỉ admin hoặc chính creator hoặc family member mới được xem
/*router.get('/creator/:creatorId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(creatorIdValidationRule)),
  wrapHandler(checkCreatorAccessPermission),
  wrapHandler(getPhotosByCreatorId)
);*/

// POST /api/photos - Tạo photo mới
// Admin, family_admin và member đều có thể tạo photo
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(photoValidationRules)),
  wrapHandler(addPhoto)
);

// PUT /api/photos/:Id - Cập nhật photo
// Chỉ admin hoặc owner của photo mới được cập nhật
router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updatePhotoValidationRules])),
  wrapHandler(checkPhotoPermission),
  wrapHandler(updatePhoto)
);

// DELETE /api/photos/:Id - Xóa photo
// Chỉ admin hoặc owner của photo mới được xóa
router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkPhotoPermission),
  wrapHandler(deletePhoto)
);

// POST /api/photos/like - Like photo
// Admin, family_admin và member đều có thể like photo
router.post('/like',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(likeUnlikeValidationRules)),
  wrapHandler(likePhoto)
);

// POST /api/photos/unlike - Unlike photo
// Admin, family_admin và member đều có thể unlike photo
router.post('/unlike',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(likeUnlikeValidationRules)),
  wrapHandler(unlikePhoto)
);

// POST /api/photos/:Id/comments - Thêm comment vào photo
// Admin, family_admin và member đều có thể comment
router.post('/:Id/comments',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest([...idValidationRule, ...commentValidationRules])),
  wrapHandler(checkPhotoPermission),
  wrapHandler(addCommentToPhoto)
);

// DELETE /api/photos/:Id/comments - Xóa comment khỏi photo
// Chỉ admin hoặc owner của comment mới được xóa
router.delete('/:Id/comments',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...removeCommentValidationRules])),
  wrapHandler(checkPhotoPermission),
  wrapHandler(removeCommentFromPhoto)
);

export default router;