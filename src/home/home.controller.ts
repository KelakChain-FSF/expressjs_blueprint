import { Request, Response } from 'express';
import logger from '../config/logger.js';

export const WelcomePage = async (_req: Request, res: Response) => {
  logger.debug("Welcome to Expressjs Api")
  res.status(200).json({
    message: 'Welcome to ExpressJs Api',
  });
};
