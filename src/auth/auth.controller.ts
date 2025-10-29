import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  Put,
  Delete,
  Param,
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
    return this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.password,
      registerDto.role,
    );
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user.user; // Return the user directly from the JWT payload
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getAllUsers(@Request() req) {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      throw new Error('Access denied. Admin role required.');
    }
    return this.authService.getAllUsers();
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
    return this.authService.updateUser(id, updateUserDto, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(req.user.sub, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  deleteUser(@Param('id') id: string, @Request() req) {
    return this.authService.deleteUser(id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/hostel/:hostelId/bookings')
  getUsersByHostelBookings(@Param('hostelId') hostelId: string) {
    return this.authService.getUsersByHostelBookings(hostelId);
  }
}
