import { Test, TestingModule } from '@nestjs/testing';
import { HostelController } from './hostel.controller';
import { HostelService } from './hostel.service';
import { RegisterHostelDto } from './dto/register-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';

describe('HostelController', () => {
  let controller: HostelController;
  let service: HostelService;

  const mockHostelService = {
    registerHostel: jest.fn(),
    getAllHostels: jest.fn(),
    getHostelById: jest.fn(),
    updateHostel: jest.fn(),
    deleteHostel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostelController],
      providers: [
        {
          provide: HostelService,
          useValue: mockHostelService,
        },
      ],
    }).compile();

    controller = module.get<HostelController>(HostelController);
    service = module.get<HostelService>(HostelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerHostel', () => {
    it('should register a new hostel', async () => {
      const dto: RegisterHostelDto = {
        name: 'Test Hostel',
        address: '123 Test St',
        city: 'Test City',
        area: 'Test Area',
        capacity: 50,
        owner: 'Test Owner',
      };
      const result = { id: '1', ...dto };

      mockHostelService.registerHostel.mockResolvedValue(result);

      expect(await controller.registerHostel(dto)).toBe(result);
      expect(mockHostelService.registerHostel).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllHostels', () => {
    it('should return all hostels', async () => {
      const result = [
        { id: '1', name: 'Hostel 1' },
        { id: '2', name: 'Hostel 2' },
      ];

      mockHostelService.getAllHostels.mockResolvedValue(result);

      expect(await controller.getAllHostels()).toBe(result);
      expect(mockHostelService.getAllHostels).toHaveBeenCalled();
    });
  });

  describe('getHostel', () => {
    it('should return a hostel by id', async () => {
      const result = { id: '1', name: 'Test Hostel' };

      mockHostelService.getHostelById.mockResolvedValue(result);

      expect(await controller.getHostel('1')).toBe(result);
      expect(mockHostelService.getHostelById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateHostel', () => {
    it('should update a hostel', async () => {
      const dto: UpdateHostelDto = { name: 'Updated Hostel' };
      const result = { id: '1', name: 'Updated Hostel' };

      mockHostelService.updateHostel.mockResolvedValue(result);

      expect(await controller.updateHostel('1', dto)).toBe(result);
      expect(mockHostelService.updateHostel).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('deleteHostel', () => {
    it('should delete a hostel', async () => {
      const result = { id: '1', name: 'Deleted Hostel' };

      mockHostelService.deleteHostel.mockResolvedValue(result);

      expect(await controller.deleteHostel('1')).toBe(result);
      expect(mockHostelService.deleteHostel).toHaveBeenCalledWith('1');
    });
  });
});
