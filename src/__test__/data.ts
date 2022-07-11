import User from '../models/user.model';
import Organization from '../models/organization.model';
import { generateOrganization, generateUser } from './mock-generator';

const createData = async () => {
  const organizationOne = generateOrganization({ name: 'Organization One' });
  const organizationTwo = generateOrganization({ name: 'Organization Two' });

  const userOne = generateUser({ organizationId: organizationOne._id });

  return {
    organizationOne,
    organizationTwo,
    userOne,
  };
};

export const createDocument = async () => {
  const { organizationOne, organizationTwo, userOne } = await createData();

  await Organization.create(organizationOne);
  await Organization.create(organizationTwo);
  await User.create(userOne);

  return { organizationOne, organizationTwo, userOne };
};
