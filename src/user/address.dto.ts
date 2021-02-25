import { IsDefined, IsEmpty, IsString,MinLength,MaxLength, IsNumber } from 'class-validator';

class CreateAddressDto {
  @IsNumber()
  public street: number;

  @MinLength(5, {
    message: 'city is too short',
  })
  @MaxLength(50, {
    message: 'city is too long',
  })
  public city: string;


  @IsString()
  public country: string;
}

export default CreateAddressDto;
