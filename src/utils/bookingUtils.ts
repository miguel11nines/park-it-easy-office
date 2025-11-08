/**
 * Shared Booking Utilities
 * Common functions for booking validation and logic
 */

import type { Duration } from "@/types/booking";

/**
 * Check if two time durations overlap
 * A "full" day overlaps with both morning and afternoon
 */
export function checkDurationOverlap(a: Duration, b: Duration): boolean {
  if (a === "full" || b === "full") return true;
  return a === b;
}

/**
 * Constants for booking validation
 */
export const BOOKING_CONSTANTS = {
  MAX_MOTORCYCLES: 4,
  VALID_SPOTS: [84, 85],
} as const;
