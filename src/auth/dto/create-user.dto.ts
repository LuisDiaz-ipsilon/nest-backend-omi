import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, IsDateString, MinLength, Matches, IsArray, Min, Max } from 'class-validator';

export class CreateUserDto {

    // First name of the user
    @IsString()
    firstName: string;

    // Last name (paternal)
    @IsString()
    lastNameP: string;

    // Last name (maternal)
    @IsString()
    lastNameM: string;

    // Email with validation for format
    @IsEmail()
    email: string;

    // School name
    @IsString()
    school: string;

    // Educational level, restricted by enum values
    @IsEnum(['secundaria', 'bachillerato', 'ingenieria', 'primaria'])
    schoolLevel: string;

    // School year, numerical values expected
    @Min(1)
    @Max(9) // Asumo un rango de 1 a 6, ajusta según tu lógica
    schoolYear: number;

    // Optional bachillerato type, restricted by enum
    @IsOptional()
    @IsEnum(['2', '3'])
    bachilleratoType?: string;

    // Birth date, using date string validation
    @IsDateString()
    birthDate: string;

    // External user identifier for another system
    @IsString()
    omegaUser: string;

    // Password, minimum length of 7
    @MinLength(7)
    pass: string;

    // Status of the user account
    @IsBoolean()
    @IsOptional() // Optional as it has a default value
    isActive?: boolean;

    // Roles array with string values
    @IsArray()
    @IsString({ each: true })
    roles: string[];
}
