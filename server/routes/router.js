import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/authMiddleware.js';

import { userController } from '../controllers/user.controller.js';

export const router = new Router();

router.post('/registration', body('email').isEmail(), body('password').isLength({min: 3, max: 32}), userController.registration);
router.post('/login', body('email').isEmail(), body('password').isLength({min: 3, max: 32}), userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);