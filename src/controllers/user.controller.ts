import Container from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.services';
import sanitizeUser from '../utils/sanitizeUser';
import { OrganizationService } from '../services/organization.service';

const userService = Container.get(UserService);
const organizationService = Container.get(OrganizationService);

// @desc    Register User
// @route   POST /api/user
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.body;
    console.log(`Org id from body: ${organizationId}`);

    const organization = await organizationService.findById({ organizationId });
    console.log(organization);
    if (!organization) {
      return res
        .status(400)
        .json({ success: false, message: 'Organization is not found' });
    }

    const user = await userService.create(req.body);
    console.log(user);
    console.log(sanitizeUser(user));
    return res.status(201).json({ success: true, user: sanitizeUser(user) });
  } catch (err: any) {
    next(err);
  }
};
