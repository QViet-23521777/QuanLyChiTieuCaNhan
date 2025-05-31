import express, { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { Timestamp } from 'firebase/firestore';
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
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation rules
const albumValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Tên album không được để trống')
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
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên album phải từ 1-100 ký tự'),
  body('description')
    .optional()
    .isString()
    .withMessage('Mô tả phải là string')
    .isLength({ max: 500 })
    .withMessage('Mô tả không được quá 500 ký tự'),
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
  param('id')
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
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const targetAlbumId = req.params.id;
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
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập album này'
  });
}

function checkFamilyPermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
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
    // Cần check xem user có thuộc về targetFamilyId không
    return next();
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

// POST /api/albums - Tạo album mới
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(albumValidationRules)),
  wrapHandler(addAlbum)
);

// GET /api/albums/family/:familyId - Lấy tất cả album theo Family ID
// ✅ ROUTE CỤ THỂ - phải đặt TRƯỚC /:id
router.get('/family/:familyId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(familyIdValidationRule)),
  wrapHandler(checkFamilyPermission),
  wrapHandler(getAlbumsByFamilyId)
);

// GET /api/albums/photo/:photoId - Lấy tất cả album chứa photo này
// ✅ ROUTE CỤ THỂ - phải đặt TRƯỚC /:id
router.get('/photo/:photoId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(photoIdValidationRule)),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(getAlbumsByPhotoId)
);

// GET /api/albums/:id/field/:field - Lấy một field cụ thể của album
// ✅ ROUTE CỤ THỂ - có nhiều segments, phải đặt TRƯỚC /:id
router.get('/:id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkAlbumPermission),
  wrapHandler(getAlbumField)
);

// POST /api/albums/:id/picture - Thêm ảnh vào album
// ✅ ROUTE CỤ THỂ - có nhiều segments, phải đặt TRƯỚC /:id
router.post('/:id/picture',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...addPictureValidationRules])),
  wrapHandler(checkAlbumPermission),
  wrapHandler(addPictureToAlbum)
);

// DELETE /api/albums/:id/picture - Xóa ảnh khỏi album
// ✅ ROUTE CỤ THỂ - có nhiều segments, phải đặt TRƯỚC /:id
router.delete('/:id/picture',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...deletePictureValidationRules])),
  wrapHandler(checkAlbumPermission),
  wrapHandler(deletePhotoFromAlbum)
);

// GET /api/albums/:id - Lấy album theo ID
// ✅ ROUTE TỔNG QUÁT - phải đặt SAU tất cả routes cụ thể
router.get('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkAlbumPermission),
  wrapHandler(getAlbumById)
);

// PUT /api/albums/:id - Cập nhật album
// PUT/DELETE có thể đặt sau GET vì ít conflict hơn
router.put('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateAlbumValidationRules])),
  wrapHandler(checkAlbumPermission),
  wrapHandler(updateAlbum)
);

// DELETE /api/albums/:id - Xóa album
router.delete('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkAlbumPermission),
  wrapHandler(deleteAlbum)
);

export default router;