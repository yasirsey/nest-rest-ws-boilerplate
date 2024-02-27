import { Controller, Get, HttpCode, HttpStatus, Query, Request, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchRoomsResponseDto } from './dto/responses/search-my-rooms.response.dto';
import { RoomService } from './room.service';
import { SearchRoomsRequestDto } from './dto/requests/search-my-rooms.request.dto';

@Controller('rooms')
@ApiTags('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) { }

    @Get('my')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Rooms successfully retrieved', type: SearchRoomsResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMe(@Request() req, @Query(new ValidationPipe()) searchRoomDto: SearchRoomsRequestDto): Promise<SearchRoomsResponseDto> {
        const loggedInUserId = req.user.id;
        return await this.roomService.searchMyRooms(loggedInUserId, searchRoomDto);
    }
}
