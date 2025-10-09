import { useState, useEffect } from "react";
import { ParkingSpotCard } from "@/components/ParkingSpotCard";
import { BookingDialog } from "@/components/BookingDialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { BarChart3, Calendar } from "lucide-react";

interface Booking {
  id: string;
  date: string;
  duration: "morning" | "afternoon" | "full";
  vehicleType: "car" | "motorcycle";
  userName: string;
  spotNumber: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from database
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      // Transform database data to match our interface
      const transformedBookings: Booking[] = (data || []).map((booking) => ({
        id: booking.id,
        date: booking.date,
        duration: booking.duration as "morning" | "afternoon" | "full",
        vehicleType: booking.vehicle_type as "car" | "motorcycle",
        userName: booking.user_name,
        spotNumber: booking.spot_number,
      }));

      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSpot = (spotNumber: number) => {
    setSelectedSpot(spotNumber);
    setDialogOpen(true);
  };

  const handleConfirmBooking = async (booking: Omit<Booking, "id">) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_name: booking.userName,
          date: booking.date,
          duration: booking.duration,
          vehicle_type: booking.vehicleType,
          spot_number: booking.spotNumber,
        });

      if (error) throw error;

      toast.success("Parking spot booked successfully!");
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const handleUnbook = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Filter out expired bookings (past dates)
  const today = new Date().toISOString().split('T')[0];
  const activeBookings = bookings.filter(b => b.date >= today);

  const spot84Bookings = activeBookings.filter(b => b.spotNumber === 84);
  const spot85Bookings = activeBookings.filter(b => b.spotNumber === 85);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with improved gradient and mobile padding */}
      <div className="bg-gradient-hero text-primary-foreground py-8 md:py-12 px-4 shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Parking at Work</h1>
              <p className="text-base md:text-xl opacity-90">
                Easy parking spot management for our team
              </p>
            </div>
            <Button
              onClick={() => navigate('/statistics')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all hover:scale-105 self-start md:self-auto"
              size="lg"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">View</span> Statistics
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {loading ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        ) : (
          <>
            {/* Parking Spots Section with improved cards */}
            <section className="animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-primary rounded"></div>
                Available Parking Spots
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ParkingSpotCard
                  spotNumber={84}
                  currentBookings={spot84Bookings}
                  onBook={() => handleBookSpot(84)}
                />
                <ParkingSpotCard
                  spotNumber={85}
                  currentBookings={spot85Bookings}
                  onBook={() => handleBookSpot(85)}
                />
              </div>
            </section>

            {/* All Bookings Section with improved mobile layout */}
            <section className="animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-success rounded"></div>
                Upcoming Bookings
              </h2>
              {activeBookings.length > 0 ? (
                <div className="space-y-3">
                  {activeBookings
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((booking, index) => (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-scale-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
                          <div className="text-center min-w-[50px] sm:min-w-[60px] bg-primary/10 rounded-lg p-2">
                            <div className="text-xl sm:text-2xl font-bold text-primary">
                              {new Date(booking.date).getDate()}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase">
                              {new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{booking.userName}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
                              <span>Spot {booking.spotNumber}</span>
                              <span>•</span>
                              <span>{booking.vehicleType === "car" ? "🚗 Car" : "🏍️ Motorcycle"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                          <div className="text-xs sm:text-sm font-medium px-3 py-1.5 bg-gradient-primary text-white rounded-full shadow-sm">
                            {booking.duration === "full" ? "All Day" : 
                             booking.duration === "morning" ? "Morning" : "Afternoon"}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbook(booking.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                          >
                            Unbook
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No upcoming bookings</p>
                  <p className="text-sm text-muted-foreground mt-1">Book a spot to get started!</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Booking Dialog */}
      {selectedSpot && (
        <BookingDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          spotNumber={selectedSpot}
          existingBookings={activeBookings}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default Index;
