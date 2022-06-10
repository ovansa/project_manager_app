import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRoles } from '../utils/constants';

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role: UserRoles;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  organization: Types.ObjectId;
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    verified: { type: Boolean, default: false },
    role: { type: String, enum: UserRoles, default: UserRoles.DEFAULT_USER },
    password: { type: String, required: true, select: false },
    organization: { type: mongoose.Types.ObjectId, ref: 'Organization' },
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

userSchema.methods.matchPasswords = async function (
  userPassword: string
): Promise<boolean> {
  const user = this as IUser;

  return await bcrypt.compare(userPassword, user.password).catch((e) => false);
};

export default mongoose.model('User', userSchema);
