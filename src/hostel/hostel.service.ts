import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { RegisterHostelDto } from './dto/register-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { Hostel, HostelDocument } from './hostel.schema';
import { Room, RoomDocument } from '../rooms/room.schema';

interface HostelFilters {
  owner?: string;
  city?: string;
  search?: string;
}

@Injectable()
export class HostelService {
  constructor(
    @InjectModel(Hostel.name) private hostelModel: Model<HostelDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async registerHostel(dto: RegisterHostelDto): Promise<Hostel> {
    const newHostel = new this.hostelModel({
      ...dto,
      amenities: dto.amenities ?? [],
      images: dto.images ?? [],
    });
    return newHostel.save();
  }

  async getHostelById(id: string): Promise<Hostel | null> {
    return this.hostelModel.findById(id).exec();
  }

  async updateHostel(id: string, dto: UpdateHostelDto): Promise<Hostel | null> {
    return this.hostelModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async getHostels(filters?: HostelFilters): Promise<any[]> {
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

    // Use .lean() to get plain objects, then fetch rooms in batch and attach
    const hostels = await this.hostelModel.find(query).sort({ createdAt: -1 }).lean().exec();

    if (!hostels || hostels.length === 0) return hostels;

    const hostelIds = hostels.map((h: any) => new Types.ObjectId(h._id));

    const rooms = await this.roomModel.find({ hostelId: { $in: hostelIds } }).lean().exec();

    const roomsByHostel: Record<string, any[]> = {};
    for (const r of rooms) {
      const hid = r.hostelId ? r.hostelId.toString() : '';
      if (!roomsByHostel[hid]) roomsByHostel[hid] = [];
      roomsByHostel[hid].push(r);
    }

    return hostels.map((h: any) => ({
      ...h,
      rooms: roomsByHostel[h._id.toString()] || [],
    }));
  }

  async deleteHostel(id: string): Promise<Hostel | null> {
    return this.hostelModel.findByIdAndDelete(id).exec();
  }

  async getHostelsForDropdown(owner?: string) {
    const query: FilterQuery<HostelDocument> = {};
    
    if (owner) {
      query.owner = owner;
    }

    return this.hostelModel
      .find(query)
      .select('_id name city area location')
      .sort({ name: 1 })
      .exec();
  }
}
