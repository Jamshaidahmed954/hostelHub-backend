import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RoomDto {
  @IsString()
  roomNumber: string;

  @IsString()
  type: string;

  @IsNumber()
  capacity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}

export class RegisterHostelDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  area: string;

  @IsNumber()
  capacity: number;

  @IsNumber()
  price: number;

  @IsString()
  owner: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  rooms?: RoomDto[];
}
