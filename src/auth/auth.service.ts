import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // ✅ Register user
  async register(name: string, email: string, password: string, role?: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({name, email, password: hashedPassword, role: role });
    await user.save();

    return { success: true, user: { name: user.name, email: user.email, role: user.role }, message: 'User registered successfully' };
  }

  // ✅ Login user
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { success: true, access_token: token, user: { name: user.name, email: user.email, role: user.role }, message: "Login successful" };
  }

  // ✅ Get Profile from token
  async getProfile(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }
}
