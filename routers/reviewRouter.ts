import express from 'express';
import { body, param } from 'express-validator';
import { 
  getReviewField,
  addReview,
  getReviewById,
  getReviewsByUserId,
  updateReview,
  deleteReview
} from '../controllers/controllerReview';
import { 
  authenticateToken,
  authorizeRoles,
  AuthenticatedRequest 
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { checkReviewAccess, checkReviewUserAccess } from '../middleware/reviewauth';

const router = express.Router();

// Quy tắc validation cho việc tạo review
const reviewValidationRules = [
  body('rating')
    .notEmpty()
    .withMessage('Đánh giá không được để trống')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Đánh giá phải là số từ 1 đến 5'),
  body('comment')
    .notEmpty()
    .withMessage('Bình luận không được để trống')
    .isString()
    .withMessage('Bình luận phải là string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Bình luận phải từ 1-1000 ký tự'),
  body('userId')
    .notEmpty()
    .withMessage('User ID không được để trống')
    .isString()
    .withMessage('User ID phải là string'),
  body('userName')
    .notEmpty()
    .withMessage('Tên người dùng không được để trống')
    .isString()
    .withMessage('Tên người dùng phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên người dùng phải từ 1-100 ký tự')
];

// Quy tắc validation cho việc cập nhật review
const updateReviewValidationRules = [
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Đánh giá phải là số từ 1 đến 5'),
  body('comment')
    .optional()
    .isString()
    .withMessage('Bình luận phải là string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Bình luận phải từ 1-1000 ký tự'),
  body('userName')
    .optional()
    .isString()
    .withMessage('Tên người dùng phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên người dùng phải từ 1-100 ký tự')
];

// Quy tắc validation cho các tham số
const idValidationRule = [
  param('Id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const userIdValidationRule = [
  param('userId')
    .notEmpty()
    .withMessage('User ID không được để trống')
    .isString()
    .withMessage('User ID phải là string')
];

const fieldValidationRule = [
  param('field')
    .isIn(['rating', 'comment', 'userId', 'userName', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

// Middleware kiểm tra quyền truy cập review
function checkReviewPermission(
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
  
  // Admin có thể truy cập tất cả review
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // Family admin và member có thể xem review
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập review này không
    // Có thể cần check:
    // 1. Review có thuộc về dịch vụ/sản phẩm mà user có quyền xem không
    // 2. Review có phải là public không
    // const review = await getReviewById(req.params.Id);
    // if (review.userId !== currentUser.id && !isPublicReview) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền truy cập đánh giá này'
    //   });
    // }
    checkReviewAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập đánh giá này'
  });
}

// Middleware kiểm tra quyền truy cập review theo user
/*function checkUserReviewAccessPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetUserId = req.params.userId;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể xem review của tất cả user
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User có thể xem review của chính mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    if (currentUser.id === targetUserId) {
      return next();
    }
    
    // TODO: Thêm logic check user có cùng family với targetUserId không
    // hoặc có quyền xem review của user khác không
    // if (!isInSameFamily(currentUser.id, targetUserId) && currentUser.role !== 'family_admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền xem đánh giá của người dùng này'
    //   });
    // }
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền xem đánh giá của người dùng này'
  });
}*/

// Middleware kiểm tra quyền sở hữu review
function checkReviewOwnership(
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
  
  // Admin có thể cập nhật/xóa tất cả review
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể cập nhật/xóa review của chính mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có phải là tác giả của review này không
    // const review = await getReviewById(req.params.Id);
    // if (review.userId !== currentUser.id) {
    //   // Family admin có thể xóa review không phù hợp trong family
    //   if (currentUser.role === 'family_admin') {
    //     // Cần check thêm logic xem review có vi phạm quy định không
    //     return next();
    //   }
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn chỉ có thể chỉnh sửa đánh giá của chính mình'
    //   });
    // }
    checkReviewAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền thực hiện hành động này'
  });
}

// Middleware validate việc tạo review
function validateReviewCreation(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const currentUser = req.user;
  const reviewData = req.body;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Đảm bảo userId phải trùng với user hiện tại (trừ admin)
  if (currentUser.role !== 'admin' && reviewData.userId !== currentUser.id) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không thể tạo đánh giá thay mặt người khác'
    });
  }
  
  // Validate rating range
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Đánh giá phải từ 1 đến 5 sao'
    });
  }
  
  // TODO: Thêm logic check user có quyền đánh giá dịch vụ/sản phẩm này không
  // Ví dụ: chỉ được đánh giá sau khi đã sử dụng dịch vụ
  // if (!hasUsedService(currentUser.id, serviceId)) {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Bạn chỉ có thể đánh giá sau khi đã sử dụng dịch vụ'
  //   });
  // }
  
  next();
}

// Middleware validate rating value
function validateRating(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const { rating } = req.body;
  
  if (rating !== undefined) {
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải là số từ 1 đến 5'
      });
    }
    
    // Ensure rating is a valid step (allow .5 steps: 1, 1.5, 2, 2.5, etc.)
    if ((rating * 2) % 1 !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá chỉ được phép có bước nhảy 0.5 (ví dụ: 1, 1.5, 2, 2.5, ...)'
      });
    }
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

// GET /api/reviews/:Id/field/:field - Lấy một field cụ thể của review
// Chỉ admin hoặc user có quyền truy cập review mới được xem
router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkReviewPermission),
  wrapHandler(getReviewField)
);

// GET /api/reviews/:Id - Lấy review theo ID
// Chỉ admin hoặc user có quyền truy cập review mới được xem
router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkReviewPermission),
  wrapHandler(getReviewById)
);

// GET /api/reviews/user/:userId - Lấy tất cả review của user
// Chỉ admin hoặc chính user hoặc family member mới được xem
/*router.get('/user/:userId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(userIdValidationRule)),
  wrapHandler(checkUserReviewAccessPermission),
  wrapHandler(getReviewsByUserId)
);*/

// POST /api/reviews - Tạo review mới
// Admin, family_admin và member đều có thể tạo review
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(reviewValidationRules)),
  wrapHandler(validateRating),
  wrapHandler(validateReviewCreation),
  wrapHandler(addReview)
);

// PUT /api/reviews/:Id - Cập nhật review
// Chỉ admin hoặc tác giả của review mới được cập nhật
router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateReviewValidationRules])),
  wrapHandler(validateRating),
  wrapHandler(checkReviewOwnership),
  wrapHandler(updateReview)
);

// DELETE /api/reviews/:Id - Xóa review
// Chỉ admin hoặc tác giả của review hoặc family_admin mới được xóa
router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkReviewOwnership),
  wrapHandler(deleteReview)
);

export default router;