import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    changePassword: jest.fn(),
    deleteUser: jest.fn(),
    getUsersByHostelBookings: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      };

      const result = { success: true, message: 'User registered successfully' };
      mockAuthService.register.mockResolvedValue(result);

      const response = await controller.register(registerDto);

      expect(response).toEqual(result);
      expect(mockAuthService.register).toHaveBeenCalledWith(
        'John Doe',
        'john@example.com',
        'password123',
        'user',
      );
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = {
        success: true,
        access_token: 'jwt-token',
        message: 'Login successful',
      };
      mockAuthService.login.mockResolvedValue(result);

      const response = await controller.login(loginDto);

      expect(response).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = { user: { user: mockUser } };

      const response = await controller.getProfile(req);

      expect(response).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users for admin', async () => {
      const req = { user: { role: 'admin' } };
      const users = [mockUser];
      mockAuthService.getAllUsers.mockResolvedValue(users);

      const response = await controller.getAllUsers(req);

      expect(response).toEqual(users);
      expect(mockAuthService.getAllUsers).toHaveBeenCalled();
    });

    it('should throw error for non-admin user', async () => {
      const req = { user: { role: 'user' } };

      await expect(controller.getAllUsers(req)).rejects.toThrow(
        'Access denied. Admin role required.',
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      mockAuthService.getUserById.mockResolvedValue(mockUser);

      const response = await controller.getUserById('507f1f77bcf86cd799439011');

      expect(response).toEqual(mockUser);
      expect(mockAuthService.getUserById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const req = { user: { sub: '507f1f77bcf86cd799439011', role: 'user' } };
      const result = { success: true, message: 'User updated successfully' };

      mockAuthService.updateUser.mockResolvedValue(result);

      const response = await controller.updateUser(
        '507f1f77bcf86cd799439011',
        updateUserDto,
        req,
      );

      expect(response).toEqual(result);
      expect(mockAuthService.updateUser).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateUserDto,
        'user',
      );
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };
      const req = { user: { sub: '507f1f77bcf86cd799439011' } };
      const result = {
        success: true,
        message: 'Password changed successfully',
      };

      mockAuthService.changePassword.mockResolvedValue(result);

      const response = await controller.changePassword(changePasswordDto, req);

      expect(response).toEqual(result);
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        changePasswordDto,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const req = { user: { role: 'admin' } };
      const result = { success: true, message: 'User deleted successfully' };

      mockAuthService.deleteUser.mockResolvedValue(result);

      const response = await controller.deleteUser(
        '507f1f77bcf86cd799439011',
        req,
      );

      expect(response).toEqual(result);
      expect(mockAuthService.deleteUser).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        'admin',
      );
    });
  });

  describe('getUsersByHostelBookings', () => {
    it('should return users who have booked rooms in a hostel', async () => {
      const result = {
        success: true,
        users: [mockUser],
        totalUsers: 1,
        registeredUsers: 1,
        guestUsers: 0,
        message:
          'Found 1 users who have booked rooms in this hostel (1 registered, 0 guests)',
      };

      mockAuthService.getUsersByHostelBookings.mockResolvedValue(result);

      const response = await controller.getUsersByHostelBookings('hostel123');

      expect(response).toEqual(result);
      expect(mockAuthService.getUsersByHostelBookings).toHaveBeenCalledWith(
        'hostel123',
      );
    });
  });
});
