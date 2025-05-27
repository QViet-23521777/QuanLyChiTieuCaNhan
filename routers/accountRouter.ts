import express from 'express';
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
  authorizeRoles,
  AuthenticatedRequest 
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
    .isIn(['cash', 'bank', 'credit', 'investment', 'other'])
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
  body('userIinitialBalance')
    .notEmpty()
    .withMessage(' không được để trống') 
];

const updateAccountValidationRules = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên tài khoản phải từ 2-100 ký tự'),
  body('type')
    .optional()
    .isIn(['cash', 'bank', 'credit', 'investment', 'other'])
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
  param('Id')
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
    .isIn(['name', 'type', 'balance', 'currency', 'initialBalance', 'type', 'isActive', 'userId', 'createdAt', 'updatedAt', 'familyId'])
    .withMessage('Field không hợp lệ')
];

function checkAccountPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetAccountId = req.params.Id;
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
  
  // Family admin và member chỉ có thể truy cập account của gia đình mình
  // hoặc account cá nhân của mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập account này không
    checkAccountAccess(req,res,next);
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

// GET /api/accounts/:Id/field/:field - Lấy một field cụ thể của account
// Chỉ admin hoặc owner của account mới được xem
router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkAccountPermission),
  wrapHandler(getAccountField)
);

// GET /api/accounts/:Id - Lấy account theo ID
// Chỉ admin hoặc owner của account mới được xem
router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkAccountPermission),
  wrapHandler(getAccountById)
);

// GET /api/accounts/owner/:ownerId - Lấy tất cả account theo Owner ID
// Chỉ admin hoặc chính owner đó mới được xem
router.get('/user/:userId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(userIdValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getAccountsByUserId)
);

// POST /api/accounts - Tạo account mới
// Admin, family_admin và member đều có thể tạo account (cho gia đình hoặc cá nhân)
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(accountValidationRules)),
  wrapHandler(addAccount)
);

// PUT /api/accounts/:Id - Cập nhật account
// Chỉ admin hoặc owner của account mới được cập nhật
router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateAccountValidationRules])),
  wrapHandler(checkAccountPermission),
  wrapHandler(updateAccount)
);

// DELETE /api/accounts/:Id - Xóa account
// Chỉ admin hoặc owner của account mới được xóa
router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkAccountPermission),
  wrapHandler(deleteAccount)
);

export default router;