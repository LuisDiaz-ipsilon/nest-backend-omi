import { IsString, MinLength } from 'class-validator';



export class RegisterUserDto {
  @IsString()
  id: string;

  @IsString()
  firstName: string;

  @MinLength(7)
  pass: string;
}
