import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchUserRequestDto } from './dto/requests/search-user.request.dto';
import { GetUserByIdRequestDto } from './dto/requests/get-user-by-id.request.dto';
import { UserDto } from '../../schemas/dto/user.dto';
import { SearchUserResponseDto } from './dto/responses/search-user.response.dto';
import { AuthService } from '../auth/auth.service';
import { RegisterRequestDto } from './dto/requests/register-user.request.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { DeleteUserResponseDto } from './dto/responses/delete-user.response.dto';
import { RegisterResponseDto } from './dto/responses/register.response.dto';
import { Public } from 'src/decorators/public.decorator';
import { UpdateUserRequestDto } from './dto/requests/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfilePhotoDto } from './dto/requests/update-profile-photo.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

    @Post()
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: 201, description: 'User successfully created', type: UserDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async register(@Body(new ValidationPipe()) registerUserDto: RegisterRequestDto): Promise<RegisterResponseDto> {
        return await this.authService.register(registerUserDto);
    }

    @Get('me')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'User successfully found', type: UserDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getMe(@Request() req): Promise<UserDto> {
        return await this.userService.getById(req.user.id);
    }

    @Patch('me')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'User successfully updated', type: UserDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async updateMe(@Request() req, @Body(new ValidationPipe()) updateUserDto: UpdateUserRequestDto): Promise<UserDto> {
        return await this.userService.updateById(req.user.id, updateUserDto);
    }

    @Patch('me/profile-photo')
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async updateMyProfilePhoto(
        @Request() req,
        @Body(new ValidationPipe()) updateProfilePhotoDto: UpdateProfilePhotoDto,
        @UploadedFile() file,
    ): Promise<UserDto> {
        const userId = req.user.id;

        return await this.userService.updateMyProfilePhoto(userId, file.buffer.toString('base64'));
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
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getById(@Param(new ValidationPipe()) getUserRequestDto: GetUserByIdRequestDto): Promise<UserDto> {
        return await this.userService.getById(getUserRequestDto.id);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'User successfully deleted' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async delete(@Param(new ValidationPipe()) getUserRequestDto: GetUserByIdRequestDto): Promise<DeleteUserResponseDto> {
        return await this.userService.delete(getUserRequestDto);
    }
}
