import Container from 'typedi';
import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.services';
import { OrganizationService } from '../services/organization.service';
import {
  EmailInUseError,
  InvalidEmailPasswordError,
  OrganizationNotFoundError,
  UnauthorizedError,
} from '../utils/customError';
import { IAuthInfoRequest } from '../utils/definitions';
import { sendTokenResponse } from '../utils/sendTokenResponse';

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
      return next(new EmailInUseError());
    }

    const user = await userService.create(requestBody);
    sendTokenResponse(user, 201, res);
  } catch (err: any) {
    next(err);
  }
};

// @desc    Login
// @route   POST /api/user/login
// @access  Private
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return next(new InvalidEmailPasswordError());
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new InvalidEmailPasswordError());
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Users
// @route   GET /api/user/all
// @access  Private
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req as IAuthInfoRequest;

    const user = await userService.findUserById(request.user._id);
    if (!user) {
      return next(new UnauthorizedError());
    }

    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Users By Organization
// @route   GET /api/all/organizationId
// @access  Private
export const getUsersByOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizationId = req.params.organizationId;

    const users = await userService.findUsersByOrganization(organizationId);
    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
