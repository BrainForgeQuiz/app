import { IsInt, IsNotEmpty } from 'class-validator';

export default class LimitDto {
  @IsInt({ message: 'Limit must be an integer' })
  @IsNotEmpty({ message: 'Limit cannot be empty' })
  limit: number;
}
