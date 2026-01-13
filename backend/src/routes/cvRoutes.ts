import express from 'express';
import {
    getAllCVs,
    getCVById,
    createCV,
    updateCV,
    deleteCV,
} from '../controllers/cvController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All CV routes require authentication
router.use(authenticate);

// CV Routes
router.get('/', getAllCVs);
router.get('/:id', getCVById);
router.post('/', createCV);
router.put('/:id', updateCV);
router.delete('/:id', deleteCV);

export default router;
