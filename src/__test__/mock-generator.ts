import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { IUser } from '../models/user.model';
import { IOrganization } from '../models/organization.model';
import { UserRoles } from '../utils/constants';

export const generateOrganization = (overrides?: Record<string, any>) => {
  const company = faker.company.companyName();
  const organizationData: Partial<IOrganization> = {
    _id: new mongoose.Types.ObjectId(),
    name: company,
    slug: slugify(company),
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  };

  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      organizationData[key as keyof IOrganization] = value;
    }
  });

  return organizationData;
};

export const generateUser = (overrides?: Record<string, any>) => {
  const userData: Partial<IUser> = {
    _id: new mongoose.Types.ObjectId(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `${faker.name.firstName()}@gmail.com`,
    role: UserRoles.ADMIN,
    password: 'password123',
    organizationId: new mongoose.Types.ObjectId(),
  };

  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      userData[key as keyof IUser] = value;
    }
  });

  return userData;
};
