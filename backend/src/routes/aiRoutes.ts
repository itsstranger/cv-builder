import express from 'express';
import { generateCareerPath } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/career-path', generateCareerPath);

export default router;
