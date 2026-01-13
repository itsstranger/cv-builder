import express from 'express';
import { downloadPDF } from '../controllers/pdfController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Protected route
router.use(authenticate);

router.get('/:id', downloadPDF);

export default router;
