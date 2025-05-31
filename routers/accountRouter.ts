import express, { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { 
  getAccountField,
  getAccountById,
  addAccount,
  updateAccount,
  deleteAccount, 
  getAccountsByUserId
} from '../controllers/controllerAccount';
import { 
  authenticateToken,
  authorizeRoles
  // Xóa AuthenticatedRequest vì không cần import nữa
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { checkAccountAccess } from '../middleware/familyauth';

const router = express.Router();

// Validation rules
const accountValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Tên tài khoản không được để trống')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên tài khoản phải từ 2-100 ký tự'),
  body('type')
    .notEmpty()
    .withMessage('Loại tài khoản không được để trống')
    .isIn(['cash', 'bank', 'credit', 'saving', 'others'])
    .withMessage('Loại tài khoản không hợp lệ'),
  body('balance')
    .optional()
    .isNumeric()
    .withMessage('Số dư phải là số')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Số dư không được âm');
      }
      return true;
    }),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Mã tiền tệ phải có 3 ký tự')
    .isAlpha()
    .withMessage('Mã tiền tệ chỉ chứa chữ cái'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Mô tả không được quá 500 ký tự'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Trạng thái hoạt động phải là boolean'),
  body('userId')
    .notEmpty()
    .withMessage('user ID không được để trống')
    .isString()
    .withMessage('user ID phải là string'),
  body('initialBalance')
    .optional()
    .isNumeric()
    .withMessage('Số dư ban đầu phải là số')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Số dư ban đầu không được âm');
      }
      return true;
    }), 
];

const updateAccountValidationRules = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên tài khoản phải từ 2-100 ký tự'),
  body('type')
    .optional()
    .isIn(['cash', 'bank', 'credit', 'saving', 'others'])
    .withMessage('Loại tài khoản không hợp lệ'),
  body('balance')
    .optional()
    .isNumeric()
    .withMessage('Số dư phải là số')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Số dư không được âm');
      }
      return true;
    }),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Mã tiền tệ phải có 3 ký tự')
    .isAlpha()
    .withMessage('Mã tiền tệ chỉ chứa chữ cái'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Trạng thái hoạt động phải là boolean')
];

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
    .withMessage('user ID không được để trống')
    .isString()
    .withMessage('user ID phải là string')
];

const fieldValidationRule = [
  param('field')
    .isIn(['name', 'type', 'balance', 'currency', 'initialBalance', 'userId', 'familyId', 'isActive', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

// Thay AuthenticatedRequest thành Request
function checkAccountPermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const targetAccountId = req.params.id;
  const currentUser = req.user; // req.user vẫn work vì đã được augment
  
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
  
  // Family admin và member chỉ có thể truy cập account của gia đình mình
  // hoặc account cá nhân của mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập account này không
    checkAccountAccess(req, res, next);
    // Cần check xem account có thuộc về user hoặc family của user không
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập tài khoản này'
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

// POST /api/accounts - Tạo account mới
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(accountValidationRules)),
  wrapHandler(addAccount)
);

// GET /api/accounts/user/:userId - Lấy tất cả account theo User ID
// ✅ ROUTE CỤ THỂ - phải đặt TRƯỚC /:id
router.get('/user/:userId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(userIdValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getAccountsByUserId)
);

// GET /api/accounts/:id/field/:field - Lấy một field cụ thể của account  
// ✅ ROUTE CỤ THỂ - có nhiều segments, phải đặt TRƯỚC /:id
router.get('/:id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkAccountPermission),
  wrapHandler(getAccountField)
);

// GET /api/accounts/:id - Lấy account theo ID
// ✅ ROUTE TỔNG QUÁT - phải đặt SAU tất cả routes cụ thể
router.get('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkAccountPermission),
  wrapHandler(getAccountById)
);

// PUT /api/accounts/:id - Cập nhật account
// PUT/DELETE có thể đặt sau GET vì ít conflict hơn
router.put('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateAccountValidationRules])),
  wrapHandler(checkAccountPermission),
  wrapHandler(updateAccount)
);

// DELETE /api/accounts/:id - Xóa account
router.delete('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkAccountPermission),
  wrapHandler(deleteAccount)
);

export default router;