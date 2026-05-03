import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";

type Schema = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
};

export const validate = (schemas: Schema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated: any = {};
      if (schemas.body) {
        validated.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        validated.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        validated.params = schemas.params.parse(req.params);
      }

      (req as any).validated = validated;

      next();
    } catch (err: any) {
       console.error("🔥 RAW ERROR:", err);
      console.error("🔥 TYPE:", typeof err);
      console.error("🔥 INSTANCE:", err instanceof Error);
      console.error("🔥 CONSTRUCTOR:", (err as any)?.constructor?.name);
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: err.issues.map((e) => e.message),
        });
      }

      return res.status(400).json({
        message: "Validation error",
        errors: ["Unknown validation error"],
      });
    }
  };
};