import { validationResult } from 'express-validator';

import { ApiError } from '../Errors/apiError.js';
import { userService } from '../services/user.service.js';

class UserController {
  async registration(req, res, next) {
    try {
      const validatuonErrors = validationResult(req);
      if (!validatuonErrors.isEmpty()) {
        return next (ApiError.BadRequest(`Ошибка при валидации полей в запросе: ${validatuonErrors.array()}`))
      }
      const { email, password } = req.body;
      const tokens = await userService.registration(email, password);
      res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
      return res.json(tokens);
    } catch(e) {
      next(e);
    }
  };
  async login(req, res, next) {
    try {
      const validatuonErrors = validationResult(req);
      if (!validatuonErrors.isEmpty()) {
        return next (ApiError.BadRequest(`Ошибка при валидации полей в запросе: ${validatuonErrors.array()}`))
      }
      const { email, password } = req.body;
      const tokens = await userService.login(email, password);
      return res.json(tokens);
    } catch(e) {
      next(e);
    }
  };
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json('Logout is success');
    } catch(e) {
      next(e);
    }
  };
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const tokens = await userService.refresh(refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
      return res.json(tokens);
    } catch(e) {
      next(e);
    }
  };
  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      return res.json(users);
    } catch(e) {
      next(e);
    }
  };
};

export const userController = new UserController();