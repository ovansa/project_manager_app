import express from 'express';
import validateResource from '../middleware/validateResource';
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
} from '../controllers/organization.controller';
import createOrganizationSchema from '../schema/organization.schema';

const router = express.Router();

router.get('/all', getOrganizations);
router.get('/:id', getOrganizationById);
router.post(
  '/create',
  validateResource(createOrganizationSchema),
  createOrganization
);

export default router;
