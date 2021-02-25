import BaseResponse from './BaseResponse';

class ListResponse extends BaseResponse {
    public data: any;
    constructor(code: number, message: string,data:any) {
        super(code,message);
        this.data=data;
      }
}

export default ListResponse;
