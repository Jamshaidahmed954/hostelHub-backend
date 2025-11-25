import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create a new room',
    description: 'First fetch hostels from GET /hostel/dropdown/list, select hostel from dropdown, then pass the hostelId to create room'
  })
  @ApiResponse({ status: 201, description: 'Room successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - Room already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiQuery({ name: 'hostelId', required: false, description: 'Filter by hostel ID' })
  @ApiQuery({ name: 'available', required: false, description: 'Filter by availability', type: Boolean })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  async getAllRooms(
    @Query('hostelId') hostelId?: string,
    @Query('available') available?: string,
  ) {
    const availableBool = available === 'true' ? true : available === 'false' ? false : undefined;
    return this.roomsService.getAllRooms(hostelId, availableBool);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search rooms with filters' })
  @ApiQuery({ name: 'hostelId', required: false, description: 'Filter by hostel ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price', type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price', type: Number })
  @ApiQuery({ name: 'type', required: false, description: 'Room type' })
  @ApiQuery({ name: 'minCapacity', required: false, description: 'Minimum capacity', type: Number })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  async searchRooms(
    @Query('hostelId') hostelId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('type') type?: string,
    @Query('minCapacity') minCapacity?: number,
  ) {
    return this.roomsService.searchRooms(
      hostelId,
      minPrice ? +minPrice : undefined,
      maxPrice ? +maxPrice : undefined,
      type,
      minCapacity ? +minCapacity : undefined,
    );
  }

  @Get('hostel/:hostelId')
  @ApiOperation({ summary: 'Get all rooms by hostel ID' })
  @ApiParam({ name: 'hostelId', description: 'Hostel ID' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  async getRoomsByHostel(@Param('hostelId') hostelId: string) {
    return this.roomsService.getRoomsByHostel(hostelId);
  }

  @Get('hostel/:hostelId/available')
  @ApiOperation({ summary: 'Get available rooms by hostel ID' })
  @ApiParam({ name: 'hostelId', description: 'Hostel ID' })
  @ApiResponse({ status: 200, description: 'Available rooms retrieved successfully' })
  async getAvailableRoomsByHostel(@Param('hostelId') hostelId: string) {
    return this.roomsService.getAvailableRoomsByHostel(hostelId);
  }

  @Get('hostel/:hostelId/type/:type')
  @ApiOperation({ summary: 'Get rooms by hostel ID and type' })
  @ApiParam({ name: 'hostelId', description: 'Hostel ID' })
  @ApiParam({ name: 'type', description: 'Room type' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  async getRoomsByType(
    @Param('hostelId') hostelId: string,
    @Param('type') type: string,
  ) {
    return this.roomsService.getRoomsByType(hostelId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getRoomById(@Param('id') id: string) {
    return this.roomsService.getRoomById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update room information' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  @Put(':id/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update room availability' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiQuery({ name: 'available', required: true, description: 'Availability status', type: Boolean })
  @ApiResponse({ status: 200, description: 'Room availability updated successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateRoomAvailability(
    @Param('id') id: string,
    @Query('available') available: string,
  ) {
    const availableBool = available === 'true';
    return this.roomsService.updateRoomAvailability(id, availableBool);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteRoom(@Param('id') id: string) {
    return this.roomsService.deleteRoom(id);
  }

  @Delete('hostel/:hostelId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete all rooms by hostel ID' })
  @ApiParam({ name: 'hostelId', description: 'Hostel ID' })
  @ApiResponse({ status: 200, description: 'Rooms deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteRoomsByHostel(@Param('hostelId') hostelId: string) {
    return this.roomsService.deleteRoomsByHostel(hostelId);
  }
}
