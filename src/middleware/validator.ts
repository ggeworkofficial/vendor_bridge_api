import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

type Schema = {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
};

export const validate = (schemas: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const options = { abortEarly: false, stripUnknown: true };

    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, options);
      if (error) {
        return res.status(400).json({
          message: "Validation error (body)",
          errors: error.details.map((d) => d.message),
        });
      }
      req.body = value;
    }

    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, options);
      if (error) {
        return res.status(400).json({
          message: "Validation error (query)",
          errors: error.details.map((d) => d.message),
        });
      }
      req.query = value;
    }

    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, options);
      if (error) {
        return res.status(400).json({
          message: "Validation error (params)",
          errors: error.details.map((d) => d.message),
        });
      }
      req.params = value;
    }

    next();
  };
};