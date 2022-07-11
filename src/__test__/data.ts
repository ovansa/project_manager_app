import User from '../models/user.model';
import Organization from '../models/organization.model';
import { generateOrganization, generateUser } from './mock-generator';

const createData = async () => {
  const organizationOne = generateOrganization({ name: 'Organization One' });
  const organizationTwo = generateOrganization({ name: 'Organization Two' });

  const userOne = generateUser({ organizationId: organizationOne._id });
  const userTwo = generateUser({ organizationId: organizationOne._id });
  const userThree = generateUser({ organizationId: organizationTwo._id });
  const userFour = generateUser({ organizationId: organizationTwo._id });

  return {
    organizationOne,
    organizationTwo,
    userOne,
    userTwo,
    userThree,
    userFour,
  };
};

export const createDocument = async () => {
  const {
    organizationOne,
    organizationTwo,
    userOne,
    userTwo,
    userThree,
    userFour,
  } = await createData();

  await Organization.create(organizationOne);
  await Organization.create(organizationTwo);
  await User.create(userOne);
  await User.create(userTwo);
  await User.create(userThree);
  await User.create(userFour);

  return {
    organizationOne,
    organizationTwo,
    userOne,
    userTwo,
    userThree,
    userFour,
  };
};
