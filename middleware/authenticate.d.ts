import { NextFunction, Request, Response } from "express";
export declare const apiGuards: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const botInitializerGuard: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const idBotRequired: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
