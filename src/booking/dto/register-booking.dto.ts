import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterBookingDto {
  @ApiProperty({ description: 'Hostel ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  hostelId: string;

  @ApiProperty({ description: 'Room number', example: '101' })
  @IsString()
  roomNumber: string;

  @ApiProperty({ description: 'Guest name', example: 'John Doe' })
  @IsString()
  guestName: string;

  @ApiProperty({ description: 'Guest email', example: 'guest@example.com' })
  @IsString()
  guestEmail: string;

  @ApiProperty({ description: 'Guest phone number', example: '+1234567890' })
  @IsString()
  guestPhone: string;

  @ApiProperty({ description: 'Check-in date', example: '2024-12-01T14:00:00.000Z' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-12-05T11:00:00.000Z' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ description: 'Number of guests', example: 2 })
  @IsNumber()
  numberOfGuests: number;

  @ApiProperty({ description: 'Total price', example: 200 })
  @IsNumber()
  totalPrice: number;

  @ApiPropertyOptional({ 
    description: 'Booking status', 
    enum: ['confirmed', 'pending', 'cancelled'],
    example: 'pending'
  })
  @IsOptional()
  @IsEnum(['confirmed', 'pending', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({ 
    description: 'Payment status', 
    enum: ['paid', 'pending', 'refunded'],
    example: 'pending'
  })
  @IsOptional()
  @IsEnum(['paid', 'pending', 'refunded'])
  paymentStatus?: string;

  @ApiPropertyOptional({ description: 'Special requests', example: 'Late check-in' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ description: 'Booking reference', example: 'BK-2024-001' })
  @IsOptional()
  @IsString()
  bookingReference?: string;
}
