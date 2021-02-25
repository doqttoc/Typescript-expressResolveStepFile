import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";
import HttpException from "../exceptions/HttpException";

function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false
): RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          function getErrorMessage(arr:any,errArray: ValidationError[]):any {
            errArray.forEach((error: ValidationError) => {
              if (error.children.length === 0) {
                arr.push(Object.values(error.constraints)[0]);
                return arr;
              } else {
                return getErrorMessage(arr,error.children);
              }
            });
            return arr;
          }
          next(new HttpException(400, getErrorMessage([],errors).join(",")));
        } else {
          next();
        }
      }
    );
  };
}

export default validationMiddleware;
