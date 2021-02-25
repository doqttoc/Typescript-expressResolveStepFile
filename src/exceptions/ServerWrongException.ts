import HttpException from './HttpException';

class NotAuthorizedException extends HttpException {
    constructor(msg: string) {
        super(500, msg);
      }
}

export default NotAuthorizedException;
