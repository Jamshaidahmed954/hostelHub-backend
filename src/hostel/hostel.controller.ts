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

import { RegisterHostelDto } from './dto/register-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { HostelService } from './hostel.service';

@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Post('register')
  async registerHostel(@Body() registerHostelDto: RegisterHostelDto) {
    return this.hostelService.registerHostel(registerHostelDto);
  }

  @Get()
  async getAllHostels(
    @Query('owner') owner?: string,
    @Query('city') city?: string,
    @Query('search') search?: string,
  ) {
    return this.hostelService.getHostels({ owner, city, search });
  }

  @Get(':id')
  async getHostel(@Param('id') id: string) {
    return this.hostelService.getHostelById(id);
  }

  @Put(':id')
  async updateHostel(
    @Param('id') id: string,
    @Body() updateHostelDto: UpdateHostelDto,
  ) {
    return this.hostelService.updateHostel(id, updateHostelDto);
  }

  @Delete(':id')
  async deleteHostel(@Param('id') id: string) {
    return this.hostelService.deleteHostel(id);
  }
}
