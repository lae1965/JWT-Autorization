import { ApiError } from '../Errors/apiError.js';
import { User } from '../models/models.js';
import { tokenService } from '../services/token.service.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.autorization;
    if (!authorization) {
      return next(ApiError.UnAuthorizate());
    }
  
    const accessToken = authorization.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnAuthorizate());
    }
  
    const userData = tokenService.validateToken(accessToken, false);
    if (!userData) {
      return next(ApiError.UnAuthorizate());
    }

    const userFromDataBase = await User.findOne({where: {id: userData.id, email: userData.email}});
    if (!userFromDataBase) {
      return next(ApiError.UnAuthoizate());
    }
  
    next();
  } catch(e) {
    next(ApiError.UnAuturizate());
  }
}