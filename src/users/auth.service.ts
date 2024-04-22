import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dtos';
import { User } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, password, name, roles } = signUpDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userModel.create({
      name,
      email,
      roles,
      password: hashedPassword,
    });
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  async login(signInDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = signInDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }
}
