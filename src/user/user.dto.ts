import { IsOptional, IsString, ValidateNested,IsEmail,Validate, IsObject,IsDefined, IsEmpty } from 'class-validator';
import CreateAddressDto from './address.dto';

import { Type } from 'class-transformer';
import "reflect-metadata";


class CreateUserDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @ValidateNested({always: true, each: true})
  @Type(()=> CreateAddressDto)
  public address: CreateAddressDto;
}

export default CreateUserDto;
