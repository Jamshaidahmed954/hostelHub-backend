import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterBookingDto } from './dto/register-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './booking.schema';
import { Hostel } from '../hostel/hostel.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Hostel.name) private hostelModel: Model<any>,
  ) {}

  async createBooking(
    dto: RegisterBookingDto,
  ): Promise<Booking | { message: string }> {
    // Check if the hostel exists and get room availability
    const hostel = await this.hostelModel.findById(dto.hostelId);
    if (!hostel) {
      throw new Error('Hostel not found');
    }

    // Find the specific room
    const room = hostel.rooms?.find((r) => r.roomNumber === dto.roomNumber);
    if (!room) {
      throw new Error('Room not found in this hostel');
    }

    // Check if room is available
    if (!room.available) {
      return { message: 'not available' };
    }

    // Create the booking
    const bookingReference = this.generateBookingReference();
    const newBooking = new this.bookingModel({ ...dto, bookingReference });
    return newBooking.save();
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).populate('hostelId').exec();
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingModel.find().populate('hostelId').exec();
  }

  async getBookingsByHostel(hostelId: string): Promise<Booking[]> {
    return this.bookingModel.find({ hostelId }).populate('hostelId').exec();
  }

  async getBookingsByGuestEmail(email: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ guestEmail: email })
      .populate('hostelId')
      .exec();
  }

  async updateBooking(
    id: string,
    dto: UpdateBookingDto,
  ): Promise<Booking | null> {
    return this.bookingModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('hostelId')
      .exec();
  }

  async cancelBooking(id: string): Promise<Booking | null> {
    // First, get the booking to find hostelId and roomNumber
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      return null;
    }

    // Update room availability in hostel (make room available again)
    await this.hostelModel.updateOne(
      { _id: booking.hostelId, 'rooms.roomNumber': booking.roomNumber },
      { $set: { 'rooms.$.available': true } },
    );

    // Update booking status
    return this.bookingModel
      .findByIdAndUpdate(
        id,
        { status: 'cancelled', paymentStatus: 'refunded' },
        { new: true },
      )
      .populate('hostelId')
      .exec();
  }

  async confirmBooking(id: string): Promise<Booking | null> {
    // First, get the booking to find hostelId and roomNumber
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      return null;
    }

    // Update room availability in hostel
    await this.hostelModel.updateOne(
      { _id: booking.hostelId, 'rooms.roomNumber': booking.roomNumber },
      { $set: { 'rooms.$.available': false } },
    );

    // Update booking status
    return this.bookingModel
      .findByIdAndUpdate(
        id,
        { status: 'confirmed', paymentStatus: 'paid' },
        { new: true },
      )
      .populate('hostelId')
      .exec();
  }

  async deleteBooking(id: string): Promise<Booking | null> {
    return this.bookingModel.findByIdAndDelete(id).exec();
  }

  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `BK${timestamp}${random}`.toUpperCase();
  }
}
