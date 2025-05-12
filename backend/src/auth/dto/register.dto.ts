import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @MinLength(3)
  @MaxLength(32)
  @IsString()
  @IsNotEmpty()
  public username: string;

  @MinLength(3)
  @MaxLength(32)
  @IsNotEmpty()
  @IsString()
  public password: string;

  @MinLength(3)
  @MaxLength(48)
  @IsNotEmpty()
  @IsString()
  public email: string;
}
