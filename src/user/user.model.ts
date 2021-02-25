import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  country: String,
  street: Number,
});

const userSchema = new mongoose.Schema(
  {
    address: addressSchema,
    email: String,
    firstName: String,
    lastName: String,
    password: {
      type: String,
      //列表的时候 不返回 password 密码这个字段
      get: (): undefined => undefined,
    },
  },
  {
    collection: 'user',
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});
userSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'createBy',
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
