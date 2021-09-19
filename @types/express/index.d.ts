export {};

declare global {
  namespace Express {
    interface Response {
      json?: any;
      setHeader?: any;
    }
  }
}
