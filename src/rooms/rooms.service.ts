import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from './room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    // Check if room number already exists in this hostel
    const existingRoom = await this.roomModel.findOne({
      hostelId: createRoomDto.hostelId,
      roomNumber: createRoomDto.roomNumber,
    });

    if (existingRoom) {
      throw new BadRequestException(
        `Room ${createRoomDto.roomNumber} already exists in this hostel`,
      );
    }

    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  async getAllRooms(hostelId?: string, available?: boolean): Promise<Room[]> {
    const filter: any = {};

    if (hostelId) {
      filter.hostelId = new Types.ObjectId(hostelId);
    }

    if (available !== undefined) {
      filter.available = available;
    }

    return this.roomModel
      .find(filter)
      .populate('hostelId', 'name location city')
      .exec();
  }

  async getRoomById(id: string): Promise<Room> {
    const room = await this.roomModel
      .findById(id)
      .populate('hostelId', 'name location city address')
      .exec();

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async getRoomsByHostel(hostelId: string): Promise<Room[]> {
    return this.roomModel
      .find({ hostelId: new Types.ObjectId(hostelId) })
      .exec();
  }

  async getAvailableRoomsByHostel(hostelId: string): Promise<Room[]> {
    return this.roomModel
      .find({ hostelId: new Types.ObjectId(hostelId), available: true })
      .exec();
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    // If updating room number, check for duplicates
    if (updateRoomDto.roomNumber) {
      const room = await this.roomModel.findById(id);
      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      const existingRoom = await this.roomModel.findOne({
        hostelId: room.hostelId,
        roomNumber: updateRoomDto.roomNumber,
        _id: { $ne: id },
      });

      if (existingRoom) {
        throw new BadRequestException(
          `Room ${updateRoomDto.roomNumber} already exists in this hostel`,
        );
      }
    }

    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .populate('hostelId', 'name location city')
      .exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return updatedRoom;
  }

  async updateRoomAvailability(id: string, available: boolean): Promise<Room> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, { available }, { new: true })
      .exec();

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async deleteRoom(id: string): Promise<Room> {
    const room = await this.roomModel.findByIdAndDelete(id).exec();

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async deleteRoomsByHostel(hostelId: string): Promise<{ deletedCount: number }> {
    const result = await this.roomModel
      .deleteMany({ hostelId: new Types.ObjectId(hostelId) })
      .exec();

    return { deletedCount: result.deletedCount || 0 };
  }

  async getRoomsByType(hostelId: string, type: string): Promise<Room[]> {
    return this.roomModel
      .find({ hostelId: new Types.ObjectId(hostelId), type })
      .exec();
  }

  async searchRooms(
    hostelId?: string,
    minPrice?: number,
    maxPrice?: number,
    type?: string,
    minCapacity?: number,
  ): Promise<Room[]> {
    const filter: any = {};

    if (hostelId) {
      filter.hostelId = new Types.ObjectId(hostelId);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (type) {
      filter.type = type;
    }

    if (minCapacity !== undefined) {
      filter.capacity = { $gte: minCapacity };
    }

    return this.roomModel
      .find(filter)
      .populate('hostelId', 'name location city')
      .exec();
  }
}
