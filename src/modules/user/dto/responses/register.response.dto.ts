import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserDto } from 'src/schemas/dto/user.dto';

export class RegisterResponseDto {
  @ApiProperty({ example: '5f9d4f8a4f6ded2b3c6c9b9d' })
  @IsString()
  token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto
}
