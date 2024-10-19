import { User } from '../entities/user.entity';

export class UserResponseDTO {
  fullName: string;
  email: string;

  constructor(args: User) {
    this.fullName = args.fullName;
    this.email = args.email;
  }
}