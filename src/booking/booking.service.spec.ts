import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';
import { Hostel } from '../hostel/hostel.schema';
import { RegisterBookingDto } from './dto/register-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

describe('BookingService', () => {
  let service: BookingService;
  let bookingModel: any;
  let hostelModel: any;

  const mockBooking = {
    hostelId: '507f1f77bcf86cd799439011',
    roomNumber: '101',
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    guestPhone: '+1234567890',
    checkInDate: new Date('2025-11-01'),
    checkOutDate: new Date('2025-11-03'),
    numberOfGuests: 2,
    totalPrice: 150,
    status: 'confirmed',
    paymentStatus: 'paid',
  };

  const mockBookingModel = {
    new: jest.fn().mockResolvedValue(mockBooking),
    constructor: jest.fn().mockResolvedValue(mockBooking),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  const mockHostelModel = {
    findById: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getModelToken(Booking.name),
          useValue: mockBookingModel,
        },
        {
          provide: getModelToken(Hostel.name),
          useValue: mockHostelModel,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingModel = module.get(getModelToken(Booking.name));
    hostelModel = module.get(getModelToken(Hostel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBooking', () => {
    it('should create and save a new booking when room is available', async () => {
      const dto: RegisterBookingDto = {
        hostelId: '507f1f77bcf86cd799439011',
        roomNumber: '101',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        checkInDate: '2025-11-01',
        checkOutDate: '2025-11-03',
        numberOfGuests: 2,
        totalPrice: 150,
      };

      const mockHostel = {
        _id: '507f1f77bcf86cd799439011',
        rooms: [
          {
            roomNumber: '101',
            available: true,
            type: 'double',
            capacity: 2,
            price: 75,
          },
        ],
      };

      mockHostelModel.findById.mockResolvedValue(mockHostel);
      mockBookingModel.save.mockResolvedValue(mockBooking);

      const result = await service.createBooking(dto);

      expect(result).toEqual(mockBooking);
      expect(mockHostelModel.findById).toHaveBeenCalledWith(dto.hostelId);
    });

    it('should throw error when hostel is not found', async () => {
      const dto: RegisterBookingDto = {
        hostelId: '507f1f77bcf86cd799439011',
        roomNumber: '101',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        checkInDate: '2025-11-01',
        checkOutDate: '2025-11-03',
        numberOfGuests: 2,
        totalPrice: 150,
      };

      mockHostelModel.findById.mockResolvedValue(null);

      await expect(service.createBooking(dto)).rejects.toThrow(
        'Hostel not found',
      );
    });

    it('should throw error when room is not found', async () => {
      const dto: RegisterBookingDto = {
        hostelId: '507f1f77bcf86cd799439011',
        roomNumber: '999',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        checkInDate: '2025-11-01',
        checkOutDate: '2025-11-03',
        numberOfGuests: 2,
        totalPrice: 150,
      };

      const mockHostel = {
        _id: '507f1f77bcf86cd799439011',
        rooms: [
          {
            roomNumber: '101',
            available: true,
          },
        ],
      };

      mockHostelModel.findById.mockResolvedValue(mockHostel);

      await expect(service.createBooking(dto)).rejects.toThrow(
        'Room not found in this hostel',
      );
    });

    it('should return message when room is not available', async () => {
      const dto: RegisterBookingDto = {
        hostelId: '507f1f77bcf86cd799439011',
        roomNumber: '101',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        checkInDate: '2025-11-01',
        checkOutDate: '2025-11-03',
        numberOfGuests: 2,
        totalPrice: 150,
      };

      const mockHostel = {
        _id: '507f1f77bcf86cd799439011',
        rooms: [
          {
            roomNumber: '101',
            available: false, // Room not available
          },
        ],
      };

      mockHostelModel.findById.mockResolvedValue(mockHostel);

      const result = await service.createBooking(dto);

      expect(result).toEqual({ message: 'not available' });
    });
  });

  describe('getAllBookings', () => {
    it('should return all bookings', async () => {
      const bookings = [mockBooking];
      mockBookingModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(bookings),
      });

      const result = await service.getAllBookings();

      expect(result).toEqual(bookings);
      expect(mockBookingModel.find).toHaveBeenCalled();
    });
  });

  describe('getBookingById', () => {
    it('should return a booking by id', async () => {
      mockBookingModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBooking),
      });

      const result = await service.getBookingById('1');

      expect(result).toEqual(mockBooking);
      expect(mockBookingModel.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('getBookingsByHostel', () => {
    it('should return bookings by hostel', async () => {
      const bookings = [mockBooking];
      mockBookingModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(bookings),
      });

      const result = await service.getBookingsByHostel('hostel123');

      expect(result).toEqual(bookings);
      expect(mockBookingModel.find).toHaveBeenCalledWith({
        hostelId: 'hostel123',
      });
    });
  });

  describe('getBookingsByGuestEmail', () => {
    it('should return bookings by guest email', async () => {
      const bookings = [mockBooking];
      mockBookingModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(bookings),
      });

      const result = await service.getBookingsByGuestEmail('john@example.com');

      expect(result).toEqual(bookings);
      expect(mockBookingModel.find).toHaveBeenCalledWith({
        guestEmail: 'john@example.com',
      });
    });
  });

  describe('updateBooking', () => {
    it('should update a booking', async () => {
      const dto: UpdateBookingDto = { guestName: 'Updated Name' };
      const updatedBooking = { ...mockBooking, guestName: 'Updated Name' };

      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedBooking),
      });

      const result = await service.updateBooking('1', dto);

      expect(result).toEqual(updatedBooking);
      expect(mockBookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        dto,
        { new: true },
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking and make room available again', async () => {
      const cancelledBooking = {
        ...mockBooking,
        status: 'cancelled',
        paymentStatus: 'refunded',
      };

      // Mock finding the booking first
      mockBookingModel.findById.mockResolvedValue(mockBooking);

      // Mock hostel update
      mockHostelModel.updateOne.mockResolvedValue({});

      // Mock the final update
      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(cancelledBooking),
      });

      const result = await service.cancelBooking('1');

      expect(result).toEqual(cancelledBooking);
      expect(mockBookingModel.findById).toHaveBeenCalledWith('1');
      expect(mockHostelModel.updateOne).toHaveBeenCalledWith(
        {
          _id: mockBooking.hostelId,
          'rooms.roomNumber': mockBooking.roomNumber,
        },
        { $set: { 'rooms.$.available': true } },
      );
      expect(mockBookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { status: 'cancelled', paymentStatus: 'refunded' },
        { new: true },
      );
    });
  });

  describe('confirmBooking', () => {
    it('should confirm a booking and update room availability', async () => {
      const confirmedBooking = {
        ...mockBooking,
        status: 'confirmed',
        paymentStatus: 'paid',
      };

      // Mock finding the booking first
      mockBookingModel.findById.mockResolvedValue(mockBooking);

      // Mock hostel update
      mockHostelModel.updateOne.mockResolvedValue({});

      // Mock the final update
      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(confirmedBooking),
      });

      const result = await service.confirmBooking('1');

      expect(result).toEqual(confirmedBooking);
      expect(mockBookingModel.findById).toHaveBeenCalledWith('1');
      expect(mockHostelModel.updateOne).toHaveBeenCalledWith(
        {
          _id: mockBooking.hostelId,
          'rooms.roomNumber': mockBooking.roomNumber,
        },
        { $set: { 'rooms.$.available': false } },
      );
      expect(mockBookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { status: 'confirmed', paymentStatus: 'paid' },
        { new: true },
      );
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking', async () => {
      mockBookingModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBooking),
      });

      const result = await service.deleteBooking('1');

      expect(result).toEqual(mockBooking);
      expect(mockBookingModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
