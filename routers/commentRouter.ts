import express, { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { 
  getCommentField,
  addComment,
  getCommentById,
  getCommentsByUserId,
  getCommentsByUserName,
  updateComment,
  deleteComment
} from '../controllers/controllerComment';
import { 
  authenticateToken,
  authorizeRoles,
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { checkCommentAccess } from '../middleware/commentauth';

const router = express.Router();

// Quy tắc validation cho việc tạo comment
const commentValidationRules = [
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
    .withMessage('User ID phải là string'),
  body('userName')
    .notEmpty()
    .withMessage('Tên người dùng không được để trống')
    .isString()
    .withMessage('Tên người dùng phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên người dùng phải từ 1-100 ký tự')
];

// Quy tắc validation cho việc cập nhật comment
const updateCommentValidationRules = [
  body('text')
    .optional()
    .isString()
    .withMessage('Nội dung comment phải là string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Nội dung comment phải từ 1-1000 ký tự'),
  body('userName')
    .optional()
    .isString()
    .withMessage('Tên người dùng phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên người dùng phải từ 1-100 ký tự')
];

// Quy tắc validation cho các tham số
const idValidationRule = [
  param('id')
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

const userNameValidationRule = [
  param('userName')
    .notEmpty()
    .withMessage('Username không được để trống')
    .isString()
    .withMessage('Username phải là string')
];

const fieldValidationRule = [
  param('field')
    .isIn(['Id', 'text', 'userId', 'userName', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

// Middleware kiểm tra quyền truy cập comment
function checkCommentPermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể truy cập tất cả comment
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // Family admin và member có thể truy cập comment
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập comment này không
    // Cần check:
    // 1. Comment có thuộc về post mà user có quyền truy cập không
    // 2. User có trong cùng family với tác giả comment không
    // const comment = await getCommentById(req.params.id);
    // const post = await getPostById(comment.postId);
    // if (post.familyId !== currentUser.familyId && !post.isPublic) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền truy cập comment này'
    //   });
    // }
    checkCommentAccess(req, res,next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập comment này'
  });
}

// Middleware kiểm tra quyền truy cập theo user
/*function checkUserAccessPermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const targetUserId = req.params.userId;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể xem comment của tất cả user
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể xem comment của chính mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    if (currentUser.id !== targetUserId) {
      // TODO: Thêm logic check user có trong cùng family không
      // const targetUser = await getUserById(targetUserId);
      // if (targetUser.familyId !== currentUser.familyId) {
      //   return res.status(403).json({
      //     success: false,
      //     message: 'Bạn không có quyền xem comment của user này'
      //   });
      // }
    }
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền xem comment của user này'
  });
}*/

// Middleware kiểm tra quyền sở hữu comment
function checkCommentOwnership(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể cập nhật/xóa tất cả comment
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể cập nhật/xóa comment của chính mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có phải là tác giả của comment này không
    // const comment = await getCommentById(req.params.id);
    // if (comment.userId !== currentUser.id) {
    //   // Family admin có thể xóa comment trong family
    //   if (currentUser.role === 'family_admin') {
    //     const post = await getPostById(comment.postId);
    //     if (post.familyId === currentUser.familyId) {
    //       return next();
    //     }
    //   }
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn chỉ có thể chỉnh sửa comment của chính mình'
    //   });
    // }
    checkCommentAccess(req, res,next);
    return;  
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền thực hiện hành động này'
  });
}

// Middleware validate việc tạo comment
function validateCommentCreation(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const currentUser = req.user;
  const commentData = req.body;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Đảm bảo userId phải trùng với user hiện tại (trừ admin)
  if (currentUser.role !== 'admin' && commentData.userId !== currentUser.id) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không thể tạo comment thay mặt người khác'
    });
  }
  
  // TODO: Thêm logic check user có quyền comment trong post này không
  // const post = await getPostById(commentData.postId);
  // if (currentUser.role !== 'admin' && post.familyId !== currentUser.familyId && !post.isPublic) {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Bạn không thể comment trong post này'
  //   });
  // }
  
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

// POST /api/comments - Tạo comment mới
// POST routes thường không conflict, nhưng tốt nhất đặt trước GET
// Admin, family_admin và member đều có thể tạo comment
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(commentValidationRules)),
  wrapHandler(validateCommentCreation),
  wrapHandler(addComment)
);

// GET /api/comments/username/:userName - Lấy tất cả comment theo username
// ✅ ROUTE CỤ THỂ - có path prefix, phải đặt TRƯỚC /:id
// Chỉ admin hoặc user có quyền mới được xem
router.get('/username/:userName',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(userNameValidationRule)),
  wrapHandler(getCommentsByUserName)
);

// GET /api/comments/user/:userId - Lấy tất cả comment của user
// ✅ ROUTE CỤ THỂ - có path prefix, phải đặt TRƯỚC /:id
// Chỉ admin hoặc chính user đó hoặc user cùng family mới được xem
/*router.get('/user/:userId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(userIdValidationRule)),
  wrapHandler(checkUserAccessPermission),
  wrapHandler(getCommentsByUserId)
);*/

// GET /api/comments/:id/field/:field - Lấy một field cụ thể của comment
// ✅ ROUTE CỤ THỂ - có nhiều segments, phải đặt TRƯỚC /:id
// Chỉ admin hoặc user có quyền truy cập comment mới được xem
router.get('/:id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkCommentPermission),
  wrapHandler(getCommentField)
);

// GET /api/comments/:id - Lấy comment theo ID
// ✅ ROUTE TỔNG QUÁT - phải đặt SAU tất cả routes cụ thể
// Chỉ admin hoặc user có quyền truy cập comment mới được xem
router.get('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkCommentPermission),
  wrapHandler(getCommentById)
);

// PUT /api/comments/:id - Cập nhật comment
// PUT/DELETE có thể đặt sau GET vì ít conflict hơn
// Chỉ admin hoặc tác giả của comment mới được cập nhật
router.put('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateCommentValidationRules])),
  wrapHandler(checkCommentOwnership),
  wrapHandler(updateComment)
);

// DELETE /api/comments/:id - Xóa comment
// Chỉ admin hoặc tác giả của comment hoặc family_admin mới được xóa
router.delete('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkCommentOwnership),
  wrapHandler(deleteComment)
);

export default router;