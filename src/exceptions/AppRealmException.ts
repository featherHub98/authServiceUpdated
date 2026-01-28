export class AppRealmException extends Error {
  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'AppRealmException';
  }
}
