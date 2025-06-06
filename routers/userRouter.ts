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

console.log('🔧 Starting to define user routes...');

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
  
  if (currentUser.role === 'admin') {
    return next();
  }
  
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

console.log('📋 Validation rules and helpers defined');

// DEFINE ROUTES WITH DETAILED LOGGING
try {
  console.log('🔧 Defining POST / route...');
  router.post('/',
    wrapHandler(authenticateToken),
    wrapHandler(authorizeRoles('admin')),
    wrapHandler(validateRequest(userValidationRules)),
    wrapHandler(addUser)
  );
  console.log('✅ POST / route defined successfully');
} catch (error) {
  console.log('❌ Error defining POST / route:', error.message);
}

try {
  console.log('🔧 Defining GET /family/:id route...');
  router.get('/family/:id',
    wrapHandler(authenticateToken), 
    wrapHandler(validateRequest(idValidationRule)),
    wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
    wrapHandler(getUserByFamilyId)
  );
  console.log('✅ GET /family/:id route defined successfully');
} catch (error) {
  console.log('❌ Error defining GET /family/:id route:', error.message);
}

try {
  console.log('🔧 Defining GET /:id/field/:field route...');
  router.get('/:id/field/:field',
    wrapHandler(authenticateToken),
    wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
    wrapHandler(checkUserPermission),
    wrapHandler(getUserField)
  );
  console.log('✅ GET /:id/field/:field route defined successfully');
} catch (error) {
  console.log('❌ Error defining GET /:id/field/:field route:', error.message);
}

try {
  console.log('🔧 Defining GET /:id route...');
  router.get('/:id',
    wrapHandler(authenticateToken), 
    wrapHandler(validateRequest(idValidationRule)),
    wrapHandler(checkUserPermission),
    wrapHandler(getUserById)
  );
  console.log('✅ GET /:id route defined successfully');
} catch (error) {
  console.log('❌ Error defining GET /:id route:', error.message);
}

try {
  console.log('🔧 Defining PUT /:id route...');
  router.put('/:id',
    wrapHandler(authenticateToken),
    wrapHandler(validateRequest([...idValidationRule, ...updateUserValidationRules])),
    wrapHandler(checkUserPermission),
    wrapHandler(updateUser)
  );
  console.log('✅ PUT /:id route defined successfully');
} catch (error) {
  console.log('❌ Error defining PUT /:id route:', error.message);
}

try {
  console.log('🔧 Defining DELETE /:id route...');
  router.delete('/:id',
    wrapHandler(authenticateToken),
    wrapHandler(authorizeRoles('admin')),
    wrapHandler(validateRequest(idValidationRule)),
    wrapHandler(deleteUser)
  );
  console.log('✅ DELETE /:id route defined successfully');
} catch (error) {
  console.log('❌ Error defining DELETE /:id route:', error.message);
}

console.log('🎉 All user routes defined successfully');

export default router;