export class AuthRealmException extends Error {
  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'AuthRealmException';
  }
}
