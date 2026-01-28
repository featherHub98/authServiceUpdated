declare module 'method-override' {
  import { Request, Response, NextFunction } from 'express';
  function methodOverride(
    getter?: (req: Request, res: Response) => string | undefined,
    options?: { methods: string[] }
  ): (req: Request, res: Response, next: NextFunction) => void;
  export = methodOverride;
}
