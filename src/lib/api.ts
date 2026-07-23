/**
 * API client for the Venuewala backend (Node/Express, deployed on Render).
 */

import type { Venue, Review } from '../data/venues';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error(
    'VITE_API_URL is not set. Add it to your .env file, e.g.\nVITE_API_URL=https://venuewala-backend.onrender.com'
  );
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response - ignore body.
  }

  if (!res.ok) {
    const message =
      (body as { error?: string } | null)?.error || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return body as T;
}

export interface VenuewalaUser {
  id: number | string;
  name: string;
  email: string;
  photo?: string;
  role: 'customer' | 'owner' | 'admin';
}

export function loginWithGoogle(
  credential: string,
  intendedRole?: 'customer' | 'owner'
): Promise<{ user: VenuewalaUser }> {
  return apiFetch<{ user: VenuewalaUser }>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential, intendedRole }),
  });
}

export function getMe(): Promise<{ userId: number | string; role: string }> {
  return apiFetch<{ userId: number | string; role: string }>('/api/me');
}

export function logout(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
}

export interface VenueFilters {
  category?: string;
  city?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
}

export function listVenues(filters: VenueFilters = {}): Promise<{ venues: Venue[] }> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.city) params.set('city', filters.city);
  if (filters.q) params.set('q', filters.q);
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.minCapacity) params.set('minCapacity', String(filters.minCapacity));
  const qs = params.toString();
  return apiFetch<{ venues: Venue[] }>(`/api/venues${qs ? `?${qs}` : ''}`);
}

export function getVenue(id: string): Promise<{ venue: Venue; reviews: Review[] }> {
  return apiFetch<{ venue: Venue; reviews: Review[] }>(`/api/venues/${id}`);
}

export interface CreateBookingPayload {
  venueId: string;
  eventDate: string;
  slot: string;
  guests: number;
  eventType: string;
  foodPref: string;
  specialRequests: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  basePrice: number;
  cateringCost: number;
  platformFee: number;
  gstOnPlatform: number;
  total: number;
  advancePaid: number;
  balanceDue: number;
  paymentMethod: string;
}

export interface Booking {
  id: string;
  venueId: string;
  eventDate: string;
  slot: string;
  guests: number;
  eventType: string;
  foodPref: string;
  specialRequests: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  basePrice: number;
  cateringCost: number;
  platformFee: number;
  gstOnPlatform: number;
  total: number;
  advancePaid: number;
  balanceDue: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  venueName?: string;
  venueImage?: string;
  venueArea?: string;
}

/**
 * Creates a real booking record. Matches POST /api/bookings in routes/bookings.js.
 * Note: this only PERSISTS the booking - actual payment is still simulated on
 * the frontend since there's no real payment gateway integrated yet.
 */
export function createBooking(payload: CreateBookingPayload): Promise<{ booking: Booking }> {
  return apiFetch<{ booking: Booking }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Lists the logged-in user's own bookings. Matches GET /api/bookings/mine.
 */
export function listMyBookings(): Promise<{ bookings: Booking[] }> {
  return apiFetch<{ bookings: Booking[] }>('/api/bookings/mine');
}

export const api = {
  loginWithGoogle,
  getMe,
  logout,
  listVenues,
  getVenue,
  createBooking,
  listMyBookings,
};