import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class SearchMyRoomMessagesRequestDto {
  @ApiProperty({ example: 1, default: 1, required: false })
  @IsOptional()
  @Transform(param => parseInt(param.value))
  @IsInt()
  @Min(1)
  @Max(100)
  page?: number;

  @ApiProperty({ example: 10, default: 10, required: false })
  @IsOptional()
  @Transform(param => parseInt(param.value))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
