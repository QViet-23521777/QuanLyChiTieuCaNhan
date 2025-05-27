import express from 'express';
import { body, param } from 'express-validator';
import { 
  getChatRoomField,
  addChatRoom,
  getChatRoomById,
  getChatRoomsByMemberId,
  updateChatRoom,
  deleteChatRoom,
  getAllMessages,
  addMessageToChatRoom
} from '../controllers/controllerChatroom';
import { 
  authenticateToken,
  authorizeRoles,
  AuthenticatedRequest 
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { checkChatroomAccess, checkAdminAccess } from '../middleware/chatroomauth';

const router = express.Router();

// Validation rules
const chatRoomValidationRules = [
  body('name')
    .optional()
    .isString()
    .withMessage('Tên phòng chat phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên phòng chat phải từ 1-100 ký tự'),
  body('isGroup')
    .notEmpty()
    .withMessage('IsGroup không được để trống')
    .isBoolean()
    .withMessage('IsGroup phải là boolean'),
  body('members')
    .notEmpty()
    .withMessage('Members không được để trống')
    .isArray({ min: 1 })
    .withMessage('Members phải là array và có ít nhất 1 thành viên')
    .custom((members) => {
      if (!Array.isArray(members)) return false;
      return members.every(member => typeof member === 'string');
    })
    .withMessage('Tất cả members phải là string'),
  body('createdBy')
    .notEmpty()
    .withMessage('Created By không được để trống')
    .isString()
    .withMessage('Created By phải là string')
];

const updateChatRoomValidationRules = [
  body('name')
    .optional()
    .isString()
    .withMessage('Tên phòng chat phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên phòng chat phải từ 1-100 ký tự'),
  body('isGroup')
    .optional()
    .isBoolean()
    .withMessage('IsGroup phải là boolean'),
  body('members')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Members phải là array và có ít nhất 1 thành viên'),
  body('createdBy')
    .optional()
    .isString()
    .withMessage('Created By phải là string')
];

const addMessageValidationRules = [
  body('chatRoomId')
    .notEmpty()
    .withMessage('Chat Room ID không được để trống')
    .isString()
    .withMessage('Chat Room ID phải là string'),
  body('messageId')
    .notEmpty()
    .withMessage('Message ID không được để trống')
    .isString()
    .withMessage('Message ID phải là string')
];

const idValidationRule = [
  param('Id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const memberIdValidationRule = [
  param('memberId')
    .notEmpty()
    .withMessage('Member ID không được để trống')
    .isString()
    .withMessage('Member ID phải là string')
];

const fieldValidationRule = [
  param('field')
    .isIn(['name', 'isGroup', 'members', 'messageId', 'createdBy', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

function checkChatRoomPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetChatRoomId = req.params.Id;
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
  
  // Family admin và member chỉ có thể truy cập chatroom mà họ là thành viên
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có phải là member của chatroom này không
    // Cần check xem currentUser.id có trong members array của chatroom không
    // const chatRoom = await getChatRoomById(targetChatRoomId);
    //if (!chatRoom.members.includes(currentUser.id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền truy cập chatroom này'
    //   });
    // }
    checkChatroomAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập chatroom này'
  });
}

function checkMemberAccessPermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const targetMemberId = req.params.memberId;
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
  
  // User chỉ có thể xem chatroom của mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    if (currentUser.id !== targetMemberId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chỉ có thể xem chatroom của chính mình'
      });
    }
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập'
  });
}

function checkChatRoomOwnership(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể cập nhật/xóa tất cả
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // Chỉ creator hoặc family_admin mới có thể cập nhật/xóa chatroom
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có phải là creator của chatroom này không
    // const chatRoom = await getChatRoomById(req.params.Id);
    // if (chatRoom.createdBy !== currentUser.id && currentUser.role !== 'family_admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền chỉnh sửa chatroom này'
    //   });
    // }
    checkAdminAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền thực hiện hành động này'
  });
}

function checkMessagePermission(
  req: AuthenticatedRequest, 
  res: express.Response, 
  next: express.NextFunction
): void | express.Response {
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể thêm message vào bất kỳ chatroom nào
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể thêm message vào chatroom mà họ là thành viên
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có phải là member của chatroom không
    // const { chatRoomId } = req.body;
    // const chatRoom = await getChatRoomById(chatRoomId);
    // if (!chatRoom.members.includes(currentUser.id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không thể gửi tin nhắn vào chatroom này'
    //   });
    // }
    checkChatroomAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền gửi tin nhắn'
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

// GET /api/chatrooms/:Id/field/:field - Lấy một field cụ thể của chatroom
// Chỉ admin hoặc member của chatroom mới được xem
router.get('/:Id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkChatRoomPermission),
  wrapHandler(getChatRoomField)
);

// GET /api/chatrooms/:Id - Lấy chatroom theo ID
// Chỉ admin hoặc member của chatroom mới được xem
router.get('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkChatRoomPermission),
  wrapHandler(getChatRoomById)
);

// GET /api/chatrooms/member/:memberId - Lấy tất cả chatroom của member
// Chỉ admin hoặc chính member đó mới được xem
router.get('/member/:memberId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(memberIdValidationRule)),
  wrapHandler(checkMemberAccessPermission),
  wrapHandler(getChatRoomsByMemberId)
);

// GET /api/chatrooms/:Id/messages - Lấy tất cả tin nhắn trong chatroom
// Chỉ admin hoặc member của chatroom mới được xem
router.get('/:Id/messages',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkChatRoomPermission),
  wrapHandler(getAllMessages)
);

// POST /api/chatrooms - Tạo chatroom mới
// Admin, family_admin và member đều có thể tạo chatroom
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(chatRoomValidationRules)),
  wrapHandler(addChatRoom)
);

// PUT /api/chatrooms/:Id - Cập nhật chatroom
// Chỉ admin hoặc creator của chatroom hoặc family_admin mới được cập nhật
router.put('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateChatRoomValidationRules])),
  wrapHandler(checkChatRoomOwnership),
  wrapHandler(updateChatRoom)
);

// DELETE /api/chatrooms/:Id - Xóa chatroom
// Chỉ admin hoặc creator của chatroom hoặc family_admin mới được xóa
router.delete('/:Id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkChatRoomOwnership),
  wrapHandler(deleteChatRoom)
);

// POST /api/chatrooms/message - Thêm message vào chatroom
// Admin, family_admin và member đều có thể thêm message (nếu là thành viên của chatroom)
router.post('/message',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(addMessageValidationRules)),
  wrapHandler(checkMessagePermission),
  wrapHandler(addMessageToChatRoom)
);

export default router;