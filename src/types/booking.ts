/**
 * Shared Booking Types
 * Central location for all booking-related type definitions
 */

export type Duration = "morning" | "afternoon" | "full";
export type VehicleType = "car" | "motorcycle";

export interface Booking {
  id: string;
  date: string;
  duration: Duration;
  vehicleType: VehicleType;
  userName: string;
  spotNumber: number;
}

export interface CreateBookingData {
  date: string;
  duration: Duration;
  vehicleType: VehicleType;
  spotNumber: number;
}

export interface BookingResult {
  success: boolean;
  error?: string;
  data?: Booking;
}
