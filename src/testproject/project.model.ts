import * as mongoose from "mongoose"

import Project from "./project.interface"


const projectSchema = new mongoose.Schema(
    {
      name: String,
      desc:String,
      createTime:{
        type: Date,
        default: Date.now
      },
      createBy: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    { collection: 'project' }
  );

  
  const projectModel = mongoose.model<Project & mongoose.Document>('Project', projectSchema);
  
  export default projectModel;