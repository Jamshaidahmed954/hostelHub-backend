import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { RegisterBookingDto } from './dto/register-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  const mockBookingService = {
    createBooking: jest.fn(),
    getAllBookings: jest.fn(),
    getBookingById: jest.fn(),
    getBookingsByHostel: jest.fn(),
    getBookingsByGuestEmail: jest.fn(),
    updateBooking: jest.fn(),
    cancelBooking: jest.fn(),
    confirmBooking: jest.fn(),
    deleteBooking: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBooking', () => {
    it('should create a new booking', async () => {
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
      const result = { id: '1', ...dto };

      mockBookingService.createBooking.mockResolvedValue(result);

      expect(await controller.createBooking(dto)).toBe(result);
      expect(mockBookingService.createBooking).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllBookings', () => {
    it('should return all bookings', async () => {
      const result = [
        { id: '1', guestName: 'John Doe' },
        { id: '2', guestName: 'Jane Smith' },
      ];

      mockBookingService.getAllBookings.mockResolvedValue(result);

      expect(await controller.getAllBookings()).toBe(result);
      expect(mockBookingService.getAllBookings).toHaveBeenCalled();
    });
  });

  describe('getBooking', () => {
    it('should return a booking by id', async () => {
      const result = { id: '1', guestName: 'John Doe' };

      mockBookingService.getBookingById.mockResolvedValue(result);

      expect(await controller.getBooking('1')).toBe(result);
      expect(mockBookingService.getBookingById).toHaveBeenCalledWith('1');
    });
  });

  describe('getBookingsByHostel', () => {
    it('should return bookings by hostel', async () => {
      const result = [{ id: '1', guestName: 'John Doe' }];

      mockBookingService.getBookingsByHostel.mockResolvedValue(result);

      expect(await controller.getBookingsByHostel('hostel123')).toBe(result);
      expect(mockBookingService.getBookingsByHostel).toHaveBeenCalledWith(
        'hostel123',
      );
    });
  });

  describe('getBookingsByGuest', () => {
    it('should return bookings by guest email', async () => {
      const result = [{ id: '1', guestName: 'John Doe' }];

      mockBookingService.getBookingsByGuestEmail.mockResolvedValue(result);

      expect(await controller.getBookingsByGuest('john@example.com')).toBe(
        result,
      );
      expect(mockBookingService.getBookingsByGuestEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
    });
  });

  describe('updateBooking', () => {
    it('should update a booking', async () => {
      const dto: UpdateBookingDto = { guestName: 'Updated Name' };
      const result = { id: '1', guestName: 'Updated Name' };

      mockBookingService.updateBooking.mockResolvedValue(result);

      expect(await controller.updateBooking('1', dto)).toBe(result);
      expect(mockBookingService.updateBooking).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', async () => {
      const result = { id: '1', status: 'cancelled' };

      mockBookingService.cancelBooking.mockResolvedValue(result);

      expect(await controller.cancelBooking('1')).toBe(result);
      expect(mockBookingService.cancelBooking).toHaveBeenCalledWith('1');
    });
  });

  describe('confirmBooking', () => {
    it('should confirm a booking', async () => {
      const result = { id: '1', status: 'confirmed' };

      mockBookingService.confirmBooking.mockResolvedValue(result);

      expect(await controller.confirmBooking('1')).toBe(result);
      expect(mockBookingService.confirmBooking).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking', async () => {
      const result = { id: '1', guestName: 'Deleted Booking' };

      mockBookingService.deleteBooking.mockResolvedValue(result);

      expect(await controller.deleteBooking('1')).toBe(result);
      expect(mockBookingService.deleteBooking).toHaveBeenCalledWith('1');
    });
  });
});
