import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Booking } from '../booking/booking.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  // ✅ Register user
  async register(name: string, email: string, password: string, role?: string) {
    try {
      // Validate required fields
      if (!name || name.trim() === '') {
        throw new BadRequestException('Name is required and cannot be empty');
      }
      if (!email || email.trim() === '') {
        throw new BadRequestException('Email is required and cannot be empty');
      }
      if (!password || password.trim() === '') {
        throw new BadRequestException(
          'Password is required and cannot be empty',
        );
      }

      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: role || 'user',
      });

      await user.save();

      return {
        success: true,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'User registered successfully',
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message,
        );
        throw new BadRequestException(
          `Validation failed: ${validationErrors.join(', ')}`,
        );
      }
      throw error;
    }
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

    return {
      success: true,
      access_token: token,
      user: { name: user.name, email: user.email, role: user.role },
      message: 'Login successful',
    };
  }

  // ✅ Get Profile from token
  async getProfile(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }

  // ✅ Get all users (admin only)
  async getAllUsers() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }

  // ✅ Get user by ID
  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ✅ Update user profile
  async updateUser(
    userId: string,
    updateData: UpdateUserDto,
    currentUserRole?: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only allow users to update their own profile or admins to update any profile
    if (currentUserRole !== 'admin' && userId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Prevent non-admin users from changing roles
    if (updateData.role && currentUserRole !== 'admin') {
      throw new ForbiddenException('Only admins can change user roles');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password');

    return {
      success: true,
      user: updatedUser,
      message: 'User updated successfully',
    };
  }

  // ✅ Change password
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    // Update password
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  // ✅ Delete user (admin only)
  async deleteUser(userId: string, currentUserRole?: string) {
    if (currentUserRole !== 'admin') {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.findByIdAndDelete(userId);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  // ✅ Get users who have booked rooms in a specific hostel
  async getUsersByHostelBookings(hostelId: string) {
    try {
      // Find all bookings for the specific hostel
      const bookings = await this.bookingModel.find({ hostelId }).exec();

      if (!bookings || bookings.length === 0) {
        return {
          success: true,
          users: [],
          message: 'No bookings found for this hostel',
        };
      }

      // Extract unique guest emails from bookings
      const guestEmails = [
        ...new Set(bookings.map((booking) => booking.guestEmail)),
      ];

      // Find registered users with these emails
      const registeredUsers = await this.userModel
        .find({ email: { $in: guestEmails } })
        .select('-password')
        .exec();

      // Create a map of registered users by email for quick lookup
      const registeredUsersMap = new Map();
      registeredUsers.forEach((user) => {
        registeredUsersMap.set(user.email, user);
      });

      // Create guest information for all bookings, including registered and non-registered users
      const guestsWithBookings = guestEmails.map((guestEmail) => {
        const guestBookings = bookings.filter(
          (booking) => booking.guestEmail === guestEmail,
        );
        const registeredUser = registeredUsersMap.get(guestEmail);

        if (registeredUser) {
          // This is a registered user
          return {
            _id: registeredUser._id,
            name: registeredUser.name,
            email: registeredUser.email,
            role: registeredUser.role,
            isRegistered: true,
            bookings: guestBookings.map((booking) => ({
              bookingId: booking._id,
              roomNumber: booking.roomNumber,
              checkInDate: booking.checkInDate,
              checkOutDate: booking.checkOutDate,
              status: booking.status,
              totalPrice: booking.totalPrice,
              bookingReference: booking.bookingReference,
            })),
          };
        } else {
          // This is a guest (not registered)
          const firstBooking = guestBookings[0]; // Use first booking for guest info
          return {
            name: firstBooking.guestName,
            email: firstBooking.guestEmail,
            phone: firstBooking.guestPhone,
            isRegistered: false,
            bookings: guestBookings.map((booking) => ({
              bookingId: booking._id,
              roomNumber: booking.roomNumber,
              checkInDate: booking.checkInDate,
              checkOutDate: booking.checkOutDate,
              status: booking.status,
              totalPrice: booking.totalPrice,
              bookingReference: booking.bookingReference,
            })),
          };
        }
      });

      return {
        success: true,
        users: guestsWithBookings,
        totalUsers: guestsWithBookings.length,
        registeredUsers: registeredUsers.length,
        guestUsers: guestsWithBookings.length - registeredUsers.length,
        message: `Found ${guestsWithBookings.length} users who have booked rooms in this hostel (${registeredUsers.length} registered, ${guestsWithBookings.length - registeredUsers.length} guests)`,
      };
    } catch (error) {
      throw new BadRequestException(
        'Error retrieving users for hostel bookings',
      );
    }
  }
}
