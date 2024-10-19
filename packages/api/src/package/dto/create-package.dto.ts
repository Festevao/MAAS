import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePackageDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  themes: string[];

  @IsNumber()
  @Min(0)
  version: number;
}