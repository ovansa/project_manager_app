import express from 'express';
import { getAllUsers, registerUser } from '../controllers/user.controller';

const router = express.Router();

router.get('/all', getAllUsers);
router.post('/register', registerUser);

export default router;
