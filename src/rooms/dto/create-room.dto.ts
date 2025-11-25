import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ description: 'Hostel ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  hostelId: string;

  @ApiProperty({ description: 'Room number', example: '101' })
  @IsString()
  roomNumber: string;

  @ApiProperty({ description: 'Room type', example: 'Single' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Room capacity', example: 2 })
  @IsNumber()
  capacity: number;

  @ApiProperty({ description: 'Room price per night', example: 50 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Room availability', example: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({ description: 'Room description', example: 'Spacious room with city view' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Room amenities', example: ['WiFi', 'AC', 'TV'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Floor number', example: 1 })
  @IsOptional()
  @IsNumber()
  floor?: number;

  @ApiPropertyOptional({ description: 'Room images URLs', example: ['https://example.com/room1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
