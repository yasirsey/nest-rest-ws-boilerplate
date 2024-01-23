import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfilePhotoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
