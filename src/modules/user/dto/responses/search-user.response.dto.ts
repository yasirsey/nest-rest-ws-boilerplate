import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { UserDto } from '../../../../schemas/dto/user.dto';
import { UserDocument } from 'src/schemas/user.schema';

export class SearchUserResponseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  total: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  page: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  limit: number;

  @ApiProperty({ type: [UserDto] })
  users: UserDto[];

  constructor(total: number, page: number, limit: number, users: UserDocument[]) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.users = users.map(user => new UserDto(user));
  }
}
