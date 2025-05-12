import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword });
    return user.save();
  }

  async updateUser(email: string, updates: Partial<User>): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true } // Return the updated document
    ).exec();
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userModel.findOne({ resetPasswordToken: token }).exec();
  }
}
