import { randomUUID } from 'node:crypto';

export interface UserProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _firstName: string,
    private readonly _lastName: string,
    private readonly _email: string,
    private readonly _passwordHash: string,
  ) {}

  static create(props: UserProps): User {
    return new User(
      props.id ?? randomUUID(),
      props.firstName,
      props.lastName,
      props.email,
      props.passwordHash,
    );
  }

  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }
}
