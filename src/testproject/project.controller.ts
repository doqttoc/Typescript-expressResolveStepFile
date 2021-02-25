import { Console } from "console";
import { Request, Response, NextFunction, Router } from "express";
import ProjectNotFoundException from "../exceptions/ProjectNotFoundException";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateProjectDto from "./project.dto";
import projectModel from "./project.model";
import ListResponse from '../response/ListResponse';
import BaseResponse from '../response/BaseResponse';

class ProjectController implements Controller {
  public path = "/project";
  public router = Router();
  private project = projectModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAllProject);
    this.router.get(`${this.path}/theuser`, authMiddleware,this.getProjectByUser);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .get(`${this.path}/:id`, this.getProjectById)
      
      .delete(`${this.path}/:id`, this.deleteProject)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreateProjectDto),
        this.createProject
      );
  }

  private getAllProject = async (request: Request, response: Response) => {
    let {query}=request;    
    const projects = await this.project.find({}).skip(Number(query.index)*Number(query.size)).limit(Number(query.size)).exec();
    const total=await this.project.countDocuments({});
    response.send(new ListResponse(0,'success',{data:projects,total:total}));
  };

  private getProjectByUser=async(request:RequestWithUser,response:Response)=>{
    const projects=await this.project.find({createBy:request.user._id});
    response.send(projects);
  }

  private getProjectById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const project = await this.project.findById(id);
    if (project) {
      response.send(project);
    } else {
      next(new ProjectNotFoundException(id));
    }
  };

  private createProject = async (
    request: RequestWithUser,
    response: Response
  ) => {
    const projectData: CreateProjectDto = request.body;
    const createdProject = new this.project({
      ...projectData,
      createBy: request.user._id,
    });
    await createdProject.save();
    response.send(new BaseResponse(0,"success"));
  };

  private deleteProject = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const successResponse = await this.project.findByIdAndDelete(id);
    if (successResponse) {
      response.sendStatus(200);
    } else {
      next(new ProjectNotFoundException(id));
    }
  };
}

export default ProjectController;
