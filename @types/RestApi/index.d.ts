export {};

declare global {
  namespace RestApi {
    interface ResInterface {
      status: number;
      msg: string | undefined;
      data: any | undefined;
    }
  }
}
