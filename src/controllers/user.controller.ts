import Container from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.services';
import sanitizeUser from '../utils/sanitizeUser';
import { OrganizationService } from '../services/organization.service';
import CustomError, { OrganizationNotFoundError } from '../utils/customError';

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
    const { organizationId, email } = req.body;

    const organization = await organizationService.findById({ organizationId });
    if (!organization) {
      return next(new OrganizationNotFoundError());
    }

    const requestBody = {
      ...req.body,
      organizationId: organization._id,
    };

    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      return res
        .status(404)
        .json({ success: false, message: 'Email address is already taken' });
    }

    const user = await userService.create(requestBody);
    return res.status(201).json({ success: true, user: sanitizeUser(user) });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// Add custom error messages
