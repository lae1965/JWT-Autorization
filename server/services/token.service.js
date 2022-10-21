import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { Token } from '../models/models.js';

dotenv.config();

class TokenService {
  generateTokens(payload) {
    return {
      accessToken: jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {expiresIn: '15m'}),
      refreshToken: jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {expiresIn: '30d'})
    };
  }

  validateToken(token, isRefresh) {
    try {
      return jwt.verify(token, isRefresh ? process.env.SECRET_REFRESH_KEY : process.env.SECRET_ACCESS_KEY);    
    } catch(e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenDate = await Token.findOne({where: {userId}});
    if (tokenDate) {
      tokenDate.refresh = refreshToken;
      await tokenDate.save();
      return tokenDate;
    }
    const token = await Token.create({userId, refreshToken});
    return token;
  }

  async findToken(refreshToken) {
    const tokenDate = await Token.findOne({where: {refreshToken}});
    return tokenDate;
  }

  async removeToken(refreshToken) {
    const token = await this.findToken(refreshToken);
    if (token) await token.destroy();
  }
}

export const tokenService = new TokenService();
