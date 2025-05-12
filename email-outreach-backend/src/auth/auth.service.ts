import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signUp(email: string, password: string) {
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) throw new UnauthorizedException('User already exists');
    
    const user = await this.usersService.createUser(email, password);
    return this.generateToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) throw new BadRequestException('User not found');

    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token valid for 1 hour

    await this.usersService.updateUser(email, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
    // Email Sending Logic in Last
    console.log(`Password reset link: http://localhost:3000/reset-password/${token}`);

    return { message: 'Reset link sent. Please check your email.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updateUser(user.email, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: 'Password has been reset successfully.' };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
