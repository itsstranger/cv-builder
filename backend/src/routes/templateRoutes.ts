import express from 'express';
import { getAllTemplates } from '../controllers/templateController';

const router = express.Router();

// Template Routes
router.get('/', getAllTemplates);

export default router;
