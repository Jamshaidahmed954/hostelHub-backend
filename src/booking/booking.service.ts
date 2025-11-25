import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Hostel, HostelDocument } from '../hostel/hostel.schema';
import { RegisterBookingDto } from './dto/register-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './booking.schema';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Hostel.name) private hostelModel: Model<HostelDocument>,
    private roomsService: RoomsService,
  ) {}

  async createBooking(
    dto: RegisterBookingDto,
  ): Promise<Booking | { message: string }> {
    // Check if the hostel exists
    const hostel = await this.hostelModel.findById(dto.hostelId);
    if (!hostel) {
      throw new NotFoundException('Hostel not found');
    }

    // Find rooms for this hostel with the specific room number
    const rooms = await this.roomsService.getRoomsByHostel(dto.hostelId.toString());
    const room = rooms.find((r) => r.roomNumber === dto.roomNumber);
    
    if (!room) {
      throw new NotFoundException('Room not found in this hostel');
    }

    // Check if room is available
    if (!room.available) {
      return { message: 'not available' };
    }

    // Create the booking
    const bookingReference = this.generateBookingReference();
    const newBooking = new this.bookingModel({
      ...dto,
      bookingReference,
      status: dto.status ?? 'pending',
      paymentStatus: dto.paymentStatus ?? 'pending',
    });
    const savedBooking = await newBooking.save();

    // Update room availability
    await this.roomsService.updateRoomAvailability((room as any)._id.toString(), false);

    return savedBooking;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).populate('hostelId').exec();
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingModel
      .find()
      .sort({ createdAt: -1 })
      .populate('hostelId')
      .exec();
  }

  async getBookingsByHostel(hostelId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ hostelId })
      .sort({ createdAt: -1 })
      .populate('hostelId')
      .exec();
  }

  async getBookingsByOwner(ownerId: string): Promise<Booking[]> {
    const hostels = await this.hostelModel
      .find({ owner: ownerId })
      .select('_id')
      .lean();
      console.log(hostels,"hostels found for owner");
      
    if (!hostels.length) {
      return [];
    }
    const hostelIds = hostels.map((hostel) => hostel._id);
    console.log(hostelIds,"hostel idies");
    
    return this.bookingModel
      .find({ hostelId: { $in: hostelIds } })
      .sort({ createdAt: -1 })
      .populate('hostelId')
      .exec();


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

    // Find the room and make it available again
    const rooms = await this.roomsService.getRoomsByHostel(booking.hostelId.toString());
    const room = rooms.find((r) => r.roomNumber === booking.roomNumber);
    
    if (room) {
      await this.roomsService.updateRoomAvailability((room as any)._id.toString(), true);
    }

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

    // Find the room and mark as unavailable
    const rooms = await this.roomsService.getRoomsByHostel(booking.hostelId.toString());
    const room = rooms.find((r) => r.roomNumber === booking.roomNumber);
    
    if (room) {
      await this.roomsService.updateRoomAvailability((room as any)._id.toString(), false);
    }

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
