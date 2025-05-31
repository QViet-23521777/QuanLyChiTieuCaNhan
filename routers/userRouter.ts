import express, { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { 
  getUserField,
  getUserById,
  getUserByFamilyId,
  addUser,
  updateUser,
  deleteUser 
} from '../controllers/controllerUser';
import { 
  authenticateToken,
  authorizeRoles, 
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation rules
const userValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Tên không được để trống')
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải từ 2-50 ký tự'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('familyId')
    .optional()
    .isString()
    .withMessage('Family ID phải là string')
];

const updateUserValidationRules = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải từ 2-50 ký tự'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ')
];

const idValidationRule = [
  param('id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const fieldValidationRule = [
  param('field')
    .isIn(['name', 'email', 'phone', 'role', 'familyId', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

function checkUserPermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const targetUserId = req.params.id;
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
  
  // User chỉ có thể truy cập thông tin của chính mình
  if (currentUser.id === targetUserId) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập thông tin này'
  });
}

const wrapHandler = (handler: any): express.RequestHandler => {
  return (req, res, next) => {
    const result = handler(req, res, next);
    if (result && typeof result.then === 'function') {
      result.catch(next);
    }
  };
};


// POST /api/users - Tạo user mới
// POST routes thường không conflict, nhưng tốt nhất đặt trước GET
// Chỉ admin mới được tạo user
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin')),
  wrapHandler(validateRequest(userValidationRules)),
  wrapHandler(addUser)
);

// GET /api/users/family/:id - Lấy user theo Family ID
// ✅ ROUTE CỤ THỂ - có path prefix, phải đặt TRƯỚC /:id
// Chỉ member trong family hoặc admin mới được xem
router.get('/family/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getUserByFamilyId)
);

// GET /api/users/:id/field/:field - Lấy một field cụ thể của user
// ✅ ROUTE CỤ THỂ - có nhiều segments, phải đặt TRƯỚC /:id
// Chỉ admin hoặc chính user đó mới được xem
router.get('/:id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkUserPermission),
  wrapHandler(getUserField)
);

// GET /api/users/:id - Lấy user theo ID
// ✅ ROUTE TỔNG QUÁT - phải đặt SAU tất cả routes cụ thể
// Chỉ admin hoặc chính user đó mới được xem
router.get('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkUserPermission),
  wrapHandler(getUserById)
);

// PUT /api/users/:id - Cập nhật user
// PUT/DELETE có thể đặt sau GET vì ít conflict hơn
// Chỉ admin hoặc chính user đó mới được cập nhật
router.put('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateUserValidationRules])),
  wrapHandler(checkUserPermission),
  wrapHandler(updateUser)
);

// DELETE /api/users/:id - Xóa user
// Chỉ admin mới được xóa user
router.delete('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin')),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(deleteUser)
);

export default router;