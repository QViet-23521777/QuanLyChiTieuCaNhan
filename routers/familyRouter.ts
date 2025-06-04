import express, { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { 
  getFamilyField,
  getFamilybyId,
  getFamilyIdByMemberId,
  addFaimly,
  addMember,
  deleteUser as removeMember,
  updateFamily,
  deleteFamily 
} from '../controllers/controllerFamily';
import { 
  authenticateToken,
  authorizeRoles,
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { checkMember } from '../QuanLyTaiChinh-backend/familyService';
import { checkAccountAccess } from '../middleware/familyauth';

const router = express.Router();

// Validation rules
const familyValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Tên gia đình không được để trống')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên gia đình phải từ 2-100 ký tự'),
  body('adminId')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Phải có người chủ gia đình'),
  body('membersId')
    .optional()
    .isArray()
    .withMessage('MembersId phải là mảng'),
  body('membersId.*')
    .optional()
    .isString()
    .withMessage('Mỗi member ID phải là string'),
  body('address')
    .optional()
    .isString()
    .withMessage('Cần địa chỉ'),
];

const updateFamilyValidationRules = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên gia đình phải từ 2-100 ký tự'),
];

const addMemberValidationRules = [
  body('membersId')
    .notEmpty()
    .withMessage('Member ID không được để trống')
    .isString()
    .withMessage('Member ID phải là string')
];

const removeMemberValidationRules = [
  body('membersId')
    .notEmpty()
    .withMessage('Member ID không được để trống')
    .isString()
    .withMessage('Member ID phải là string')
];

// Thay đổi từ 'Id' thành 'id'
const idValidationRule = [
  param('id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const memberIdValidationRule = [
  param('membersId')
    .notEmpty()
    .withMessage('Member ID không được để trống')
    .isString()
    .withMessage('Member ID phải là string')
];

// Cập nhật field validation để phù hợp với interface Family
const fieldValidationRule = [
  param('field')
    .isIn(['id','name', 'adminId', 'membersId','address', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

function checkFamilyPermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  // Thay đổi từ req.params.Id thành req.params.id
  const targetFamilyId = req.params.id;
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
  // Cần check xem user có thuộc family này không (logic này cần implement trong service)
  if (['family_admin', 'member'].includes(currentUser.role)) {
    checkAccountAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập thông tin gia đình này'
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

// familyRouter.ts

console.log('🚀 Starting Family Router initialization...');

// ✅ POST ROUTES ĐƠN GIẢN - ĐẶT ĐẦU TIÊN (không conflict)
try {
  console.log('🔧 Defining POST / route...');
  router.post('/',
    (req, res, next) => {
      console.log('📝 [POST /families] - Tạo family mới');
      next();
    },
    wrapHandler(authenticateToken),
    wrapHandler(authorizeRoles('admin')),
    wrapHandler(validateRequest(familyValidationRules)),
    wrapHandler(addFaimly)
  );
  console.log('✅ POST / route defined successfully');
} catch (error) {
  console.log('❌ Error defining POST / route:', error.message);
}

// ✅ GET ROUTES CỤ THỂ NHẤT - ĐẶT TRƯỚC CÁC ROUTES TỔNG QUÁT
try {
  console.log('🔧 Defining GET /member/:membersId route...');
  router.get('/member/:membersId',
    (req, res, next) => {
      console.log(`📋 [GET /families/member/${req.params.membersId}] - Lấy family theo Member ID`);
      next();
    },
    wrapHandler(authenticateToken),
    wrapHandler(validateRequest(memberIdValidationRule)),
    wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
    wrapHandler(getFamilyIdByMemberId)
  );
  console.log('✅ GET /member/:membersId route defined successfully');
} catch (error) {
  console.log('❌ Error defining GET /member/:membersId route:', error.message);
}

// ✅ POST ROUTES PHỨC TẠP - CÓ NHIỀU SEGMENTS
try {
  console.log('🔧 Defining POST /:id/members route...');
  router.post('/:id/members',
    (req, res, next) => {
      console.log(`👥 [POST /families/${req.params.id}/members] - Thêm member vào family`);
      next();
    },
    wrapHandler(authenticateToken),
    wrapHandler(validateRequest([...idValidationRule, ...addMemberValidationRules])),
    wrapHandler(authorizeRoles('admin', 'family_admin')),
    wrapHandler(addMember)
  );
  console.log('✅ POST /:id/members route defined successfully');
} catch (error) {
  console.log('❌ Error defining POST /:id/members route:', error.message);
}

// ✅ GET ROUTES PHỨC TẠP - CÓ NHIỀU SEGMENTS
try {
  console.log('🔧 Defining GET /:id/field/:field route...');
  router.get('/:id/field/:field',
    (req, res, next) => {
      console.log(`🔍 [GET /families/${req.params.id}/field/${req.params.field}] - Lấy field cụ thể`);
      next();
    },
    wrapHandler(authenticateToken),
    wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
    wrapHandler(checkFamilyPermission),
    wrapHandler(getFamilyField)
  );
  console.log('✅ GET /:id/field/:field route defined successfully');
} catch (error) {
  console.log('❌ Error defining GET /:id/field/:field route:', error.message);
}

// ✅ DELETE ROUTES PHỨC TẠP - CÓ NHIỀU SEGMENTS
try {
  console.log('🔧 Defining DELETE /:id/members route...');
  router.delete('/:id/members',
    (req, res, next) => {
      console.log(`🗑️ [DELETE /families/${req.params.id}/members] - Xóa member khỏi family`);
      next();
    },
    wrapHandler(authenticateToken),
    wrapHandler(validateRequest([...idValidationRule, ...removeMemberValidationRules])),
    wrapHandler(authorizeRoles('admin', 'family_admin')),
    wrapHandler(removeMember)
  );
  console.log('✅ DELETE /:id/members route defined successfully');
} catch (error) {
  console.log('❌ Error defining DELETE /:id/members route:', error.message);
}

// ✅ GET ROUTES TỔNG QUÁT - ĐẶT SAU TẤT CẢ ROUTES CỤ THỂ
try {
  console.log('🔧 Defining GET /:id route...');
  router.get('/:id',
    (req, res, next) => {
      console.log(`📖 [GET /families/${req.params.id}] - Lấy family theo ID`);
      next();
    },
    wrapHandler(authenticateToken),
    wrapHandler(validateRequest(idValidationRule)),
    wrapHandler(checkFamilyPermission),
    wrapHandler(getFamilybyId)
  );
  console.log('✅ GET /:id route defined successfully');
} catch (error) {
  console.log('❌ Error defining GET /:id route:', error.message);
}

// ✅ PUT/DELETE ROUTES ĐƠN GIẢN - ĐẶT CUỐI (ít conflict)
try {
  console.log('🔧 Defining PUT /:id route...');
  router.put('/:id',
    (req, res, next) => {
      console.log(`✏️ [PUT /families/${req.params.id}] - Cập nhật family`);
      next();
    },
    wrapHandler(authenticateToken),
    wrapHandler(validateRequest([...idValidationRule, ...updateFamilyValidationRules])),
    wrapHandler(authorizeRoles('admin', 'family_admin')),
    wrapHandler(updateFamily)
  );
  console.log('✅ PUT /:id route defined successfully');
} catch (error) {
  console.log('❌ Error defining PUT /:id route:', error.message);
}

try {
  console.log('🔧 Defining DELETE /:id route...');
  router.delete('/:id',
    (req, res, next) => {
      console.log(`🗑️ [DELETE /families/${req.params.id}] - Xóa family`);
      next();
    },
    wrapHandler(authenticateToken),
    wrapHandler(authorizeRoles('admin')),
    wrapHandler(validateRequest(idValidationRule)),
    wrapHandler(deleteFamily)
  );
  console.log('✅ DELETE /:id route defined successfully');
} catch (error) {
  console.log('❌ Error defining DELETE /:id route:', error.message);
}

console.log('🎉 All family routes defined successfully');
console.log('📋 Route order summary:');
console.log('   1. POST / (tạo family) - Không conflict');
console.log('   2. GET /member/:membersId - Route cụ thể nhất');
console.log('   3. POST /:id/members - Route phức tạp');
console.log('   4. GET /:id/field/:field - Route phức tạp');
console.log('   5. DELETE /:id/members - Route phức tạp');
console.log('   6. GET /:id - Route tổng quát');
console.log('   7. PUT /:id - Route đơn giản');
console.log('   8. DELETE /:id - Route đơn giản');
export default router;