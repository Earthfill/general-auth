import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtStrategy: JwtAuthGuard) {
    super([jwtStrategy]);
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(error, user) {
    if (error || !user) {
      throw error || new UnauthorizedException();
    }
    return user;
  }
}
