import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { HostelService } from './hostel.service';
import { RegisterHostelDto } from './dto/register-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';

@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Post('register')
  async registerHostel(@Body() registerHostelDto: RegisterHostelDto) {
    return this.hostelService.registerHostel(registerHostelDto);
  }

  @Get()
  async getAllHostels() {
    return this.hostelService.getAllHostels();
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
