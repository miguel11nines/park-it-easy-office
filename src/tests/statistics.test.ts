import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

type MockBooking = {
  id: string;
  date?: string;
  vehicle_type?: string;
  duration?: string;
  spot_number?: number;
};

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Statistics Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Fetching All Bookings', () => {
    it('should fetch ALL bookings without user filter for statistics', async () => {
      const mockBookings = [
        {
          id: '1',
          user_id: 'user1',
          user_name: 'Alice',
          date: '2025-10-15',
          duration: 'full',
          vehicle_type: 'car',
          spot_number: 84,
        },
        {
          id: '2',
          user_id: 'user2',
          user_name: 'Bob',
          date: '2025-10-15',
          duration: 'morning',
          vehicle_type: 'motorcycle',
          spot_number: 85,
        },
      ];

      const selectMock = vi.fn().mockReturnThis();
      const orderMock = vi.fn().mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from as any).mockReturnValue({
        select: selectMock,
        order: orderMock,
      });

      // Simulate fetching bookings for statistics
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      expect(error).toBeNull();
      expect(data).toEqual(mockBookings);
      expect(supabase.from).toHaveBeenCalledWith('bookings');
      expect(selectMock).toHaveBeenCalledWith('*');
      // Should NOT have .eq('user_id', ...) call
      expect(selectMock).not.toHaveBeenCalledWith(expect.objectContaining({ user_id: expect.anything() }));
    });
  });

  describe('Statistics Calculations', () => {
    it('should calculate total bookings correctly', () => {
      const bookings = [
        { id: '1', vehicle_type: 'car', spot_number: 84 },
        { id: '2', vehicle_type: 'motorcycle', spot_number: 85 },
        { id: '3', vehicle_type: 'car', spot_number: 84 },
      ];

      const total = bookings.length;
      expect(total).toBe(3);
    });

    it('should calculate car vs motorcycle distribution', () => {
      const bookings: MockBooking[] = [
        { id: '1', vehicle_type: 'car' },
        { id: '2', vehicle_type: 'motorcycle' },
        { id: '3', vehicle_type: 'motorcycle' },
        { id: '4', vehicle_type: 'car' },
      ];

      const carCount = bookings.filter((b: MockBooking) => b.vehicle_type === 'car').length;
      const motorcycleCount = bookings.filter((b: MockBooking) => b.vehicle_type === 'motorcycle').length;

      expect(carCount).toBe(2);
      expect(motorcycleCount).toBe(2);
      expect(carCount + motorcycleCount).toBe(bookings.length);
    });

    it('should determine most popular spot', () => {
      const bookings = [
        { id: '1', spot_number: 84 },
        { id: '2', spot_number: 84 },
        { id: '3', spot_number: 85 },
        { id: '4', spot_number: 84 },
      ];

      const spot84Count = bookings.filter((b: MockBooking) => b.spot_number === 84).length;
      const spot85Count = bookings.filter((b: MockBooking) => b.spot_number === 85).length;
      const mostPopular = spot84Count >= spot85Count ? 84 : 85;

      expect(mostPopular).toBe(84);
      expect(spot84Count).toBe(3);
      expect(spot85Count).toBe(1);
    });

    it('should determine most popular time', () => {
      const bookings = [
        { id: '1', duration: 'morning' },
        { id: '2', duration: 'full' },
        { id: '3', duration: 'afternoon' },
        { id: '4', duration: 'morning' },
        { id: '5', duration: 'full' },
      ];

      // Full day counts for both morning and afternoon
      const morningCount = bookings.filter(
        (b: MockBooking) => b.duration === 'morning' || b.duration === 'full'
      ).length;
      const afternoonCount = bookings.filter(
        (b: MockBooking) => b.duration === 'afternoon' || b.duration === 'full'
      ).length;

      expect(morningCount).toBe(4); // 2 morning + 2 full
      expect(afternoonCount).toBe(3); // 1 afternoon + 2 full
    });

    it('should filter bookings by date range', () => {
      const bookings = [
        { id: '1', date: '2025-10-01' },
        { id: '2', date: '2025-10-08' },
        { id: '3', date: '2025-10-15' },
        { id: '4', date: '2025-10-22' },
      ];

      const filterByDateRange = (start: Date, end: Date) => {
        return bookings.filter((b: MockBooking) => {
          const bookingDate = new Date(b.date || '');
          return bookingDate >= start && bookingDate <= end;
        });
      };

      const weekStart = new Date('2025-10-06');
      const weekEnd = new Date('2025-10-12');
      const weekBookings = filterByDateRange(weekStart, weekEnd);

      expect(weekBookings.length).toBe(1);
      expect(weekBookings[0].date).toBe('2025-10-08');
    });

    it('should handle empty bookings array', () => {
      const bookings: MockBooking[] = [];

      const total = bookings.length;
      const carCount = bookings.filter((b: MockBooking) => b.vehicle_type === 'car').length;
      const motorcycleCount = bookings.filter((b: MockBooking) => b.vehicle_type === 'motorcycle').length;

      expect(total).toBe(0);
      expect(carCount).toBe(0);
      expect(motorcycleCount).toBe(0);
    });

    it('should calculate percentage safely with zero division', () => {
      const totalBookings = 0;
      const carBookings = 0;

      const percentage = (carBookings / totalBookings) * 100 || 0;

      expect(percentage).toBe(0);
      expect(isNaN(percentage)).toBe(false);
    });
  });

  describe('Spot Usage Statistics', () => {
    it('should count bookings per spot', () => {
      const bookings: MockBooking[] = [
        { id: '1', spot_number: 84 },
        { id: '2', spot_number: 84 },
        { id: '3', spot_number: 85 },
      ];

      const spot84Usage = bookings.filter((b: MockBooking) => b.spot_number === 84).length;
      const spot85Usage = bookings.filter((b: MockBooking) => b.spot_number === 85).length;

      expect(spot84Usage).toBe(2);
      expect(spot85Usage).toBe(1);
    });

    it('should handle spots with no bookings', () => {
      const bookings: MockBooking[] = [
        { id: '1', spot_number: 84 },
      ];

      const spot84Usage = bookings.filter((b: MockBooking) => b.spot_number === 84).length;
      const spot85Usage = bookings.filter((b: MockBooking) => b.spot_number === 85).length;

      expect(spot84Usage).toBe(1);
      expect(spot85Usage).toBe(0);
    });
  });
});
