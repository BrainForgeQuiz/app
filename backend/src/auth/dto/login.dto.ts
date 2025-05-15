import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Login Data Transfer Object
 *@description used for type safety
 *@param {string} username - username for the user
 *@param {string} password - password for the user
 */
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(3)
  public username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(3)
  public password: string;
}
