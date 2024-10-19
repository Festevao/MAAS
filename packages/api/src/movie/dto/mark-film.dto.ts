import { ArrayMinSize, IsArray, IsNumber, IsPositive } from 'class-validator';

export class MovieMarkDTO {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  movieIds: number[];
}