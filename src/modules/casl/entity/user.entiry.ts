export class User {
  id: number;
  isAdmin: boolean;

  constructor(use: User) {
    Object.assign(this, use);
  }
}
