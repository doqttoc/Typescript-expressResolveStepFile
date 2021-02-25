import { validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  MinLength,
  MaxLength,
  IsString,
  Max } from 'class-validator';



class CreateProjectDto {
  @MinLength(5, {
    message: 'projectName is too short',
  })
  @MaxLength(50, {
    message: 'projectName is too long',
  })
  public name: string;

  @IsString()
  public desc: string;
}

export default CreateProjectDto;
