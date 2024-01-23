import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService, private userService: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client: Socket = context.switchToWs().getClient<Socket>();

            const token = this.extractTokenFromHeader(client);

            if (!token) {
                client.emit('error', 'Unauthorized access');
                throw new WsException('Unauthorized access');
            }

            const payload = await this.jwtService.verifyAsync(
                token
            );

            const user = await this.userService.getById(payload.sub);

            if (!user) {
                client.emit('error', 'Unauthorized access');
                throw new WsException('Unauthorized access');
            }

            client.handshake.auth.user = user;

            return true;
        } catch (err) {
            throw new WsException('Unauthorized access');
        }
    }

    private extractTokenFromHeader(client): string | undefined {
        if (!client.handshake?.auth?.token) {
            return undefined;
        }

        const [type, token] = client.handshake?.auth?.token.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
