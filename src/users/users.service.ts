import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities';
import { APIFeatures } from '../utils';

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

  async findAll(query?: any): Promise<User[]> {
    const features = new APIFeatures(this.userModel.find(), query)
      .filter()
      .sort()
      .limit()
      .pagination();
    const users = await features.mongooseQuery;
    return users;
  }
}
