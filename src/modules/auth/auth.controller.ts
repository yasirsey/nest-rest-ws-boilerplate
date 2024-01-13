import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/responses/login.response.dto';
import { LoginRequestDto } from './dto/requests/login.request.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'User successfully logged in', type: LoginResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body(new ValidationPipe()) loginDto: LoginRequestDto): Promise<LoginResponseDto> {
        return await this.authService.login(loginDto);
    }
}
