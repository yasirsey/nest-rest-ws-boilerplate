import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class LoginResponseDto {
  @ApiProperty({ example: '5f9d4f8a4f6ded2b3c6c9b9d' })
  @IsString()
  token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto
}
