import express from 'express';
import { registerUser } from '../controllers/user_controller.js';

const router = express.Router();

// Standard Syntax.
router.route('/register').post(registerUser);

export default router;