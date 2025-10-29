import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterHostelDto } from './dto/register-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { Hostel, HostelDocument } from './hostel.schema';

@Injectable()
export class HostelService {
  constructor(
    @InjectModel(Hostel.name) private hostelModel: Model<HostelDocument>,
  ) {}

  async registerHostel(dto: RegisterHostelDto): Promise<Hostel> {
    const newHostel = new this.hostelModel(dto);
    return newHostel.save();
  }

  async getHostelById(id: string): Promise<Hostel | null> {
    return this.hostelModel.findById(id).exec();
  }

  async updateHostel(id: string, dto: UpdateHostelDto): Promise<Hostel | null> {
    return this.hostelModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async getAllHostels(): Promise<Hostel[]> {
    return this.hostelModel.find().exec();
  }

  async deleteHostel(id: string): Promise<Hostel | null> {
    return this.hostelModel.findByIdAndDelete(id).exec();
  }
}
