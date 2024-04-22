import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException('User already signed out!');
    }
    const user = await this.userModel.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
