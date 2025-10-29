import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HostelDocument = Hostel & Document;

@Schema()
export class Room {
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
}

@Schema()
export class Hostel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  owner: string;

  @Prop()
  description?: string;

  @Prop([String])
  amenities?: string[];

  @Prop()
  contactInfo?: string;

  @Prop([String])
  images?: string[];

  @Prop([Room])
  rooms?: Room[];
}

export const HostelSchema = SchemaFactory.createForClass(Hostel);
