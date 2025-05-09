import { Request, Response } from 'express';
import { pino, Logger, LoggerOptions } from 'pino';
import { Context } from 'aws-lambda';

const isDev = process.env.NODE_ENV !== 'production';

abstract class BasePinoLogger {
  protected logger: Logger;
  protected context: Record<string, unknown> = {};

  constructor(options: LoggerOptions = {}) {
    const baseOptions: LoggerOptions = {
      level: isDev ? 'debug' : 'info',
      timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
      messageKey: 'message',
      formatters: {
        level: (label: string) => ({ level: label }),
        bindings(bindings) {
          return { pid: bindings.pid, hostname: bindings.hostname };
        },
      },
      base: null, // Disable default pino bindings
      serializers: {
        err: pino.stdSerializers.err,
        error: pino.stdSerializers.err,
      },
      transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
              levelFirst: true,
              colorize: true, // Enable colors
              // ignore: 'pid,hostname,context', // Clean up output
              messageFormat: '{msg}',
              singleLine: false, // Better for development
              colorizeObjects: true, // Colorize objects too
              translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'",
              ignore: 'pid,hostname',
            },
          }
        : undefined,
      ...options,
    };

    this.logger = pino(baseOptions);
  }

  setContext(context: Record<string, unknown>): void {
    this.context = { ...this.context, ...context };
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error({ ...this.getLogObject(meta) }, message);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn({ ...this.getLogObject(meta) }, message);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info({ ...this.getLogObject(meta) }, message);
  }

  log(message: string, meta?: Record<string, unknown>): void {
    this.logger.info({ ...this.getLogObject(meta) }, message);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug({ ...this.getLogObject(meta) }, message);
  }

  time<T>(name: string, fn: () => Promise<T>, meta?: Record<string, unknown>): Promise<T> {
    const start = Date.now();
    return fn().finally(() => {
      this.info(`Timing ${name}`, {
        ...meta,
        duration_ms: Date.now() - start,
      });
    });
  }

  get pinoInstance() {
    return this.logger;
  }

  private getLogObject(meta?: Record<string, unknown>) {
    return {
      context: this.sanitizeContext({
        ...this.context,
        ...meta,
      }),
    };
  }

  protected sanitizeContext(context: Record<string, unknown>) {
    // Remove sensitive data
    const sensitiveFields = ['password', 'creditCard', 'token', 'authorization'];
    const sanitized = { ...context };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '*****';
      }
    });

    return sanitized;
  }
}

class BackendLogger extends BasePinoLogger {
  constructor(options: LoggerOptions = {}) {
    // Define serializers as standalone functions first
    const serializers = {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
      req: (req: Request) => BackendLogger.serializeRequest(req),
      res: (res: Response) => BackendLogger.serializeResponse(res),
    };

    super({
      ...options,
      serializers,
    });
  }

  private static serializeRequest(req: Request) {
    return {
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        referer: req.headers['referer'],
        host: req.headers['host'],
      },
      remoteAddress: req.ip,
    };
  }

  private static serializeResponse(res: Response) {
    const headers = res.getHeaders();
    return {
      statusCode: res.statusCode,
      headers: {
        'content-type': headers['content-type'],
        'content-length': headers['content-length'],
      },
    };
  }
}
export class LambdaLogger extends BasePinoLogger {
  constructor(lambdaContext: Context, options: LoggerOptions = {}) {
    super({
      ...options,
      base: null, // Disable default pino bindings
      messageKey: 'message',
      timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
      formatters: {
        level: (label) => ({ level: label }),
        bindings: () => ({}),
      },
    });

    this.setContext({
      aws: {
        request_id: lambdaContext?.awsRequestId || null,
        function_name: lambdaContext?.functionName,
        function_version: lambdaContext?.functionVersion,
        invoked_function_arn: lambdaContext?.invokedFunctionArn || null,
        memory_limit: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
        region: process.env.AWS_REGION,
      },
      cold_start: this.isColdStart(),
    });
  }

  get pinoInstance() {
    return this.logger;
  }

  private isColdStart(): boolean {
    if (process.env.IS_COLD_START === 'true') {
      process.env.IS_COLD_START = 'false';
      return true;
    }
    return false;
  }
  async flush(): Promise<void> {
    // Ensure logs are written before Lambda execution ends
    if (!this.logger.flush) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.logger.flush((err?: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const logger = new BackendLogger();
export const PinoLogger = logger.pinoInstance;

// const logger = pino({
//   level: isDev ? 'debug' : 'info',
//   transport: isDev
//     ? {
//         target: 'pino-pretty',
//         options: {
//           colorize: true,
//           translateTime: 'yyyy-mm-dd HH:MM:ss',
//           ignore: 'pid,hostname',
//           levelFirst: true,
//         },
//       }
//     : undefined,
// });
export default logger;
