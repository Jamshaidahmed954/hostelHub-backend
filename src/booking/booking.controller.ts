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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { RegisterBookingDto } from './dto/register-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('bookings')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createBooking(@Body() registerBookingDto: RegisterBookingDto) {
    const result = await this.bookingService.createBooking(registerBookingDto);
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBooking(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Get('hostel/:hostelId')
  @ApiOperation({ summary: 'Get bookings by hostel ID' })
  @ApiParam({ name: 'hostelId', description: 'Hostel ID' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async getBookingsByHostel(@Param('hostelId') hostelId: string) {
    return this.bookingService.getBookingsByHostel(hostelId);
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Get bookings by owner ID' })
  @ApiParam({ name: 'ownerId', description: 'Owner ID' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async getBookingsByOwner(@Param('ownerId') ownerId: string) {
    return this.bookingService.getBookingsByOwner(ownerId);
  }

  @Get('guest/:email')
  @ApiOperation({ summary: 'Get bookings by guest email' })
  @ApiParam({ name: 'email', description: 'Guest email' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async getBookingsByGuest(@Param('email') email: string) {
    return this.bookingService.getBookingsByGuestEmail(email);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update booking information' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(@Param('id') id: string) {
    return this.bookingService.cancelBooking(id);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: 'Confirm booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async confirmBooking(@Param('id') id: string) {
    return this.bookingService.confirmBooking(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
