import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterHostelDto {
  @ApiProperty({ description: 'Hostel name', example: 'Grand Hostel' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Hostel location', example: 'Downtown' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Hostel address', example: '123 Main St' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Area', example: 'Manhattan' })
  @IsString()
  area: string;

  @ApiProperty({ description: 'Total capacity', example: 50 })
  @IsNumber()
  capacity: number;

  @ApiProperty({ description: 'Starting price per night', example: 30 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Owner ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  owner: string;

  @ApiPropertyOptional({ description: 'Hostel description', example: 'Modern hostel with great amenities' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Hostel amenities', example: ['WiFi', 'Parking', 'Breakfast'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Contact information', example: '+1234567890' })
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @ApiPropertyOptional({ description: 'Hostel images URLs', example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
