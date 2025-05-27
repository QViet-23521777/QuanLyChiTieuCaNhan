import express from 'express';
import { body, param } from 'express-validator';
import { 
  getTransactionField,
  getTransactionById,
  getTransactionsByAccountId,
  getTransactionsByUserId,
  getTransactionsByCategory,
  getTransactionsByType,
  updateTransaction,
  deleteTransaction,
  undoTransaction
} from '../controllers/controllerTransaction';
import { 
  authenticateToken,
  authorizeRoles,
  AuthenticatedRequest 
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createTransaction } from '../QuanLyTaiChinh-backend/transactionServices';
import { checkTransactionAccess } from '../middleware/transactionauth';

const router = express.Router();

// Validation rules
const transactionValidationRules = [
  body('type')
    .notEmpty()
    .withMessage('Loại giao dịch không được để trống')
    .isIn(['income', 'expense'])
    .withMessage('Loại giao dịch phải là income hoặc expense'),
  body('amount')
    .notEmpty()
    .withMessage('Số tiền không được để trống')
    .isNumeric()
    .withMessage('Số tiền phải là số')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Số tiền phải lớn hơn 0');
      }
      return true;
    }),
  body('description')
    .optional()
    .isString()
    .withMessage('Mô tả phải là string')
    .isLength({ max: 500 })
    .withMessage('Mô tả không được quá 500 ký tự'),
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID không được để trống')
    .isString()
    .withMessage('Category ID phải là string'),
  body('accountId')
    .notEmpty()
    .withMessage('Account ID không được để trống')
    .isString()
    .withMessage('Account ID phải là string'),
  body('date')
    .notEmpty()
    .withMessage('Ngày không được để trống')
    .isISO8601()
    .withMessage('Ngày phải có định dạng ISO8601'),
  body('userId')
    .notEmpty()
    .withMessage('User ID không được để trống')
    .isString()
    .withMessage('User ID phải là string')
];

const updateTransactionValidationRules = [
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Loại giao dịch phải là income hoặc expense'),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Số tiền phải là số')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Số tiền phải lớn hơn 0');
      }
      return true;
    }),
  body('description')
    .optional()
    .isString()
    .withMessage('Mô tả phải là string')
    .isLength({ max: 500 })
    .withMessage('Mô tả không được quá 500 ký tự'),
  body('categoryId')
    .optional()
    .isString()
    .withMessage('Category ID phải là string'),
  body('accountId')
    .optional()
    .isString()
    .withMessage('Account ID phải là string'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Ngày phải có định dạng ISO8601'),
  body('userId')
    .optional()
    .isString()
    .withMessage('User ID phải là string')
];

const idValidationRule = [
  param('Id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const accountIdValidationRule = [
  param('accountId')
    .notEmpty()
    .withMessage('Account ID không được để trống')
    .isString()
    .withMessage('Account ID phải là string')
];

const userIdValidationRule = [
  param('userId')
    .notEmpty()
    .withMessage('User ID không được để trống')
    .isString()
    .withMessage('User ID phải là string')
];

const categoryIdValidationRule = [
  param('categoryId')
    .notEmpty()
    .withMessage('Category ID không được để trống')
    .isString()
    .withMessage('Category ID phải là string')
];

const typeValidationRule = [
  param('type')
    .isIn(['income', 'expense'])
    .withMessage('Type phải là income hoặc expense')
];

const fieldValidationRule = [
  param('field')
    .isIn(['type', 'amount', 'description', 'categoryId', 'accountId', 'date', 'userId', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

function checkTransactionPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetTransactionId = req.params.Id;
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
  
  // Family admin và member chỉ có thể truy cập transaction của gia đình mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập transaction này không
    checkTransactionAccess(req,res,next);
    return;
    // Cần check xem transaction có thuộc về user hoặc family của user không
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập giao dịch này'
  });
}

function checkUserPermission(
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
  
  // Admin có thể truy cập tất cả
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể xem transaction của mình hoặc family member
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập userId này không
    if (currentUser.id !== targetUserId) {
        return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập giao dịch của user này'
      });
     }
    
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập giao dịch của user này'
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

// GET /api/transactions/:Id/field/:field - Lấy một field cụ thể của transaction
// Chỉ admin hoặc owner của transaction mới được xem
router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkTransactionPermission),
  wrapHandler(getTransactionField)
);

// GET /api/transactions/:Id - Lấy transaction theo ID
// Chỉ admin hoặc owner của transaction mới được xem
router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkTransactionPermission),
  wrapHandler(getTransactionById)
);

// GET /api/transactions/account/:accountId - Lấy tất cả transaction theo Account ID
// Chỉ admin hoặc owner của account mới được xem
router.get('/account/:accountId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(accountIdValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getTransactionsByAccountId)
);

// GET /api/transactions/user/:userId - Lấy tất cả transaction theo User ID
// Chỉ admin hoặc chính user đó hoặc family member mới được xem
router.get('/user/:userId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(userIdValidationRule)),
  wrapHandler(checkUserPermission),
  wrapHandler(getTransactionsByUserId)
);

// GET /api/transactions/category/:categoryId - Lấy tất cả transaction theo Category ID
// Chỉ admin hoặc member của family có category đó mới được xem
router.get('/category/:categoryId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(categoryIdValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getTransactionsByCategory)
);

// GET /api/transactions/type/:type - Lấy tất cả transaction theo type
// Chỉ admin mới được xem tất cả, user khác chỉ xem của mình
router.get('/type/:type',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(typeValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getTransactionsByType)
);

// POST /api/transactions - Tạo transaction mới
// Admin, family_admin và member đều có thể tạo transaction
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(transactionValidationRules)),
  wrapHandler(createTransaction)
);

// PUT /api/transactions/:Id - Cập nhật transaction
// Chỉ admin hoặc owner của transaction mới được cập nhật
router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateTransactionValidationRules])),
  wrapHandler(checkTransactionPermission),
  wrapHandler(updateTransaction)
);

// DELETE /api/transactions/:Id - Xóa transaction
// Chỉ admin hoặc owner của transaction mới được xóa
router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkTransactionPermission),
  wrapHandler(deleteTransaction)
);

// POST /api/transactions/:Id/undo - Hoàn tác transaction
// Chỉ admin hoặc owner của transaction mới được hoàn tác
router.post('/:Id/undo',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkTransactionPermission),
  wrapHandler(undoTransaction)
);

export default router;