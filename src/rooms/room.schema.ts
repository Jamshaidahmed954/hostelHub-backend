import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Hostel' })
  hostelId: Types.ObjectId;

  @Prop({ required: true })
  roomNumber: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  available: boolean;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  amenities?: string[];

  @Prop()
  floor?: number;

  @Prop({ type: [String], default: [] })
  images?: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
