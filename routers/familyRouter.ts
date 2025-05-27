import express from 'express';
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
  AuthenticatedRequest 
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

const idValidationRule = [
  param('Id')
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

const fieldValidationRule = [
  param('field')
    .isIn(['Id','name', 'adminId', 'membersId','address', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

function checkFamilyPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetFamilyId = req.params.Id;
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

// GET /api/families/:Id/field/:field - Lấy một field cụ thể của family
// Chỉ admin hoặc member trong family mới được xem
router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkFamilyPermission),
  wrapHandler(getFamilyField)
);

// GET /api/families/:Id - Lấy family theo ID
// Chỉ admin hoặc member trong family mới được xem
router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkFamilyPermission),
  wrapHandler(getFamilybyId)
);

// GET /api/families/member/:memberId - Lấy family theo Member ID
// Chỉ admin hoặc chính member đó mới được xem
router.get('/member/:membersId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(memberIdValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getFamilyIdByMemberId)
);

// POST /api/families - Tạo family mới
// Chỉ admin mới được tạo family
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin')),
  wrapHandler(validateRequest(familyValidationRules)),
  wrapHandler(addFaimly)
);

// POST /api/families/:Id/members - Thêm member vào family
// Chỉ admin hoặc family_admin mới được thêm member
router.post('/:Id/members',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...addMemberValidationRules])),
  wrapHandler(authorizeRoles('admin', 'family_admin')),
  wrapHandler(addMember)
);

// PUT /api/families/:Id - Cập nhật family
// Chỉ admin hoặc family_admin mới được cập nhật
router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateFamilyValidationRules])),
  wrapHandler(authorizeRoles('admin', 'family_admin')),
  wrapHandler(updateFamily)
);

// DELETE /api/families/:Id/members - Xóa member khỏi family
// Chỉ admin hoặc family_admin mới được xóa member
router.delete('/:Id/members',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...removeMemberValidationRules])),
  wrapHandler(authorizeRoles('admin', 'family_admin')),
  wrapHandler(removeMember)
);

// DELETE /api/families/:Id - Xóa family
// Chỉ admin mới được xóa family
router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin')),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(deleteFamily)
);

export default router;