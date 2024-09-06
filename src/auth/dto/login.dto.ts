import { IsEmail, IsString, MinLength } from 'class-validator';



export class LoginDto {

    @IsEmail()
    email: string;

    @MinLength(7)
    pass: string;

}