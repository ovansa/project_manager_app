import mongoose from 'mongoose';

export interface IOrganization extends mongoose.Document {
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Organization', organizationSchema);
