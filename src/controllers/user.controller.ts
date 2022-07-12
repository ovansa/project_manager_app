import Container from 'typedi';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.services';
import { OrganizationService } from '../services/organization.service';
import {
  EmailInUseError,
  EmailNotSentError,
  InvalidEmailPasswordError,
  InvalidTokenError,
  OrganizationNotFoundError,
  UnauthorizedError,
} from '../utils/customError';
import { IAuthInfoRequest } from '../utils/definitions';
import { sendTokenResponse } from '../utils/sendTokenResponse';
import sendEmail from '../utils/sendEmail';
import asyncHandler from '../middleware/async';
import logger from '../utils/logger';
import sanitizeUser from '../utils/sanitizeUser';

const userService = Container.get(UserService);
const organizationService = Container.get(OrganizationService);

// @desc    Register User
// @route   POST /api/user
// @access  Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// @desc    Login
// @route   POST /api/user/login
// @access  Private
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// @desc    Get All Users
// @route   GET /api/user/all
// @access  Private
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const request = req as IAuthInfoRequest;

    const user = await userService.findUserById(request.user._id);
    if (!user) {
      return next(new UnauthorizedError());
    }

    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, users });
  }
);

// @desc    Get Users By Organization
// @route   GET /api/all/organizationId
// @access  Private
export const getUsersByOrganization = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId;

    const users = await userService.findUsersByOrganization(organizationId);
    return res.status(200).json({ success: true, users });
  }
);

// @desc    Invite User to Organization
// @route   POST /api/user/invite
// @access  Private
export const inviteUserToOrganizationByEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const request = req as IAuthInfoRequest;

    const { organizationId } = request.user;
    const { email } = req.body;

    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      return next(new EmailInUseError());
    }

    const requestBody = {
      ...req.body,
      organizationId,
    };

    const user = await userService.create(requestBody);
    const inviteToken = await user?.getInviteToken();

    await user?.save({ validateBeforeSave: false });

    const inviteUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/invite/${inviteToken}`;

    const message = `You have been invited to join Organization. Please make a request to: \n\n${inviteUrl}`;

    try {
      await sendEmail({
        email: user?.email,
        subject: 'User invite',
        message,
      });

      res.status(201).json({
        success: true,
        message: 'Invite is successfully sent!',
        user: sanitizeUser(user),
      });
    } catch (error) {
      logger.error(error);
      user!.inviteToken = undefined;
      user!.inviteTokenExpired = undefined;

      await user?.save({ validateBeforeSave: false });
      return next(new EmailNotSentError());
    }
  }
);

// @desc    Invite User to Organization
// @route   PUT /api/user/invite/accept
// @access  Public
export const acceptUserInvite = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const inviteToken = crypto
      .createHash('sha256')
      .update(req.params.invitetoken)
      .digest('hex');

    const criteria = { inviteToken, inviteTokenExpired: { $gt: Date.now() } };
    const user = await userService.findUserByCriteria(criteria);

    if (!user) {
      return next(new InvalidTokenError());
    }

    user.password = req.body.password;
    user.verified = true;
    user.inviteToken = undefined;
    user.inviteTokenExpired = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Invite accepted!');
  }
);

// TODO: Refactor update user in accept invite to use services instead.
