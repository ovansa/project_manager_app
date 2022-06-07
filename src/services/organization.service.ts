import mongoose from 'mongoose';
import { Service } from 'typedi';

import Organization, { IOrganization } from '../models/organization.model';

interface OrganizationInput {
  name: string;
  slug: string;
}

@Service()
export class OrganizationService {
  public async create({
    values,
  }: {
    values: OrganizationInput;
  }): Promise<IOrganization | null> {
    console.log(values);
    return Organization.create({ name: values.name, slug: values.slug });
  }

  public async getOrganizations(): Promise<IOrganization[]> {
    return Organization.find();
  }

  public async findById({
    organizationId,
  }: {
    organizationId: mongoose.Types.ObjectId | string;
  }): Promise<IOrganization | null> {
    return Organization.findOne({ _id: organizationId }).lean();
  }
}
