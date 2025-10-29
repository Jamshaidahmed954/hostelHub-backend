import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class RegisterBookingDto {
  @IsMongoId()
  hostelId: string;

  @IsString()
  roomNumber: string;

  @IsString()
  guestName: string;

  @IsString()
  guestEmail: string;

  @IsString()
  guestPhone: string;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsNumber()
  numberOfGuests: number;

  @IsNumber()
  totalPrice: number;

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
