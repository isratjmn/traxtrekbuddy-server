import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const requestvalidate =
    (schema: AnyZodObject) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try
            {
                await schema.parseAsync({
                    body: req.body,
                });
                return next();
            } catch (err)
            {
                next(err);
            }
        };

export default requestvalidate;
