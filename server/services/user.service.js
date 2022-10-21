import bcrypt from 'bcrypt';

import { ApiError } from '../Errors/apiError.js';
import { User } from '../models/models.js';
import { tokenService } from './token.service.js';

class UserService {
  async registration(email, password) {
    try {
      const candidate = await User.findOne({where: {email}});
      if (candidate) {
        throw ApiError.BadRequest(`Пользователь с email ${email} уже существует`);
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const newUser = await User.create({email, password: hashPassword});
      const { accessToken, refreshToken } = tokenService.generateTokens({id: newUser.id, email});
      await tokenService.saveToken(newUser.id, refreshToken);
      return {accessToken, refreshToken};
    } catch(e) {
      return ApiError.InternalServerError(e);
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({where: {email}});
      if (!user) {
        throw ApiError.BadRequest(`Пользователя с email ${email} не существует`);
      }
      const isPasswordsEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordsEqual) {
        throw ApiError.BadRequest('Неправильный пароль');
      }
      const { accessToken, refreshToken } = tokenService.generateTokens({id: user.id, email});
      await tokenService.saveToken(user.id, refreshToken);
      return {accessToken, refreshToken};
    } catch(e) {
      return ApiError.InternalServerError(e);
    }
  }

  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnAuturizate();
    }
    const userData = tokenService.validateToken(refreshToken, true);
    const refreshTokenInDataBase = await tokenService.findToken(refreshToken);
    if (!userData || !refreshTokenInDataBase) {
      throw ApiError.UnAuturizate();
    }
    const user = await User.findOne({where: {id: userData.id}});
    const tokens = tokenService.generateTokens({id: user.id, email: user.email});
    await tokenService.saveToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getUsers() {
    const users = await User.findAll();
    return users;
  }
}

export const userService = new UserService();