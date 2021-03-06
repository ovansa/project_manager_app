import { UserRoles } from '../utils/constants';
import * as yup from 'yup';

export const loginUserSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email format'),
    password: yup.string().required('Password is required'),
  }),
});

export const registerUserSchema = yup.object({
  body: yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email format'),
    role: yup
      .mixed<UserRoles>()
      .oneOf(Object.values(UserRoles), `Role must be a valid user role`)
      .required('Role is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    organizationId: yup.string().required('organizationId is required'),
  }),
});

export const acceptUserInviteSchema = yup.object({
  body: yup.object({
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
  }),
  params: yup.object({
    invitetoken: yup.string().required('Invite token is required'),
  }),
});
