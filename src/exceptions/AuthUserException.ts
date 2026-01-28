export class AuthUserException extends Error {
  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'AuthUserException';
  }
}
