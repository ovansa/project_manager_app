import express, { RequestHandler } from 'express';
import requireAuth from '../middleware/authentication';
import {
  getAllUsers,
  getUsersByOrganization,
  loginUser,
  registerUser,
} from '../controllers/user.controller';
import validateResource from '../middleware/validateResource';
import { loginUserSchema, registerUserSchema } from '../schema/user.schema';

const router = express.Router();

const requireLogin = requireAuth as unknown as RequestHandler;

router.get('/all', requireLogin, getAllUsers);
router.get('/all/:organizationId', requireLogin, getUsersByOrganization);
router.post('/login', validateResource(loginUserSchema), loginUser);
router.post('/register', validateResource(registerUserSchema), registerUser);

export default router;
