export class Response {
  public code: number;
  public messge: string;
  public data: any;
  constructor(code: number, message: string, data: any) {
    this.code = code;
    this.messge = message;
    this.data = data;
  }
}
