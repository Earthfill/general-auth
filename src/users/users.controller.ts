import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UserDto } from './dtos';
import { CurrentUser, Roles } from '../decorators';
import { Serialize } from '../interceptors/serialize.interceptor';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { Role, User } from './entities';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return await this.authService.signup(signUpDto);
  }

  @Post('/signin')
  async login(@Body() signinDto: SignInDto): Promise<{ token: string }> {
    return await this.authService.login(signinDto);
  }

  @Serialize(UserDto)
  @Get()
  async findAll(@Req() request: any) {
    const users = await this.usersService.findAll(request.query);
    return users;
  }

  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @Roles(Role.USER)
  profile(@CurrentUser() user: User) {
    return user;
  }
}
