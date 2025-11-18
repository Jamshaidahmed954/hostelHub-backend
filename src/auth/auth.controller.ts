import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admins')
  createAdmin(@Body() registerDto: RegisterDto, @Request() req) {
    if (req.user.role !== 'super_admin') {
      throw new ForbiddenException('Only super admins can create admins');
    }
    return this.authService.register(registerDto, {
      allowPrivileged: true,
      forceRole: 'admin',
    });
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getAllUsers(@Request() req, @Query('role') role?: string) {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    return this.authService.getAllUsers(role as any);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admins')
  getAdmins(@Request() req) {
    if (req.user.role !== 'super_admin') {
      throw new ForbiddenException('Only super admins can view admins');
    }
    return this.authService.getAllUsers('admin');
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.authService.updateUser(
      id,
      updateUserDto,
      req.user.role,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  deleteUser(@Param('id') id: string, @Request() req) {
    return this.authService.deleteUser(id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/hostel/:hostelId/bookings')
  getUsersByHostelBookings(@Param('hostelId') hostelId: string, @Request() req) {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    return this.authService.getUsersByHostelBookings(hostelId);
  }
}
