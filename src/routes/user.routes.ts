import express, { RequestHandler } from 'express';
import requireAuth from '../middleware/authentication';
import {
  acceptUserInvite,
  getAllUsers,
  getUsersByOrganization,
  inviteUserToOrganizationByEmail,
  loginUser,
  registerUser,
} from '../controllers/user.controller';
import validateResource from '../middleware/validateResource';
import {
  acceptUserInviteSchema,
  loginUserSchema,
  registerUserSchema,
} from '../schema/user.schema';

const router = express.Router();

const requireLogin = requireAuth as unknown as RequestHandler;

router.get('/all', requireLogin, getAllUsers);
router.get('/all/:organizationId', requireLogin, getUsersByOrganization);
router.post('/login', validateResource(loginUserSchema), loginUser);
router.post('/invite', requireLogin, inviteUserToOrganizationByEmail);
router.post('/register', validateResource(registerUserSchema), registerUser);
router.put(
  '/invite/accept/:invitetoken',
  validateResource(acceptUserInviteSchema),
  acceptUserInvite
);

export default router;
