import { Console } from "console";
import { Request, Response, NextFunction, Router, request } from "express";
import ProjectNotFoundException from "../exceptions/ProjectNotFoundException";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";

import ServerWrongException from "../exceptions/ServerWrongException"
import ListResponse from "../response/ListResponse";
import BaseResponse from "../response/BaseResponse";
var occ = require("node-occ").occ;
var path = require("path");

function buildResponse(solids: any, logs: any): any {
  let response = { solids, logs };
  let counter = 1;
  solids.forEach(function (solid: any) {
    solid.name = "S" + counter;
    counter++;
    try {
      let mesh = occ.buildSolidMesh(solid);
      response.solids.push(mesh);
    } catch (err) {
      throw (" EXCEPTION in MESHING ");
    }
  });
  response.logs = logs;
  console.log(response.solids);
  return response;
}



class OccController implements Controller {
  public path = "/readstep";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .get(this.path, authMiddleware, this.testReadStep)
      .post(this.path, authMiddleware, this.createStep);
  }
  private createStep = async (request: RequestWithUser, response: Response) => {
    // construct a box
    let box = occ.makeBox([0, 0, 0], [100, 100, 50]);
    // construct a cylinder
    let cyl = occ.makeCylinder([50, 50, -10], [50, 50, 60], 40);
    // cut the box with cylinder
    try {
      box = occ.cut(box, cyl);
      // save result to a STEP file
      occ.writeSTEP("create44.step", box);
    } catch (error) {
      console.log(error);
    }

    response.send(new BaseResponse(0, "success"));
  };
  private testReadStep = async (
    request: RequestWithUser,
    response: Response,
    next:Function
  ) => {
    // let solids=testReadStepFile("../../create-1.step")
    // response.send(new ListResponse(0,'success',{data:solids}));
    try {
      var filename = path.join(__dirname, "../../create-1.step");

      occ.readSTEP(filename, function (err: any, solids: any) {
        if (err) {
          // console.log(" readStep has failed", err.message);
        //   throw new Error(`readStpe has failed:${err.message}`)
            next(new ServerWrongException(err.message))
       
        } else {
          response.send(
            new ListResponse(0, "success", { data: buildResponse(solids, []) })
          );
        }
      });
    } catch (error) {
        throw new Error(error.message)
    }
  };
}

export default OccController;
