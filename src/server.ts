import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import PostController from './post/post.controller';
import ReportController from './report/report.controller';
import UserController from './user/user.controller';
import ProjectController from "./testproject/project.controller";
import OccController from "./testreadstep/readstep.controller"

import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
  [
    new PostController(),
    new AuthenticationController(),
    new UserController(),
    new ReportController(),
    new ProjectController(),
    new OccController(),
  ],
);

app.listen();