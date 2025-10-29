import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HostelService } from './hostel.service';
import { Hostel } from './hostel.schema';
import { RegisterHostelDto } from './dto/register-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';

describe('HostelService', () => {
  let service: HostelService;
  let model: any;

  const mockHostel = {
    name: 'Test Hostel',
    address: '123 Test St',
    city: 'Test City',
    area: 'Test Area',
    capacity: 50,
    owner: 'Test Owner',
  };

  const mockHostelModel = {
    new: jest.fn().mockResolvedValue(mockHostel),
    constructor: jest.fn().mockResolvedValue(mockHostel),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HostelService,
        {
          provide: getModelToken(Hostel.name),
          useValue: mockHostelModel,
        },
      ],
    }).compile();

    service = module.get<HostelService>(HostelService);
    model = module.get(getModelToken(Hostel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerHostel', () => {
    it('should create and save a new hostel', async () => {
      const dto: RegisterHostelDto = mockHostel;
      mockHostelModel.save.mockResolvedValue(mockHostel);

      const result = await service.registerHostel(dto);

      expect(result).toEqual(mockHostel);
      expect(mockHostelModel.new).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllHostels', () => {
    it('should return all hostels', async () => {
      const hostels = [mockHostel];
      mockHostelModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(hostels),
      });

      const result = await service.getAllHostels();

      expect(result).toEqual(hostels);
      expect(mockHostelModel.find).toHaveBeenCalled();
    });
  });

  describe('getHostelById', () => {
    it('should return a hostel by id', async () => {
      mockHostelModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockHostel),
      });

      const result = await service.getHostelById('1');

      expect(result).toEqual(mockHostel);
      expect(mockHostelModel.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateHostel', () => {
    it('should update a hostel', async () => {
      const dto: UpdateHostelDto = { name: 'Updated Hostel' };
      const updatedHostel = { ...mockHostel, name: 'Updated Hostel' };

      mockHostelModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedHostel),
      });

      const result = await service.updateHostel('1', dto);

      expect(result).toEqual(updatedHostel);
      expect(mockHostelModel.findByIdAndUpdate).toHaveBeenCalledWith('1', dto, {
        new: true,
      });
    });
  });

  describe('deleteHostel', () => {
    it('should delete a hostel', async () => {
      mockHostelModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockHostel),
      });

      const result = await service.deleteHostel('1');

      expect(result).toEqual(mockHostel);
      expect(mockHostelModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
