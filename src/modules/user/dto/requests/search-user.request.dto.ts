import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Gender } from 'src/enums/gender.enum';
import { Role } from 'src/enums/role.enum';

export class SearchUserRequestDto {
  @ApiProperty({ example: 'Severus Snape', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: 'test@gmail.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'admin', required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: string;

  @ApiProperty({ example: 'female', required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: string;

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
