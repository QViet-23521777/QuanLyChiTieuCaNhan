import express from 'express';
import { body, param } from 'express-validator';
import { 
  getCategoryField,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryByFamilyId,
  getCategoryByType
} from '../controllers/controllerCategory';
import { 
  authenticateToken,
  authorizeRoles,
  AuthenticatedRequest 
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

const categoryValidationRules = [
  body('name')
  .notEmpty()
  .withMessage('Tên danh mục không được để trống')
  .isLength({ min: 2, max: 100 })
  .withMessage('Tên danh mục phải từ 2-100 ký tự'),
  body('type')
    .notEmpty()
    .withMessage('Loại danh mục không được để trống')
    .isIn(['income', 'expense'])
    .withMessage('Loại danh mục phải là income hoặc expense'),
];

const updateCategoryValidationRules = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên danh mục phải từ 2-100 ký tự'),
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Loại danh mục phải là income hoặc expense')
];

const idValidationRule = [
  param('Id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const familyIdValidationRule = [
  param('familyId')
    .notEmpty()
    .withMessage('Family ID không được để trống')
    .isString()
    .withMessage('Family ID phải là string')
];

const typeValidationRule = [
  param('type')
    .isIn(['income', 'expense'])
    .withMessage('Type phải là income hoặc expense')
];

const fieldValidationRule = [
  body('field')
    .isIn(['Id','name', 'type',  'familyId', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

function checkCategoryPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetCategoryId = req.params.Id;
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
  
  // Family admin và member chỉ có thể truy cập category của gia đình mình
  /*if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập category này không
    // Cần check xem category có thuộc về family của user không
    return next();
  }*/
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập danh mục này'
  });
}

function checkFamilyPermission(
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
  
  // Admin có thể truy cập tất cả
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // Family admin và member chỉ có thể truy cập family của mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có thuộc family này không
    // if (currentUser.familyId !== targetFamilyId) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền truy cập gia đình này'
    //   });
    // }
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập gia đình này'
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

router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkCategoryPermission),
  wrapHandler(getCategoryField)
);

router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkCategoryPermission),
  wrapHandler(getCategoryById)
);

router.get('/family/:familyId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(familyIdValidationRule)),
  wrapHandler(checkFamilyPermission),
  wrapHandler(getCategoryByFamilyId)
);

router.get('/family/:familyId/type/:type',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...familyIdValidationRule, ...typeValidationRule])),
  wrapHandler(checkFamilyPermission),
  wrapHandler(getCategoryByType)
);

router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(categoryValidationRules)),
  wrapHandler(addCategory)
);

router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateCategoryValidationRules])),
  wrapHandler(authorizeRoles('admin', 'family_admin')),
  wrapHandler(checkCategoryPermission),
  wrapHandler(updateCategory)
);

router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin')),
  wrapHandler(checkCategoryPermission),
  wrapHandler(deleteCategory)
);

export default router;