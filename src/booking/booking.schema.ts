import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Hostel' })
  hostelId: Types.ObjectId;

  @Prop({ required: true })
  roomNumber: string;

  @Prop({ required: true })
  guestName: string;

  @Prop({ required: true })
  guestEmail: string;

  @Prop({ required: true })
  guestPhone: string;

  @Prop({ required: true })
  checkInDate: Date;

  @Prop({ required: true })
  checkOutDate: Date;

  @Prop({ required: true })
  numberOfGuests: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    required: true,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({
    required: true,
    enum: ['paid', 'pending', 'refunded'],
    default: 'pending',
  })
  paymentStatus: string;

  @Prop()
  specialRequests?: string;

  @Prop()
  bookingReference?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
