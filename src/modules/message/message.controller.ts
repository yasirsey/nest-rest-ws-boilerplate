import { Controller, Get, HttpCode, HttpStatus, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { SearchMyRoomMessagesRequestDto } from './dto/requests/search-my-room-messages.request.dto';
import { SearchMyRoomMessagesResponseDto } from './dto/responses/search-my-room-messages.response.dto';

@Controller('messages')
@ApiTags('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @Get('my/rooms/:roomId')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Messages successfully retrieved', type: SearchMyRoomMessagesRequestDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    async getMe(
        @Param() params: any,
        @Query(new ValidationPipe()) searchMyRoomMessagesRequest: SearchMyRoomMessagesRequestDto
    ): Promise<SearchMyRoomMessagesResponseDto> {
        return await this.messageService.searchMyRoomMessages(params.roomId, searchMyRoomMessagesRequest)
    }
}
