import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsMongoId()
  hostelId?: string;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  guestEmail?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;

  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @IsOptional()
  @IsNumber()
  numberOfGuests?: number;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsEnum(['confirmed', 'pending', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsEnum(['paid', 'pending', 'refunded'])
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  bookingReference?: string;
}
