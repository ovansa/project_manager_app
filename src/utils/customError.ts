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

export class EmailInUseError extends CustomError {
  constructor() {
    super('Email address is already taken', 400);
  }
}

export class OrganizationNotFoundError extends CustomError {
  constructor() {
    super('Organization does not exist', 404);
  }
}

export class UnauthorizedError extends CustomError {
  constructor() {
    super('User is unauthorized', 401);
  }
}

export class InvalidEmailPasswordError extends CustomError {
  constructor() {
    super('Invalid email or password', 401);
  }
}

export default CustomError;
