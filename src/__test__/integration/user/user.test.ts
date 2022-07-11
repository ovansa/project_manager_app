import request from 'supertest';
import { server } from '../../../../server';
import { connectToDB, disconnectDB } from '../../../../config/db';
import { createDocument } from '../../data';
import { clearDatabase, loginUser } from '../../helpers';
import { UserRoles } from '../../../utils/constants';
import mongoose from 'mongoose';
import User, { IUser } from '../../../models/user.model';

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectDB();
  await server.close();
});

var token: string;

// beforeAll(async () => {
//   const { userOne } = await createDocument();
//   const body = {
//     email: userOne.email,
//     password: userOne.password,
//   };
//   request(server)
//     .post('/api/user/login')
//     .send(body)
//     .end((err, res) => {
//       if (err) throw err;
//       token = res.body.token;
//     });
// });

describe('Register User', () => {
  it('should return valid response on register user with valid input as an admin role', async () => {
    const { organizationOne } = await createDocument();
    const body = {
      firstName: 'Khalid',
      lastName: 'Mahmoud',
      email: 'khalil@gmail.com',
      role: UserRoles.ADMIN,
      password: 'password123',
      organizationId: organizationOne._id,
    };

    const res = await request(server)
      .post('/api/user/register')
      .send(body)
      .set('Accept', 'application/json');

    const { firstName, email, role, organizationId, verified } = res.body.user;

    expect(res.status).toBe(201);
    expect(firstName).toBe(body.firstName);
    expect(email).toBe(body.email);
    expect(role).toBe(body.role);
    expect(organizationId).toBe(body.organizationId.toString());
    expect(verified).toBeFalsy();
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should return valid response on register user with valid input as a project manager role', async () => {
    const { organizationOne } = await createDocument();
    const body = {
      firstName: 'Khalid',
      lastName: 'Mahmoud',
      email: 'khalil@gmail.com',
      role: UserRoles.PROJECT_MANAGER,
      password: 'password123',
      organizationId: organizationOne._id,
    };

    const res = await await request(server)
      .post('/api/user/register')
      .send(body)
      .set('Accept', 'application/json');

    const { firstName, email, role, organizationId } = res.body.user;

    expect(res.status).toBe(201);
    expect(firstName).toBe(body.firstName);
    expect(email).toBe(body.email);
    expect(role).toBe(body.role);
    expect(organizationId).toBe(body.organizationId.toString());
  });

  it('should return valid error on register user with an invalid user role', async () => {
    const { organizationOne } = await createDocument();
    const body = {
      firstName: 'Khalid',
      lastName: 'Mahmoud',
      email: 'khalil@gmail.com',
      role: 'stakeholder',
      password: 'password123',
      organizationId: organizationOne._id,
    };

    const res = await await request(server)
      .post('/api/user/register')
      .send(body)
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Role must be a valid user role');
    expect(res.body.success).toBeFalsy();
  });

  it('should return valid error on register user with an email that exists', async () => {
    const { organizationOne, userOne } = await createDocument();
    const body = {
      firstName: 'Khalid',
      lastName: 'Mahmoud',
      email: userOne.email,
      role: UserRoles.ADMIN,
      password: 'password123',
      organizationId: organizationOne._id,
    };

    const res = await await request(server)
      .post('/api/user/register')
      .send(body)
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email address is already taken');
    expect(res.body.success).toBeFalsy();
  });

  it('should return valid error on register user with an organization that does not exist', async () => {
    const body = {
      firstName: 'Khalid',
      lastName: 'Mahmoud',
      email: 'khalil@gmail.com',
      role: UserRoles.ADMIN,
      password: 'password123',
      organizationId: new mongoose.Types.ObjectId(),
    };

    const res = await await request(server)
      .post('/api/user/register')
      .send(body)
      .set('Accept', 'application/json');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Organization does not exist');
    expect(res.body.success).toBeFalsy();
  });
});

describe('Login User', () => {
  it('should return valid response on login with an existing email and a valid password', async () => {
    const { userOne } = await createDocument();
    const body = {
      email: userOne.email,
      password: userOne.password,
    };

    const res = await await request(server)
      .post('/api/user/login')
      .send(body)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.token).not.toBeUndefined();
    expect(userOne.email).toBe(res.body.user.email);
  });

  it('should not return user password on a successful login', async () => {
    const { userOne } = await createDocument();
    const body = {
      email: userOne.email,
      password: userOne.password,
    };

    const res = await await request(server)
      .post('/api/user/login')
      .send(body)
      .set('Accept', 'application/json');

    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should return valid error response on login with an email that does not exist', async () => {
    const body = {
      email: 'not.exist@gmail.com',
      password: 'password',
    };

    const res = await await request(server)
      .post('/api/user/login')
      .send(body)
      .set('Accept', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
    expect(res.body.success).toBeFalsy();
  });
});

describe('Gat All Users', () => {
  it('should return all users in the system', async () => {
    const { userOne } = await createDocument();
    const token = await loginUser(userOne as IUser, server);
    console.log(token);

    const res = await request(server)
      .get('/api/user/all')
      .set('Authorization', `Bearer ${token}`);

    const users = await User.find();
    console.log(users);

    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBe(4);
  });
});
