import Container from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';
import { OrganizationNotFoundError } from '../utils/customError';

const organizationService = Container.get(OrganizationService);

export const createOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const values = req.body;
    const organization = await organizationService.create({ values });

    return res.status(201).json({ success: true, organization });
  } catch (error) {
    next(error);
  }
};

export const getOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizations = await organizationService.getOrganizations();

    return res.status(200).json({ success: true, organizations });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizationId = req.params.id;
    const organization = await organizationService.findById({ organizationId });

    if (!organization) {
      return next(new OrganizationNotFoundError());
    }

    return res.status(200).json({ success: true, organization });
  } catch (error) {
    next(error);
  }
};
