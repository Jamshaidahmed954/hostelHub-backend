import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { RegisterHostelDto } from './dto/register-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { HostelService } from './hostel.service';

@ApiTags('hostels')
@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new hostel' })
  @ApiResponse({ status: 201, description: 'Hostel successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async registerHostel(@Body() registerHostelDto: RegisterHostelDto) {
    return this.hostelService.registerHostel(registerHostelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all hostels' })
  @ApiQuery({ name: 'owner', required: false, description: 'Filter by owner ID' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Hostels retrieved successfully' })
  async getAllHostels(
    @Query('owner') owner?: string,
    @Query('city') city?: string,
    @Query('search') search?: string,
  ) {
    return this.hostelService.getHostels({ owner, city, search });
  }

  @Get('dropdown/list')
  @ApiOperation({ summary: 'Get hostels list for dropdown (id, name, city only)' })
  @ApiQuery({ name: 'owner', required: false, description: 'Filter by owner ID' })
  @ApiResponse({ status: 200, description: 'Hostels list retrieved successfully' })
  async getHostelsDropdown(@Query('owner') owner?: string) {
    return this.hostelService.getHostelsForDropdown(owner);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hostel by ID' })
  @ApiParam({ name: 'id', description: 'Hostel ID' })
  @ApiResponse({ status: 200, description: 'Hostel retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Hostel not found' })
  async getHostel(@Param('id') id: string) {
    return this.hostelService.getHostelById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update hostel information' })
  @ApiParam({ name: 'id', description: 'Hostel ID' })
  @ApiResponse({ status: 200, description: 'Hostel updated successfully' })
  @ApiResponse({ status: 404, description: 'Hostel not found' })
  async updateHostel(
    @Param('id') id: string,
    @Body() updateHostelDto: UpdateHostelDto,
  ) {
    return this.hostelService.updateHostel(id, updateHostelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete hostel' })
  @ApiParam({ name: 'id', description: 'Hostel ID' })
  @ApiResponse({ status: 200, description: 'Hostel deleted successfully' })
  @ApiResponse({ status: 404, description: 'Hostel not found' })
  async deleteHostel(@Param('id') id: string) {
    return this.hostelService.deleteHostel(id);
  }
}
