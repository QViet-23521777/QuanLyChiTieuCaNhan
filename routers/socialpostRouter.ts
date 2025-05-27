import express from 'express';
import { body, param } from 'express-validator';
import { 
  getSocialField,
  addSocialPost,
  getPostById,
  getPostsByPhotoId,
  getPostsByTransactionId,
  getPostsByFamilyId,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteCommentPost
} from '../controllers/controllerSocialPost';
import { 
  authenticateToken,
  authorizeRoles,
  AuthenticatedRequest 
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { checkPostAccess, checkPostCreatorAccess, checkFamilyPostAccess } from '../middleware/socialpostauth';

const router = express.Router();

// Quy tắc validation cho việc tạo social post
const socialPostValidationRules = [
  body('type')
    .notEmpty()
    .withMessage('Loại bài viết không được để trống')
    .isIn(['photo', 'expense', 'achievement'])
    .withMessage('Loại bài viết phải là photo, expense hoặc achievement'),
  body('content')
    .notEmpty()
    .withMessage('Nội dung bài viết không được để trống')
    .isString()
    .withMessage('Nội dung bài viết phải là string')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Nội dung bài viết phải từ 1-5000 ký tự'),
  body('photoId')
    .optional()
    .isArray()
    .withMessage('Photo ID phải là array')
    .custom((photoIds) => {
      if (!Array.isArray(photoIds)) return false;
      return photoIds.every(id => typeof id === 'string');
    })
    .withMessage('Tất cả Photo ID phải là string'),
  body('transactionId')
    .optional()
    .isArray()
    .withMessage('Transaction ID phải là array')
    .custom((transactionIds) => {
      if (!Array.isArray(transactionIds)) return false;
      return transactionIds.every(id => typeof id === 'string');
    })
    .withMessage('Tất cả Transaction ID phải là string'),
  body('createdBy')
    .notEmpty()
    .withMessage('Người tạo không được để trống')
    .isString()
    .withMessage('Người tạo phải là string'),
  body('createdByName')
    .notEmpty()
    .withMessage('Tên người tạo không được để trống')
    .isString()
    .withMessage('Tên người tạo phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên người tạo phải từ 1-100 ký tự'),
  body('familyId')
    .notEmpty()
    .withMessage('Family ID không được để trống')
    .isString()
    .withMessage('Family ID phải là string'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic phải là boolean')
];

// Quy tắc validation cho việc cập nhật social post
const updateSocialPostValidationRules = [
  body('type')
    .optional()
    .isIn(['photo', 'expense', 'achievement'])
    .withMessage('Loại bài viết phải là photo, expense hoặc achievement'),
  body('content')
    .optional()
    .isString()
    .withMessage('Nội dung bài viết phải là string')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Nội dung bài viết phải từ 1-5000 ký tự'),
  body('photoId')
    .optional()
    .isArray()
    .withMessage('Photo ID phải là array')
    .custom((photoIds) => {
      if (!Array.isArray(photoIds)) return false;
      return photoIds.every(id => typeof id === 'string');
    })
    .withMessage('Tất cả Photo ID phải là string'),
  body('transactionId')
    .optional()
    .isArray()
    .withMessage('Transaction ID phải là array')
    .custom((transactionIds) => {
      if (!Array.isArray(transactionIds)) return false;
      return transactionIds.every(id => typeof id === 'string');
    })
    .withMessage('Tất cả Transaction ID phải là string'),
  body('createdByName')
    .optional()
    .isString()
    .withMessage('Tên người tạo phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên người tạo phải từ 1-100 ký tự'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic phải là boolean')
];

// Quy tắc validation cho các tham số
const idValidationRule = [
  param('Id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const photoIdValidationRule = [
  param('photoId')
    .notEmpty()
    .withMessage('Photo ID không được để trống')
    .isString()
    .withMessage('Photo ID phải là string')
];

const transactionIdValidationRule = [
  param('transactionId')
    .notEmpty()
    .withMessage('Transaction ID không được để trống')
    .isString()
    .withMessage('Transaction ID phải là string')
];

const familyIdValidationRule = [
  param('familyId')
    .notEmpty()
    .withMessage('Family ID không được để trống')
    .isString()
    .withMessage('Family ID phải là string')
];

const fieldValidationRule = [
  param('field')
    .isIn(['type', 'content', 'photoId', 'transactionId', 'createdBy', 'createdByName', 'familyId', 'isPublic', 'createdAt', 'likes', 'commentsId', 'numlike', 'numcom', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

// Validation cho like/unlike và comment
const likeUnlikeValidationRules = [
  body('postId')
    .notEmpty()
    .withMessage('Post ID không được để trống')
    .isString()
    .withMessage('Post ID phải là string'),
  body('userId')
    .notEmpty()
    .withMessage('User ID không được để trống')
    .isString()
    .withMessage('User ID phải là string')
];

const commentValidationRules = [
  body('postId')
    .notEmpty()
    .withMessage('Post ID không được để trống')
    .isString()
    .withMessage('Post ID phải là string'),
  body('commentId')
    .notEmpty()
    .withMessage('Comment ID không được để trống')
    .isString()
    .withMessage('Comment ID phải là string')
];

// Middleware kiểm tra quyền truy cập post
function checkPostPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể truy cập tất cả post
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // Family admin và member có thể truy cập post của family
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập post này không
    // Cần check:
    // 1. Post có thuộc về family của user không
    // 2. Post có phải là public không
    // const post = await getPostById(req.params.Id);
    // if (post.familyId !== currentUser.familyId && !post.isPublic) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền truy cập bài viết này'
    //   });
    // }
    checkPostAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập bài viết này'
  });
}

// Middleware kiểm tra quyền truy cập theo family
/*function checkFamilyAccessPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetFamilyId = req.params.familyId;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể xem post của tất cả family
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể xem post của family mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có thuộc family này không
    // if (currentUser.familyId !== targetFamilyId) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền xem bài viết của family này'
    //   });
    // }
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền xem bài viết của family này'
  });
}*/

// Middleware kiểm tra quyền sở hữu post
function checkPostOwnership(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể cập nhật/xóa tất cả post
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể cập nhật/xóa post của chính mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có phải là tác giả của post này không
    // const post = await getPostById(req.params.Id);
    // if (post.createdBy !== currentUser.id) {
    //   // Family admin có thể xóa post trong family
    //   if (currentUser.role === 'family_admin' && post.familyId === currentUser.familyId) {
    //     return next();
    //   }
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn chỉ có thể chỉnh sửa bài viết của chính mình'
    //   });
    // }
    checkPostCreatorAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền thực hiện hành động này'
  });
}

// Middleware validate việc tạo post
function validatePostCreation(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const currentUser = req.user;
  const postData = req.body;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Đảm bảo createdBy phải trùng với user hiện tại (trừ admin)
  if (currentUser.role !== 'admin' && postData.createdBy !== currentUser.id) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không thể tạo bài viết thay mặt người khác'
    });
  }
  
  // TODO: Thêm logic check user có quyền post trong family này không
  // if (currentUser.role !== 'admin' && postData.familyId !== currentUser.familyId) {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Bạn không thể tạo bài viết cho family khác'
  //   });
  // }
  checkFamilyPostAccess(req, res, next);
  return;
}

// Middleware validate like/unlike action
function validateLikeAction(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const currentUser = req.user;
  const { userId } = req.body;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Đảm bảo userId phải trùng với user hiện tại (trừ admin)
  if (currentUser.role !== 'admin' && userId !== currentUser.id) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không thể like/unlike thay mặt người khác'
    });
  }
  
  next();
}

const wrapHandler = (handler: any): express.RequestHandler => {
  return (req, res, next) => {
    const result = handler(req, res, next);
    if (result && typeof result.then === 'function') {
      result.catch(next);
    }
  };
};

// ==================== ROUTES ====================

// GET /api/social-posts/:Id/field/:field - Lấy một field cụ thể của post
// Chỉ admin hoặc user có quyền truy cập post mới được xem
router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkPostPermission),
  wrapHandler(getSocialField)
);

// GET /api/social-posts/:Id - Lấy post theo ID
// Chỉ admin hoặc user có quyền truy cập post mới được xem
router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkPostPermission),
  wrapHandler(getPostById)
);

// GET /api/social-posts/photo/:photoId - Lấy tất cả post theo photo ID
// Chỉ admin hoặc family member mới được xem
router.get('/photo/:photoId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(photoIdValidationRule)),
  wrapHandler(getPostsByPhotoId)
);

// GET /api/social-posts/transaction/:transactionId - Lấy tất cả post theo transaction ID
// Chỉ admin hoặc family member mới được xem
router.get('/transaction/:transactionId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(transactionIdValidationRule)),
  wrapHandler(getPostsByTransactionId)
);

// GET /api/social-posts/family/:familyId - Lấy tất cả post của family
// Chỉ admin hoặc member của family mới được xem
/*router.get('/family/:familyId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(familyIdValidationRule)),
  wrapHandler(checkFamilyAccessPermission),
  wrapHandler(getPostsByFamilyId)
);*/

// POST /api/social-posts - Tạo post mới
// Admin, family_admin và member đều có thể tạo post
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(socialPostValidationRules)),
  wrapHandler(validatePostCreation),
  wrapHandler(addSocialPost)
);

// PUT /api/social-posts/:Id - Cập nhật post
// Chỉ admin hoặc tác giả của post mới được cập nhật
router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateSocialPostValidationRules])),
  wrapHandler(checkPostOwnership),
  wrapHandler(updatePost)
);

// DELETE /api/social-posts/:Id - Xóa post
// Chỉ admin hoặc tác giả của post hoặc family_admin mới được xóa
router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkPostOwnership),
  wrapHandler(deletePost)
);

// POST /api/social-posts/like - Like post
// Tất cả user đã đăng nhập đều có thể like
router.post('/like',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(likeUnlikeValidationRules)),
  wrapHandler(validateLikeAction),
  wrapHandler(likePost)
);

// POST /api/social-posts/unlike - Unlike post
// Tất cả user đã đăng nhập đều có thể unlike
router.post('/unlike',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(likeUnlikeValidationRules)),
  wrapHandler(validateLikeAction),
  wrapHandler(unlikePost)
);

// POST /api/social-posts/comment - Thêm comment vào post
// Tất cả user đã đăng nhập đều có thể comment
router.post('/comment',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(commentValidationRules)),
  wrapHandler(commentPost)
);

// DELETE /api/social-posts/comment - Xóa comment khỏi post
// Chỉ admin hoặc tác giả comment hoặc tác giả post mới được xóa
router.delete('/comment',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(commentValidationRules)),
  wrapHandler(deleteCommentPost)
);

export default router;