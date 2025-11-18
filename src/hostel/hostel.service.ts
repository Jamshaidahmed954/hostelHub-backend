import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { RegisterHostelDto } from './dto/register-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { Hostel, HostelDocument } from './hostel.schema';

interface HostelFilters {
  owner?: string;
  city?: string;
  search?: string;
}

@Injectable()
export class HostelService {
  constructor(
    @InjectModel(Hostel.name) private hostelModel: Model<HostelDocument>,
  ) {}

  async registerHostel(dto: RegisterHostelDto): Promise<Hostel> {
    const newHostel = new this.hostelModel({
      ...dto,
      amenities: dto.amenities ?? [],
      images: dto.images ?? [],
      rooms: dto.rooms ?? [],
    });
    return newHostel.save();
  }

  async getHostelById(id: string): Promise<Hostel | null> {
    return this.hostelModel.findById(id).exec();
  }

  async updateHostel(id: string, dto: UpdateHostelDto): Promise<Hostel | null> {
    return this.hostelModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async getHostels(filters?: HostelFilters): Promise<Hostel[]> {
    const query: FilterQuery<HostelDocument> = {};

    if (filters?.owner) {
      query.owner = filters.owner;
    }
    if (filters?.city) {
      query.city = filters.city;
    }
    if (filters?.search) {
      const regex = new RegExp(filters.search, 'i');
      query.$or = [
        { name: regex },
        { location: regex },
        { city: regex },
        { area: regex },
        { description: regex },
      ];
    }

    return this.hostelModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async deleteHostel(id: string): Promise<Hostel | null> {
    return this.hostelModel.findByIdAndDelete(id).exec();
  }
}
