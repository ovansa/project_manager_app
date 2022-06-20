import { ErrorMetadata } from './errorMetadata';

class CustomError extends Error {
  statusCode: number;
  message: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class OrganizationNotFoundError extends CustomError {
  constructor() {
    super('Organization not found', 500);
  }
}

export default CustomError;
