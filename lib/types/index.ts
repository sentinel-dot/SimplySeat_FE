// lib/types/index.ts
/** API liefert Datum/Zeit-Felder als ISO-String; als string typisiert, damit keine implizite Date-Arithmetik ohne Parsing. */
export interface Venue 
{
    id: number;
    name: string;
    type: 'restaurant' | 'hair_salon' | 'beauty_salon' | 'cafe' | 'bar' | 'spa' | 'other';
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country: string;
    description?: string;
    image_url?: string;
    website_url?: string;
    booking_advance_days: number;
    booking_advance_hours: number;         // Mindestvorlaufzeit für Kundenbuchungen (z.B. 48 Stunden)
    cancellation_hours: number;
    require_phone: boolean;
    require_deposit: boolean;
    deposit_amount?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
 
export interface Service 
{
    id: number;
    venue_id?: number;
    name: string;
    description?: string;
    duration_minutes: number;
    price?: number;
    capacity: number;
    requires_staff: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    /** Bei getVenueById: Mitarbeiter, die diesen Service anbieten (für Schritt „Mitarbeiter wählen“) */
    available_staff?: { id: number; name: string }[];
}

export interface StaffMember {
  id: number;
  venue_id?: number;
  /** Wenn gesetzt: dieser Staff-Eintrag gehört zum Dashboard-User (Owner) */
  user_id?: number | null;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpeningHoursSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface VenueWithStaff extends Venue 
{
    staff_members: StaffMember[];
    services: Service[];
    opening_hours?: OpeningHoursSlot[];
}

export interface TimeSlot 
{
    start_time: string;
    end_time: string;
    available: boolean;
    staff_member_id?: number;
    /** Bei kapazitätsbasierten Services (z. B. Restaurant): freie Plätze in diesem Slot */
    remaining_capacity?: number;
}

export interface DayAvailability 
{
    date: string;
    day_of_week: number;
    time_slots: TimeSlot[];
    /** true wenn an dem Tag keine Öffnungszeiten (geschlossen) */
    is_closed?: boolean;
    /** true wenn der Tag geöffnet wäre, aber wegen Mindestvorlaufzeit keine Slots angeboten werden */
    within_advance_hours?: boolean;
    /** Mindestvorlaufzeit in Stunden (z. B. 48), nur gesetzt wenn within_advance_hours true */
    booking_advance_hours?: number;
}

export interface CreateBookingData
{
    venue_id: number;
    service_id: number;
    staff_member_id?: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    party_size: number;
    special_requests?: string;
    total_amount?: number;
}

export interface Booking extends CreateBookingData
{
    id: number;
    booking_token: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    deposit_paid?: number | null;                 
    payment_status?: string | null;
    confirmation_sent_at?: string | null;
    reminder_sent_at?: string | null;
    cancelled_at?: string | null;
    cancellation_reason?: string | null;
    created_at: string;
    updated_at: string;
    /** Vom Backend bei getBookingByToken geliefert */
    venue_name?: string | null;
    cancellation_hours?: number | null;
    service_name?: string | null;
    staff_member_name?: string | null;
}

// Admin Types
export type AdminRole = 'admin' | 'owner' | 'staff';

export interface AdminUser {
    id: number;
    email: string;
    name: string;
    venue_id: number | null;
    role: AdminRole;
}

export interface LoginResponse {
    token: string;
    user: AdminUser;
}

export interface AdminStats {
    bookings: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        pending: number;
        confirmed: number;
        cancelled: number;
        completed: number;
    };
    revenue: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        total: number;
    };
    popularServices: Array<{
        service_id: number;
        service_name: string;
        booking_count: number;
        total_revenue: number;
    }>;
    popularTimeSlots: Array<{
        hour: number;
        booking_count: number;
    }>;
}

export interface BookingWithDetails extends Booking {
    service_price?: number;
    service_duration?: number;
}

export interface AvailabilityRule {
    id: number;
    venue_id: number | null;
    staff_member_id: number | null;
    staff_member_name?: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

export interface BookingAuditLogEntry {
    id: number;
    action: 'status_change' | 'cancel' | 'update';
    old_status: string | null;
    new_status: string | null;
    reason: string | null;
    actor_type: string;
    actor_label: string | null;
    created_at: string;
}