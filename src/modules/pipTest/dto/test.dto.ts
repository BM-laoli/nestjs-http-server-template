import { IsEmail, IsNotEmpty } from 'class-validator';

export class TestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
