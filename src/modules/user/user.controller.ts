import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchUserRequestDto } from './dto/requests/search-user.request.dto';
import { GetUserByIdRequestDto } from './dto/requests/get-user-by-id.request.dto';
import { UserDto } from './dto/user.dto';
import { SearchUserResponseDto } from './dto/responses/search-user.response.dto';
import { AuthService } from '../auth/auth.service';
import { RegisterRequestDto } from './dto/requests/register-user.request.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { DeleteUserResponseDto } from './dto/responses/delete-user.response.dto';
import { RegisterResponseDto } from './dto/responses/register.response.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

    @Post()
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: 201, description: 'User successfully created', type: UserDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async register(@Body(new ValidationPipe()) registerUserDto: RegisterRequestDto): Promise<RegisterResponseDto> {
        return await this.authService.register(registerUserDto);
    }

    @Get('search')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Users successfully found', type: SearchUserResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async search(@Query(new ValidationPipe()) searchUserDto: SearchUserRequestDto): Promise<SearchUserResponseDto> {
        return await this.userService.search(searchUserDto);
    }

    @Get(':id')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'User successfully found', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getById(@Param(new ValidationPipe()) getUserRequestDto: GetUserByIdRequestDto): Promise<UserDto> {
        return await this.userService.getById(getUserRequestDto.id);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'User successfully deleted' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async delete(@Param(new ValidationPipe()) getUserRequestDto: GetUserByIdRequestDto): Promise<DeleteUserResponseDto> {
        return await this.userService.delete(getUserRequestDto);
    }
}
