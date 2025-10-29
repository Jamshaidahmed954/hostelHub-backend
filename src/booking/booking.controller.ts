import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { RegisterBookingDto } from './dto/register-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  async createBooking(@Body() registerBookingDto: RegisterBookingDto) {
    const result = await this.bookingService.createBooking(registerBookingDto);
    return result;
  }

  @Get()
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Get('hostel/:hostelId')
  async getBookingsByHostel(@Param('hostelId') hostelId: string) {
    return this.bookingService.getBookingsByHostel(hostelId);
  }

  @Get('guest/:email')
  async getBookingsByGuest(@Param('email') email: string) {
    return this.bookingService.getBookingsByGuestEmail(email);
  }

  @Put(':id')
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @Put(':id/cancel')
  async cancelBooking(@Param('id') id: string) {
    return this.bookingService.cancelBooking(id);
  }

  @Put(':id/confirm')
  async confirmBooking(@Param('id') id: string) {
    return this.bookingService.confirmBooking(id);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
