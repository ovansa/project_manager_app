import * as yup from 'yup';

const createOrganizationSchema = yup.object({
  body: yup.object({
    name: yup.string().required('Name is required'),
    slug: yup.string().required('Slug is required'),
  }),
});

export default createOrganizationSchema;
