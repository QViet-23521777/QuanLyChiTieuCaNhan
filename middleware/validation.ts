import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu đầu vào không hợp lệ',
      errors: errors.array().map(error => {
        if ('path' in error) {
          return {
            field: error.path,
            message: error.msg,
            value: error.value
          };
        }
        return {
          field: (error as any).param || 'unknown',
          message: error.msg,
          value: (error as any).value
        };
      })
    });
  }
  
  next();
};

export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    handleValidationErrors(req, res, next);
  };
};