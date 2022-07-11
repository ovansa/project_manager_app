import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRoles } from '../utils/constants';
import { IOrganization } from './organization.model';

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role: UserRoles;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: IOrganization['_id'];
  matchPasswords(userPassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    verified: { type: Boolean, default: false },
    role: { type: String, enum: UserRoles, default: UserRoles.DEFAULT_USER },
    password: { type: String, required: true, select: false },
    organizationId: { type: mongoose.Types.ObjectId, ref: 'Organization' },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.getSignedJwtToken = function () {
  const secret = (process.env.JWT_SECRET as string) || 'alghashiyah';
  return jwt.sign({ id: this._id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '10d',
  });
};

userSchema.methods.matchPasswords = async function (
  userPassword: string
): Promise<boolean> {
  const user = this as IUser;

  return await bcrypt.compare(userPassword, user.password).catch((e) => false);
};

export default mongoose.model('User', userSchema);
