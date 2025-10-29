import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Booking } from '../booking/booking.schema';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: 'user',
    save: jest.fn(),
  };

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockBookingModel = {
    find: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Booking.name),
          useValue: mockBookingModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.save.mockResolvedValue(mockUser);

      const result = await service.register(
        'John Doe',
        'john@example.com',
        'password123',
      );

      expect(result).toEqual({
        success: true,
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        message: 'User registered successfully',
      });
    });

    it('should throw error if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register('John Doe', 'john@example.com', 'password123'),
      ).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      // Mock bcrypt.compare
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);

      const result = await service.login('john@example.com', 'password123');

      expect(result).toEqual({
        success: true,
        access_token: 'jwt-token',
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        message: 'Login successful',
      });
    });

    it('should throw error for invalid credentials', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(
        service.login('john@example.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.getProfile('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users without passwords', async () => {
      const users = [mockUser];
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.getAllUsers();

      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.getUserById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.getUserById('507f1f77bcf86cd799439011'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.updateUser(
        '507f1f77bcf86cd799439011',
        updateData,
        'user',
      );

      expect(result).toEqual({
        success: true,
        user: updatedUser,
        message: 'User updated successfully',
      });
    });

    it('should throw error if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(
        service.updateUser('507f1f77bcf86cd799439011', {}, 'user'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      mockUserModel.findById.mockResolvedValue(mockUser);

      // Mock bcrypt functions
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
      jest
        .spyOn(require('bcryptjs'), 'hash')
        .mockResolvedValue('hashedNewPassword');

      const result = await service.changePassword(
        '507f1f77bcf86cd799439011',
        changePasswordDto,
      );

      expect(result).toEqual({
        success: true,
        message: 'Password changed successfully',
      });
    });

    it('should throw error for incorrect current password', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);

      await expect(
        service.changePassword('507f1f77bcf86cd799439011', changePasswordDto),
      ).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully for admin', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.deleteUser(
        '507f1f77bcf86cd799439011',
        'admin',
      );

      expect(result).toEqual({
        success: true,
        message: 'User deleted successfully',
      });
    });

    it('should throw error for non-admin user', async () => {
      await expect(
        service.deleteUser('507f1f77bcf86cd799439011', 'user'),
      ).rejects.toThrow('Only admins can delete users');
    });
  });

  describe('getUsersByHostelBookings', () => {
    it('should return users who have booked rooms in a hostel', async () => {
      const mockBookings = [
        {
          _id: 'booking1',
          hostelId: 'hostel123',
          guestEmail: 'john@example.com',
          guestName: 'John Doe',
          guestPhone: '+1-555-0123',
          roomNumber: '101',
          checkInDate: new Date('2025-11-01'),
          checkOutDate: new Date('2025-11-03'),
          status: 'confirmed',
          totalPrice: 150,
          bookingReference: 'BK123',
        },
        {
          _id: 'booking2',
          hostelId: 'hostel123',
          guestEmail: 'jane@example.com',
          guestName: 'Jane Doe',
          guestPhone: '+1-555-0124',
          roomNumber: '102',
          checkInDate: new Date('2025-11-05'),
          checkOutDate: new Date('2025-11-07'),
          status: 'confirmed',
          totalPrice: 200,
          bookingReference: 'BK124',
        },
      ];

      const mockUsers = [{ ...mockUser, email: 'john@example.com' }];

      mockBookingModel.find.mockResolvedValue(mockBookings);
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUsers),
      });

      const result = await service.getUsersByHostelBookings('hostel123');

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(2); // Both registered user and guest
      expect(result.registeredUsers).toBe(1);
      expect(result.guestUsers).toBe(1);
      expect(result.users[0].isRegistered).toBe(true);
      expect(result.users[1].isRegistered).toBe(false);
      expect(result.users[0].bookings).toHaveLength(1);
      expect(result.users[1].bookings).toHaveLength(1);
    });

    it('should return empty array when no bookings found', async () => {
      mockBookingModel.find.mockResolvedValue([]);

      const result = await service.getUsersByHostelBookings('hostel123');

      expect(result.success).toBe(true);
      expect(result.users).toEqual([]);
      expect(result.message).toBe('No bookings found for this hostel');
    });
  });
});
