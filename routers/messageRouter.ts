import express, { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { 
  getMessageField,
  addMessage,
  getMessageById,
  getMessagesBySenderId,
  getMessagesBySenderName,
  getMessagesByChatRoom,
  updateMessage,
  deleteMessage
} from '../controllers/controllerMesssgae';
import { 
  authenticateToken,
  authorizeRoles,
} from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { checkMessageAccess, checkMemberMessageAccess } from '../middleware/messageauth';

const router = express.Router();

// Quy tắc validation - Cập nhật theo interface Message
const messageValidationRules = [
  body('text')
    .notEmpty()
    .withMessage('Nội dung tin nhắn không được để trống')
    .isString()
    .withMessage('Nội dung tin nhắn phải là string')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Nội dung tin nhắn phải từ 1-2000 ký tự'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL phải có định dạng hợp lệ'),
  body('senderId')
    .notEmpty()
    .withMessage('Sender ID không được để trống')
    .isString()
    .withMessage('Sender ID phải là string'),
  body('senderName')
    .notEmpty()
    .withMessage('Tên người gửi không được để trống')
    .isString()
    .withMessage('Tên người gửi phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên người gửi phải từ 1-100 ký tự'),
  body('recipient')
    .notEmpty()
    .withMessage('Recipient không được để trống')
    .isString()
    .withMessage('Recipient phải là string'),
  body('chatroomId')
    .notEmpty()
    .withMessage('Chatroom ID không được để trống')
    .isString()
    .withMessage('Chatroom ID phải là string')
];

const updateMessageValidationRules = [
  body('text')
    .optional()
    .isString()
    .withMessage('Nội dung tin nhắn phải là string')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Nội dung tin nhắn phải từ 1-2000 ký tự'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL phải có định dạng hợp lệ'),
  body('senderName')
    .optional()
    .isString()
    .withMessage('Tên người gửi phải là string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên người gửi phải từ 1-100 ký tự'),
  body('recipient')
    .optional()
    .isString()
    .withMessage('Recipient phải là string'),
  body('chatroomId')
    .optional()
    .isString()
    .withMessage('Chatroom ID phải là string')
];

// Thay đổi từ 'Id' thành 'id'
const idValidationRule = [
  param('id')
    .notEmpty()
    .withMessage('ID không được để trống')
    .isString()
    .withMessage('ID phải là string')
];

const senderIdValidationRule = [
  param('senderId')
    .notEmpty()
    .withMessage('Sender ID không được để trống')
    .isString()
    .withMessage('Sender ID phải là string')
];

const senderNameValidationRule = [
  param('senderName')
    .notEmpty()
    .withMessage('Tên người gửi không được để trống')
    .isString()
    .withMessage('Tên người gửi phải là string')
];

const chatRoomIdValidationRule = [
  param('chatRoomId')
    .notEmpty()
    .withMessage('Chatroom ID không được để trống')
    .isString()
    .withMessage('Chatroom ID phải là string')
];

// Cập nhật field validation để phù hợp với interface Message
const fieldValidationRule = [
  param('field')
    .isIn(['id', 'text', 'imageUrl', 'senderId', 'senderName', 'recipient', 'chatroomId', 'createdAt', 'updatedAt'])
    .withMessage('Field không hợp lệ')
];

function checkMessagePermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  // Thay đổi từ req.params.Id thành req.params.id
  const targetMessageId = req.params.id;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể truy cập tất cả tin nhắn
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // Family admin và member chỉ có thể truy cập tin nhắn của family hoặc chatroom họ tham gia
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có quyền truy cập message này không
    // Cần check:
    // 1. Message có thuộc về chatroom mà user là member không
    // 2. Message có thuộc về family của user không
    // const message = await getMessageById(targetMessageId);
    // const chatRoom = await getChatRoomById(message.chatroomId);
    // if (!chatRoom.members.includes(currentUser.id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền truy cập tin nhắn này'
    //   });
    // }
    checkMessageAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập tin nhắn này'
  });
}

/*function checkSenderAccessPermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const targetSenderId = req.params.senderId;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể xem tin nhắn của tất cả người dùng
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể xem tin nhắn của mình hoặc family member
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // Cho phép xem tin nhắn của chính mình
    if (currentUser.id === targetSenderId) {
      return next();
    }
    
    // TODO: Thêm logic check user có cùng family với targetSenderId không
    // if (!isInSameFamily(currentUser.id, targetSenderId)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền xem tin nhắn của người dùng này'
    //   });
    // }
    checkMessageAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền xem tin nhắn của người dùng này'
  });
}*/

function checkChatRoomAccessPermission(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const targetChatRoomId = req.params.chatRoomId;
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể xem tin nhắn của tất cả chatroom
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể xem tin nhắn của chatroom mà họ là thành viên
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có phải là member của chatroom này không
    // const chatRoom = await getChatRoomById(targetChatRoomId);
    // if (!chatRoom.members.includes(currentUser.id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn không có quyền xem tin nhắn của chatroom này'
    //   });
    // }
    checkMemberMessageAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền xem tin nhắn của chatroom này'
  });
}

function checkMessageOwnership(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const currentUser = req.user;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Admin có thể cập nhật/xóa tất cả tin nhắn
  if (currentUser.role === 'admin') {
    return next();
  }
  
  // User chỉ có thể cập nhật/xóa tin nhắn của chính mình
  if (['family_admin', 'member'].includes(currentUser.role)) {
    // TODO: Thêm logic check user có phải là sender của message này không
    // const message = await getMessageById(req.params.id);
    // if (message.senderId !== currentUser.id) {
    //   // Family admin có thể xóa tin nhắn trong family
    //   if (currentUser.role === 'family_admin' && message.familyId.includes(currentUser.familyId)) {
    //     return next();
    //   }
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Bạn chỉ có thể chỉnh sửa tin nhắn của chính mình'
    //   });
    // }
    checkMessageAccess(req, res, next);
    return;
  }
  
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền thực hiện hành động này'
  });
}

function validateMessageCreation(
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response {
  const currentUser = req.user;
  const messageData = req.body;
  
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'Không có thông tin người dùng'
    });
  }
  
  // Đảm bảo senderId phải trùng với user hiện tại (trừ admin)
  if (currentUser.role !== 'admin' && messageData.senderId !== currentUser.id) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không thể tạo tin nhắn thay mặt người khác'
    });
  }
  
  // TODO: Thêm logic check user có quyền gửi tin nhắn vào chatroom này không
  // const chatRoom = await getChatRoomById(messageData.chatroomId);
  // if (!chatRoom.members.includes(currentUser.id) && currentUser.role !== 'admin') {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Bạn không thể gửi tin nhắn vào chatroom này'
  //   });
  // }
  checkMemberMessageAccess(req, res, next);
  return;
}

const wrapHandler = (handler: any): express.RequestHandler => {
  return (req, res, next) => {
    const result = handler(req, res, next);
    if (result && typeof result.then === 'function') {
      result.catch(next);
    }
  };
};

// POST /api/messages - Tạo message mới
// POST routes thường không conflict, nhưng tốt nhất đặt trước GET
// Admin, family_admin và member đều có thể tạo message
router.post('/',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin', 'member')),
  wrapHandler(validateRequest(messageValidationRules)),
  wrapHandler(validateMessageCreation),
  wrapHandler(addMessage)
);

// GET /api/messages/sender-name/:senderName - Lấy tất cả message theo tên sender
// ✅ ROUTE CỤ THỂ - có path prefix, phải đặt TRƯỚC /:id
// Chỉ admin hoặc family member mới được xem
router.get('/sender-name/:senderName',
  wrapHandler(authenticateToken),
  wrapHandler(authorizeRoles('admin', 'family_admin')),
  wrapHandler(validateRequest(senderNameValidationRule)),
  wrapHandler(getMessagesBySenderName)
);

// GET /api/messages/chatroom/:chatRoomId - Lấy tất cả message trong chatroom
// ✅ ROUTE CỤ THỂ - có path prefix, phải đặt TRƯỚC /:id
// Chỉ admin hoặc member của chatroom mới được xem
router.get('/chatroom/:chatRoomId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(chatRoomIdValidationRule)),
  wrapHandler(checkChatRoomAccessPermission),
  wrapHandler(getMessagesByChatRoom)
);

// GET /api/messages/sender/:senderId - Lấy tất cả message của sender
// ✅ ROUTE CỤ THỂ - có path prefix, phải đặt TRƯỚC /:id
// Chỉ admin hoặc chính sender hoặc family member mới được xem
/*router.get('/sender/:senderId',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(senderIdValidationRule)),
  wrapHandler(checkSenderAccessPermission),
  wrapHandler(getMessagesBySenderId)
);*/

// GET /api/messages/:id/field/:field - Lấy một field cụ thể của message
// ✅ ROUTE CỤ THỂ - có nhiều segments, phải đặt TRƯỚC /:id
// Chỉ admin hoặc user có quyền truy cập message mới được xem
router.get('/:id/field/:field',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...fieldValidationRule])),
  wrapHandler(checkMessagePermission),
  wrapHandler(getMessageField)
);

// GET /api/messages/:id - Lấy message theo ID
// ✅ ROUTE TỔNG QUÁT - phải đặt SAU tất cả routes cụ thể
// Chỉ admin hoặc user có quyền truy cập message mới được xem
router.get('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkMessagePermission),
  wrapHandler(getMessageById)
);

// PUT /api/messages/:id - Cập nhật message
// PUT/DELETE có thể đặt sau GET vì ít conflict hơn
// Chỉ admin hoặc sender của message mới được cập nhật
router.put('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest([...idValidationRule, ...updateMessageValidationRules])),
  wrapHandler(checkMessageOwnership),
  wrapHandler(updateMessage)
);

// DELETE /api/messages/:id - Xóa message
// Chỉ admin hoặc sender của message hoặc family_admin mới được xóa
router.delete('/:id',
  wrapHandler(authenticateToken),
  wrapHandler(validateRequest(idValidationRule)),
  wrapHandler(checkMessageOwnership),
  wrapHandler(deleteMessage)
);

export default router;