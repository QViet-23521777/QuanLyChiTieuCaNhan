import express from 'express';
import { body, param } from 'express-validator';
import { 
  getAlbumField,
  addAlbum,
  getAlbumById,
  updateAlbum,
  addPictureToAlbum,
  getAlbumsByFamilyId,
  getAlbumsByPhotoId,
  deletePhotoFromAlbum,
  deleteAlbum
} from '../controllers/controllerAlbum';
import { 
  authenticateToken,
  authorizeRoles,
  AuthenticatedRequest 
} from '../middleware/auth';
import { User } from 'firebase/auth';
import { getUserById } from '../controllers/controllerUser';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation rules
const albumValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Tên album không được để trống')
    .isString()
    .withMessage('Tên album phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên album phải từ 1-100 ký tự'),
  body('description')
    .optional()
    .isString()
    .withMessage('Mô tả phải là string')
    .isLength({ max: 500 })
    .withMessage('Mô tả không được quá 500 ký tự'),
  body('familyId')
    .notEmpty()
    .withMessage('Family ID không được để trống')
    .isString()
    .withMessage('Family ID phải là string'),
  body('createdBy')
    .notEmpty()
    .withMessage('Created By không được để trống')
    .isString()
    .withMessage('Created By phải là string'),
  body('picturesId')
    .optional()
    .isArray()
    .withMessage('Pictures ID phải là array')
    .custom((value) => {
      if (value && value.some((id: any) => typeof id !== 'string')) {
        throw new Error('Tất cả Pictures ID phải là string');
      }
      return true;
    })
];

const updateAlbumValidationRules = [
  body('name')
    .optional()
    .isString()
    .withMessage('Tên album phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên album phải từ 1-100 ký tự'),
  body('description')
    .optional()
    .isString()
    .withMessage('Mô tả phải là string')
    .isLength({ max: 500 })
    .withMessage('Mô tả không được quá 500 ký tự'),
  body('familyId')
    .optional()
    .isString()
    .withMessage('Family ID phải là string'),
  body('createdBy')
    .optional()
    .isString()
    .withMessage('Created By phải là string'),
  body('picturesId')
    .optional()
    .isArray()
    .withMessage('Pictures ID phải là array')
    .custom((value) => {
      if (value && value.some((id: any) => typeof id !== 'string')) {
        throw new Error('Tất cả Pictures ID phải là string');
      }
      return true;
    })
];

const addPictureValidationRules = [
  body('photoId')
    .notEmpty()
    .withMessage('Photo ID không được để trống')
    .isString()
    .withMessage('Photo ID phải là string')
];

const deletePictureValidationRules = [
  body('photoId')
    .notEmpty()
    .withMessage('Photo ID không được để trống')
    .isString()
    .withMessage('Photo ID phải là string')
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

const photoIdValidationRule = [
  param('photoId')
    .notEmpty()
    .withMessage('Photo ID không được để trống')
    .isString()
    .withMessage('Photo ID phải là string')
];

const fieldValidationRule = [
  param('field')
    .isIn(['name', 'description', 'familyId', 'picturesId', 'createdBy', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

function checkAlbumPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetAlbumId = req.params.Id;
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
  
  // Family admin và member chỉ có thể truy cập album của gia đình mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập album này không
    // Cần check xem album có thuộc về family của user không
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập album này'
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
  
  // Family admin và member chỉ có thể xem album của gia đình mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có thuộc family này không
    checkAlbumPermission(req,res,next);
    return ;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập album của gia đình này'
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

// GET /api/albums/:Id/field/:field - Lấy một field cụ thể của album
// Chỉ admin hoặc member của family mới được xem
router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkAlbumPermission),
  wrapHandler(getAlbumField)
);

// GET /api/albums/:Id - Lấy album theo ID
// Chỉ admin hoặc member của family mới được xem
router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkAlbumPermission),
  wrapHandler(getAlbumById)
);

// GET /api/albums/family/:familyId - Lấy tất cả album theo Family ID
// Chỉ admin hoặc member của family mới được xem
router.get('/family/:familyId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(familyIdValidationRule)),
  wrapHandler(checkFamilyPermission),
  wrapHandler(getAlbumsByFamilyId)
);

// GET /api/albums/photo/:photoId - Lấy tất cả album chứa photo này
// Chỉ admin hoặc member của family có quyền truy cập các album chứa photo
router.get('/photo/:photoId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(photoIdValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getAlbumsByPhotoId)
);

// POST /api/albums - Tạo album mới
// Admin, family_admin và member đều có thể tạo album
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(albumValidationRules)),
  wrapHandler(addAlbum)
);

// PUT /api/albums/:Id - Cập nhật album
// Chỉ admin hoặc member của family mới được cập nhật
router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateAlbumValidationRules])),
  wrapHandler(checkAlbumPermission),
  wrapHandler(updateAlbum)
);

// POST /api/albums/:Id/picture - Thêm ảnh vào album
// Chỉ admin hoặc member của family mới được thêm ảnh
router.post('/:Id/picture',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...addPictureValidationRules])),
  wrapHandler(checkAlbumPermission),
  wrapHandler(addPictureToAlbum)
);

// DELETE /api/albums/:Id/picture - Xóa ảnh khỏi album
// Chỉ admin hoặc member của family mới được xóa ảnh
router.delete('/:Id/picture',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...deletePictureValidationRules])),
  wrapHandler(checkAlbumPermission),
  wrapHandler(deletePhotoFromAlbum)
);

// DELETE /api/albums/:Id - Xóa album
// Chỉ admin hoặc member của family mới được xóa
router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkAlbumPermission),
  wrapHandler(deleteAlbum)
);

export default router;